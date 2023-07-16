(function versionController() {
  fetch("https://key-retriever.room-elephant.com/manifest.json")
    .then((response) => {
      if (!response.ok) {
        console.log("🐶 ~ could not get the latest version");
      }

      return response.json();
    })
    .then((response) => {
      const latestVersion = response.version;
      const currentVersion = chrome.runtime.getManifest().version;

      if (isOutdated(currentVersion, latestVersion))
        page.alertOutdatedVersion();
    })
    .catch((err) => {
      console.log("🐶 ~ could not validate version due to:", err);
    });

  function isOutdated(current, latest) {
    const splittedCurrent = current.split(".");
    const splittedLatest = latest?.split(".") || [];

    if (splittedLatest.length !== 3) return false;

    if (splittedLatest[0] > splittedCurrent[0]) return true;
    if (splittedLatest[1] > splittedCurrent[1]) return true;
    if (splittedLatest[2] > splittedCurrent[2]) return true;

    return false;
  }
})();
