import { getSessionStorage as gss, SetSessionStorageValue as sss } from "./storage/sessionStorage.js";
import { getLocalStorage as gls, SetLocalStorageValue as sls } from "./storage/localStorage.js";
import { getCookies as gc, SetCookieValue as sc } from "./storage/cookie.js";

const tab = getActiveTab();

function getSessionStorage({ keys }) {
  return gss(tab, { keys });
}
function SetSessionStorageValue(key, value) {
  return sss(tab, key, value);
}
function getLocalStorage({ keys }) {
  return gls(tab, { keys });
}
function SetLocalStorageValue(key, value) {
  return sls(tab, key, value);
}
function getCookies({ keys }) {
  return gc(tab, { keys });
}
function saveCookieValue(key, value) {
  return sc(tab, key, value);
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0];
}

export {
  getSessionStorage,
  SetSessionStorageValue,
  getLocalStorage,
  SetLocalStorageValue,
  getCookies,
  saveCookieValue,
};
