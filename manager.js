const appManager = () => {
  var keyList;

  async function getKeyValues() {
    try {
      keyList = await readStorageKeyList();
    } catch (e) {
      console.log("🚀 ~ could not read settings:", e);
    }
    return loadKeyValues();
  }

  async function persistStorageKeyList(keyList) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ keyList: keyList }, function (result) {
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
          if (typeof value === "object") value = value[localKeyList[i].subKey];
          if (typeof value === "string")
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

  function getCookie(cookieKeys) {
    for (let i = 0; i < cookieKeys.length; i++) {
      try {
        let value = (cookieKeys[i].value = document.cookie
          .split(cookieKeys[i].key + "=")[1]
          .split(";")[0]);

        if (cookieKeyList[i].subKey) {
          if (typeof value === "object") value = value[cookieKeys[i].subKey];
          if (typeof value === "string")
            value = JSON.parse(value)[cookieKeys[i].subKey];
        }

        cookieKeys[i].value = value;
      } catch (e) {}
    }
    return cookieKeys.map(({ alias, value }) => ({
      alias,
      value,
      type: "cookies",
    }));
  }

  function parseSubKey(value, subKey) {
    if (typeof value === "object") return value[subKey];
    if (typeof value === "string") return JSON.parse(value)[subKey];
  }

  return {
    persistStorageKeyList,
    getKeyValues,
  };
};
