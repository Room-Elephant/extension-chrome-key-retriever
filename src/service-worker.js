const analytics = Analytics();

addEventListener("unhandledrejection", async (event) => {
  analytics.fireErrorEvent(event.reason);
});

chrome.runtime.onInstalled.addListener(() => {
  analytics.fireEvent("install");
});

setTimeout(throwAnException, 2000);

async function throwAnException() {
  throw new Error("👋 I'm an error");
}
