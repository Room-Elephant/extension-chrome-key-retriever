import { ITEM_TYPES } from "./types/index.js";
import { getSessionValues, getLocalValues, getCookieValues } from "./handler/valueReader.js";
import { saveSessionValue, saveLocalValue, saveCookieValue } from "./handler/valueWriter.js";

function appManager() {
  let tab;

  getActiveTab().then((result) => {
    tab = result;
  });

  async function getItemsValue(storeItems) {
    const valueItems = [];

    const currentSessionKeysAndValues = await getSessionValues(
      tab,
      storeItems.filter(({ type }) => ITEM_TYPES.SESSION === type),
    );
    const currentLocalKeysAndValues = await getLocalValues(
      tab,
      storeItems.filter(({ type }) => ITEM_TYPES.LOCAL === type),
    );
    const currentCookieKeysAndValues = await getCookieValues(
      tab,
      storeItems.filter(({ type }) => ITEM_TYPES.COOKIE === type),
    );

    valueItems.push(...currentSessionKeysAndValues.map(({ id, value }) => ({ id, value })));
    valueItems.push(...currentLocalKeysAndValues.map(({ id, value }) => ({ id, value })));
    valueItems.push(...currentCookieKeysAndValues.map(({ id, value }) => ({ id, value })));

    return valueItems;
  }

  async function setItemValue(item, value) {
    switch (item.type) {
      case ITEM_TYPES.SESSION:
        return saveSessionValue(tab, item.key, item.subKey, value);
      case ITEM_TYPES.LOCAL:
        return saveLocalValue(tab, item.key, item.subKey, value);
      case ITEM_TYPES.COOKIE:
        return saveCookieValue(tab, item.key, item.subKey, value);
    }

    return false;
  }

  async function getActiveTab() {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tabs[0];
  }

  return {
    getItemsValue,
    setItemValue,
  };
}

export default appManager;
