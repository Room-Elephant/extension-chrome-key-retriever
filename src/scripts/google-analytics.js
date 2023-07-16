const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const GA_DEBUG_ENDPOINT = "https://www.google-analytics.com/debug/mp/collect";

const MEASUREMENT_ID = "G-YWK0G1DQY7";
const API_SECRET = "";
const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;

const SESSION_EXPIRATION_IN_MIN = 30;

function Analytics(debug) {
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

  async function fireEvent(name, params = {}) {
    if (!params.session_id) {
      params.session_id = await this.getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    }

    try {
      const response = await fetch(
        `${debug ? GA_DEBUG_ENDPOINT : GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: await this.getOrCreateClientId(),
            events: [
              {
                name,
                params,
              },
            ],
          }),
        },
      );
      if (!debug) {
        return;
      }
      console.log(await response.text());
    } catch (e) {
      console.error("Google Analytics request failed with an exception", e);
    }
  }

  async function firePageViewEvent(pageTitle, pageLocation, additionalParams = {}) {
    return this.fireEvent("page_view", {
      page_title: pageTitle,
      page_location: pageLocation,
      ...additionalParams,
    });
  }

  async function fireErrorEvent(error, additionalParams = {}) {
    return this.fireEvent("extension_error", {
      ...error,
      ...additionalParams,
    });
  }

  return {
    getOrCreateClientId,
    getOrCreateSessionId,
    fireEvent,
    firePageViewEvent,
    fireErrorEvent,
  };
}
