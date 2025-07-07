import { executeRequest, getSessionValue, getLocalValue } from "./operation/remote";
import { getCookie } from "./operation/cookie";
import { StoredItem } from "../types/storedItem";

async function getSessionValues(tab: chrome.tabs.Tab, sessionStoreItems: StoredItem[]): Promise<StoredItem[]> {
  try {
    return executeRequest(tab, [sessionStoreItems], getSessionValue) as Promise<StoredItem[]>;
  } catch (e) {
    console.log("🐶 ~ could not read session values:", e);
  }
  return sessionStoreItems;
}

async function getLocalValues(tab: chrome.tabs.Tab, localStoreItems: StoredItem[]): Promise<StoredItem[]> {
  try {
    return executeRequest(tab, [localStoreItems], getLocalValue) as Promise<StoredItem[]>;
  } catch (e) {
    console.log("🐶 ~ could not read local values:", e);
  }
  return localStoreItems;
}

async function getCookieValues(tab: chrome.tabs.Tab, cookieStoreItems: StoredItem[]): Promise<StoredItem[]> {
  try {
    return getCookie(tab, cookieStoreItems);
  } catch (e) {
    console.log("🐶 ~ could not read cookie values:", e);
  }

  return cookieStoreItems;
}

export { getSessionValues, getLocalValues, getCookieValues };
