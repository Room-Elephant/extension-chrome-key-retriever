const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const KEY_URL = "https://europe-west1-room-elephnat-key-retriever.cloudfunctions.net/getKeys";
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
    await fetch(`${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${await getKey()}`, {
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

async function getKey() {
  let { apiKey } = await chrome.storage.local.get("apiKey");
  if (apiKey !== null && apiKey !== undefined) return apiKey;

  const request = await fetch(KEY_URL, { method: "POST" });
  const json = await request.json();

  apiKey = json.googleSecreteKey;
  await chrome.storage.local.set({ apiKey });
  return apiKey;
}

addEventListener("unhandledrejection", async (event) => {
  fireErrorEvent(event.reason);
});

export { fireEvent, firePageViewEvent, fireErrorEvent };
