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
      const localKeyList = keyList?.filter(({ type }) => type === "local");
      try {
        localKeyPresentation = await remoteRequest(tab, getLocal, localKeyList);
      } catch (e) {
        localKeyPresentation = localKeyList.map(({ alias, type }) => ({
          alias,
          type,
        }));
        console.log("🚀 ~ could not read from local storage:", e);
      }
    }

    let cookieKeyPresentation = [];
    if (keyList != null && keyList.length > 0) {
      const cookieKeyList = keyList?.filter(({ type }) => type === "cookie");
      try {
        cookieKeyPresentation = await getCookie(
          cookieKeyList,
          tabToStringUrl(tab)
        );
      } catch (e) {
        cookieKeyPresentation = cookieKeyList.map(({ alias, type }) => ({
          alias,
          type,
        }));
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

  async function getCookie(cookieKeyList, url) {
    const cookies = await chrome.cookies.getAll({ url });
    const keyListKeys = cookieKeyList.map(({ key }) => key);

    const matchCookies = cookies
      .filter(({ name }) => keyListKeys.includes(name))
      .map(({ name, value }) => ({ name, value, type: "cookie" }));

    return cookieKeyList.map(({ alias, key, type }) => {
      value = matchCookies.find(({ name }) => name === key)?.value || undefined;
      return { alias, type, value };
    });
  }

  function tabToStringUrl(tab) {
    const url = new URL(tab.url);
    return url.protocol + "//" + url.hostname;
  }

  return {
    persistNewKey,
    removePersistKey,
    getKeyValues,
  };
};
