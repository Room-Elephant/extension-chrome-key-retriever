import { AppPage } from "../page";
import { firePageViewEvent } from "./analytics";

function versionController(page: AppPage) {
  const currentVersion = chrome.runtime.getManifest().version;
  firePageViewEvent("Extension page", document.location.href, { version: currentVersion });

  fetch("https://key-retriever.room-elephant.com/manifest.json")
    .then((response) => {
      if (!response.ok) {
        console.log("🐶 ~ could not get the latest version");
      }

      return response.json();
    })
    .then((response: { version: string }) => {
      const latestVersion = response.version;

      if (isOutdated(currentVersion, latestVersion)) page.alertOutdatedVersion();
    })
    .catch((err: Error) => {
      console.log("🐶 ~ could not validate version due to:", err);
    });

  function isOutdated(current: string, latest: string) {
    const splittedCurrent = current.split(".");
    const splittedLatest = latest?.split(".") || [];

    if (splittedLatest.length !== 3) return false;

    if (splittedLatest[0] > splittedCurrent[0]) return true;
    if (splittedLatest[1] > splittedCurrent[1]) return true;
    if (splittedLatest[2] > splittedCurrent[2]) return true;

    return false;
  }
}

export default versionController;
