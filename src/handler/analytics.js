function appAnalytics() {
  const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";

  const MEASUREMENT_ID = "G-YWK0G1DQY7";
  const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;

  const SESSION_EXPIRATION_IN_MIN = 30;

  async function fireEvent(name, params = {}) {
    if (!params.session_id) {
      params.session_id = await getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    }

    try {
      await fetch(`${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${getKey()}`, {
        method: "POST",
        body: JSON.stringify({
          client_id: await getOrCreateClientId(),
          events: [
            {
              name,
              params,
            },
          ],
        }),
      });
    } catch (e) {
      console.error("Google Analytics request failed with an exception", e);
    }
  }

  async function firePageViewEvent(pageTitle, pageLocation, additionalParams = {}) {
    return fireEvent("page_view", {
      page_title: pageTitle,
      page_location: pageLocation,
      ...additionalParams,
    });
  }

  async function fireErrorEvent(error, additionalParams = {}) {
    return fireEvent("extension_error", {
      ...error,
      ...additionalParams,
    });
  }

  async function getOrCreateClientId() {
    let { clientId } = await chrome.storage.local.get("clientId");
    if (!clientId) {
      clientId = self.crypto.randomUUID();
      await chrome.storage.local.set({ clientId });
    }
    return clientId;
  }

  async function getOrCreateSessionId() {
    let { sessionData } = await chrome.storage.session.get("sessionData");
    const currentTimeInMs = Date.now();
    if (sessionData && sessionData.timestamp) {
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        sessionData = null;
      } else {
        sessionData.timestamp = currentTimeInMs;
        await chrome.storage.session.set({ sessionData });
      }
    }
    if (!sessionData) {
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString(),
      };
      await chrome.storage.session.set({ sessionData });
    }
    return sessionData.session_id;
  }

  function getKey() {
    return (
      (30).toString(36).toLowerCase() +
      (29)
        .toString(36)
        .toLowerCase()
        .split("")
        .map(function (r) {
          return String.fromCharCode(r.charCodeAt() + -71);
        })
        .join("") +
      (55773712).toString(36).toLowerCase() +
      (24)
        .toString(36)
        .toLowerCase()
        .split("")
        .map(function (M) {
          return String.fromCharCode(M.charCodeAt() + -39);
        })
        .join("") +
      (10)
        .toString(36)
        .toLowerCase()
        .split("")
        .map(function (z) {
          return String.fromCharCode(z.charCodeAt() + -13);
        })
        .join("") +
      (23)
        .toString(36)
        .toLowerCase()
        .split("")
        .map(function (D) {
          return String.fromCharCode(D.charCodeAt() + -39);
        })
        .join("") +
      (30).toString(36).toLowerCase() +
      (function () {
        var w = Array.prototype.slice.call(arguments),
          v = w.shift();
        return w
          .reverse()
          .map(function (X, T) {
            return String.fromCharCode(X - v - 56 - T);
          })
          .join("");
      })(22, 137, 134, 128) +
      (20)
        .toString(36)
        .toLowerCase()
        .split("")
        .map(function (a) {
          return String.fromCharCode(a.charCodeAt() + -39);
        })
        .join("") +
      (34).toString(36).toLowerCase() +
      (function () {
        var A = Array.prototype.slice.call(arguments),
          V = A.shift();
        return A.reverse()
          .map(function (R, z) {
            return String.fromCharCode(R - V - 3 - z);
          })
          .join("");
      })(22, 112) +
      (13).toString(36).toLowerCase() +
      (17)
        .toString(36)
        .toLowerCase()
        .split("")
        .map(function (i) {
          return String.fromCharCode(i.charCodeAt() + -39);
        })
        .join("") +
      (190).toString(36).toLowerCase() +
      (33)
        .toString(36)
        .toLowerCase()
        .split("")
        .map(function (z) {
          return String.fromCharCode(z.charCodeAt() + -39);
        })
        .join("")
    );
  }

  return {
    fireEvent,
    firePageViewEvent,
    fireErrorEvent,
  };
}

addEventListener("unhandledrejection", async (event) => {
  analytics.fireErrorEvent(event.reason);
});
