const appManager = () => {
  let keyList = [];

  async function persistNewKey(newKeys) {
    let lastId = getLastId();

    const indexedNewKeys = newKeys.map((newKey) => ({
      ...newKey,
      id: ++lastId,
    }));

    return new Promise((resolve) => {
      chrome.storage.local.set(
        { keyList: [...keyList, ...indexedNewKeys] },
        function () {
          resolve();
        }
      );
    });
  }

  async function removePersistKey(idsToRemove) {
    return new Promise((resolve) => {
      chrome.storage.local.set(
        { keyList: keyList.filter(({ id }) => !idsToRemove.includes(id)) },
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
      return keyList.map(({ alias, type, id }) => ({
        id,
        alias,
        type,
      }));
    }

    const sessionKeyPresentation = await reader.getSessionKeys(tab);
    const localKeyPresentation = await reader.getLocalKeys(tab);
    const cookieKeyPresentation = await reader.getCookieKeys(tab);

    presentationList.push(...sessionKeyPresentation);
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

  function getLastId() {
    return [...keyList].sort((a, b) => a.id - b.id).slice(-1)[0]?.id || 0;
  }

  async function setKeyValue(id, value) {
    let tab;
    try {
      tab = await getActiveTab();
    } catch (e) {
      console.log("🚀 ~ could not read active tab:", e);
      return false;
    }

    const writer = keyWriter();
    const key = keyList.find((key) => key.id === id)[0];

    switch (key.type) {
      case TYPES.SESSION:
        return writer.setSessionKeys(tab, key.key, key.subKey, value);
      case TYPES.LOCAL:
        return writer.setLocalKeys(tab, key.key, key.subKey, value);
      case TYPES.COOKIE:
        return writer.setLocalKeys(key.key, key.subKey, value);
    }

    return false;
  }

  return {
    persistNewKey,
    removePersistKey,
    getKeyValues,
    setKeyValue,
  };
};
