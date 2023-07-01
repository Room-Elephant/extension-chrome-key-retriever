const appManager = () => {
  let keyList = [];

  async function persistNewKey(newKey) {
    return new Promise((resolve) => {
      chrome.storage.local.set(
        { keyList: [...keyList, ...newKey] },
        function () {
          resolve();
        }
      );
    });
  }

  async function removePersistKey(key) {
    return new Promise((resolve) => {
      chrome.storage.local.set(
        { keyList: keyList.filter(({ alias }) => !key.includes(alias)) },
        function () {
          resolve();
        }
      );
    });
  }

  async function getKeyValues() {
    try {
      keyList = await readStorageKeyList();
    } catch (e) {
      console.log("🚀 ~ could not read settings:", e);
      return [];
    }
    return getPresentationList();
  }

  async function readStorageKeyList() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["keyList"], function (result) {
        if (result["keyList"] === undefined) reject();
        else resolve(result["keyList"]);
      });
    });
  }

  async function getPresentationList() {
    const reader = keyReader(keyList);
    let presentationList = [];

    let tab;
    try {
      tab = await getActiveTab();
    } catch (e) {
      console.log("🚀 ~ could not read active tab:", e);
      return keyList.map(({ alias, type }) => ({
        alias,
        type,
      }));
    }

    const localKeyPresentation = await reader.getLocalKeys(tab);
    const sessionKeyPresentation = await reader.getSessionKeys(tab);
    const cookieKeyPresentation = await reader.getCookieKeys(tab);

    presentationList.push(...localKeyPresentation);
    presentationList.push(...sessionKeyPresentation);
    presentationList.push(...cookieKeyPresentation);

    return presentationList;
  }

  async function getActiveTab() {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tabs[0];
  }

  return {
    persistNewKey,
    removePersistKey,
    getKeyValues,
  };
};
