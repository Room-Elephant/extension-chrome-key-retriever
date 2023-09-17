import {
  executeRequest,
  saveSessionValue as remoteSaveSessionValue,
  saveLocalValue as remoteSaveLocalValue,
} from "./operation/remote";
import { saveCookieValue as chromeSaveCookieValue } from "./operation/cookie";
import { StoredItem } from "../types/storedItem";

async function saveSessionValue(
  tab: chrome.tabs.Tab,
  key: StoredItem["key"],
  subKey: StoredItem["subKey"] = "",
  value: StoredItem["value"],
) {
  try {
    return executeRequest(tab, [key, subKey, value], remoteSaveSessionValue);
  } catch (e) {
    console.log("🐶 ~ could not set session value for key " + key + " :", e);
  }
  return false;
}

async function saveLocalValue(
  tab: chrome.tabs.Tab,
  key: StoredItem["key"],
  subKey: StoredItem["subKey"] = "",
  value: StoredItem["value"],
) {
  try {
    return executeRequest(tab, [key, subKey, value], remoteSaveLocalValue);
  } catch (e) {
    console.log("🐶 ~ could not set local value for key " + key + " :", e);
  }
  return false;
}

async function saveCookieValue(tab: chrome.tabs.Tab, key, subKey = "", value) {
  try {
    return await chromeSaveCookieValue(tab, key, subKey, value);
  } catch (e) {
    console.log("🐶 ~ could not set cookie value for key " + key + " :", e);
  }
  return false;
}

export { saveSessionValue, saveLocalValue, saveCookieValue };
