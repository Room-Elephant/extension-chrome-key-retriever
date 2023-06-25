const appManager = () => {
  let keyList;

  async function getKeyValues() {
    try {
      keyList = await readStorageKeyList();
      return loadKeyValues();
    } catch (e) {
      console.log("🚀 ~ could not read settings:", e);
    }
  }

  async function persistStorageKeyList(keyList) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ keyList }, function () {
        resolve();
      });
    });
  }

  async function readStorageKeyList() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["keyList"], function (result) {
        if (result["keyList"] === undefined) reject();
        else resolve(result["keyList"]);
      });
    });
  }

  async function loadKeyValues() {
    let presentationList = [];

    let tab;
    try {
      tab = await getActiveTab();
    } catch (e) {
      console.log("🚀 ~ could not read active tab:", e);
    }

    let localKeyPresentation = [];
    try {
      localKeyPresentation = await remoteRequest(
        tab,
        getLocal,
        keyList?.local ?? []
      );
    } catch (e) {
      console.log("🚀 ~ could not read from local storage:", e);
    }
    let cookieKeyPresentation = [];
    try {
      cookieKeyPresentation = await remoteRequest(
        tab,
        getCookie,
        keyList?.cookie ?? []
      );
    } catch (e) {
      console.log("🚀 ~ could not from read cookies:", e);
    }

    presentationList.push(...localKeyPresentation);
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

  async function remoteRequest(tab, func, data) {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func,
      args: [data],
    });
    return result[0].result;
  }

  function getLocal(localKeyList) {
    for (let i = 0; i < localKeyList.length; i++) {
      try {
        let value = window.localStorage.getItem(localKeyList[i].key);

        if (localKeyList[i].subKey) {
          value = JSON.parse(value)[localKeyList[i].subKey];
        }

        localKeyList[i].value = value;
      } catch (e) {}
    }
    return localKeyList.map(({ alias, value }) => ({
      alias,
      value,
      type: "local",
    }));
  }

  function getCookie(cookieKeyList) {
    for (let i = 0; i < cookieKeyList.length; i++) {
      try {
        let value = document.cookie
          .split(cookieKeyList[i].key + "=")[1]
          .split(";")[0];

        if (cookieKeyList[i].subKey) {
          value = JSON.parse(value)[cookieKeyList[i].subKey];
        }

        cookieKeyList[i].value = value;
      } catch (e) {}
    }
    return cookieKeyList.map(({ alias, value }) => ({
      alias,
      value,
      type: "cookies",
    }));
  }

  return {
    persistStorageKeyList,
    getKeyValues,
  };
};
