import { TYPES } from "./common.js";
import { getSessionValues, getLocalValues, getCookieValues } from "./handler/valueReader.js";
import { saveSessionValue, saveLocalValue, saveCookieValue } from "./handler/valueWriter.js";

function appManager() {
  let tab;

  getActiveTab().then((result) => {
    tab = result;
  });

  async function getItemsValue(storeItems) {
    const valueItems = [];



    valueItems.push(...sessionKeyPresentation.map(({ id, value }) => ({ id, value })));
    valueItems.push(...localKeyPresentation.map(({ id, value }) => ({ id, value })));
    valueItems.push(...cookieKeyPresentation.map(({ id, value }) => ({ id, value })));

    return valueItems;
  }

  async function setItemValue(item, value) {
    switch (item.type) {
      case TYPES.SESSION:
        return saveSessionValue(tab, item.key, item.subKey, value);
      case TYPES.LOCAL:
        return saveLocalValue(tab, item.key, item.subKey, value);
      case TYPES.COOKIE:
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
