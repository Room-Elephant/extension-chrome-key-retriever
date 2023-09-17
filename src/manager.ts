import { Types } from "./types/constants";
import { getSessionValues, getLocalValues, getCookieValues } from "./handler/valueReader";
import { saveSessionValue, saveLocalValue, saveCookieValue } from "./handler/valueWriter";
import { Item } from "./types/item";
import { StoredItem, ValueItem } from "./types/storedItem";

function appManager() {
  let tab: chrome.tabs.Tab;

  getActiveTab().then((result) => {
    tab = result;
  });

  async function getItemsValue(storeItems: StoredItem[]) {
    const valueItems: ValueItem[] = [];

    const sessionKeyPresentation = await getSessionValues(
      tab,
      storeItems.filter(({ type }) => Types.SESSION === type),
    );
    const localKeyPresentation = await getLocalValues(
      tab,
      storeItems.filter(({ type }) => Types.LOCAL === type),
    );
    const cookieKeyPresentation = await getCookieValues(
      tab,
      storeItems.filter(({ type }) => Types.COOKIE === type),
    );

    valueItems.push(...sessionKeyPresentation.map(({ id, value }) => ({ id, value })));
    valueItems.push(...localKeyPresentation.map(({ id, value }) => ({ id, value })));
    valueItems.push(...cookieKeyPresentation.map(({ id, value }) => ({ id, value })));

    return valueItems;
  }

  async function setItemValue(item: Item, value: string) {
    switch (item.type) {
      case Types.SESSION:
        return saveSessionValue(tab, item.key, item.subKey, value);
      case Types.LOCAL:
        return saveLocalValue(tab, item.key, item.subKey, value);
      case Types.COOKIE:
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
