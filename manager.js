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
    }
    return loadKeyValues();
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
      return null;
    }

    let localKeyPresentation = [];
    if (keyList != null && keyList.length > 0) {
      try {
        localKeyPresentation = await remoteRequest(
          tab,
          getLocal,
          keyList?.filter(({ type }) => type === "local")
        );
      } catch (e) {
        console.log("🚀 ~ could not read from local storage:", e);
      }
    }

    let cookieKeyPresentation = [];
    if (keyList != null && keyList.length > 0) {
      try {
        cookieKeyPresentation = await remoteRequest(
          tab,
          getCookie,
          keyList?.filter(({ type }) => type === "cookie")
        );
      } catch (e) {
        console.log("🚀 ~ could not from read cookies:", e);
      }
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
    return localKeyList.map(({ alias, value, type }) => ({
      alias,
      value,
      type,
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
    return cookieKeyList.map(({ alias, value, type }) => ({
      alias,
      value,
      type,
    }));
  }

  return {
    persistNewKey,
    removePersistKey,
    getKeyValues,
  };
};
