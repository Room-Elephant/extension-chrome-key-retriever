import { Types } from "../../types/constants";
import { StoredItem } from "../../types/storedItem";

async function getCookie(tab: chrome.tabs.Tab, cookieStoreItems: StoredItem[]) {
  const cookies = await chrome.cookies.getAll({ url: tabToStringUrl(tab) });
  const cookieStoreItemsKeys = cookieStoreItems.map(({ key }) => key);

  const matchCookies = cookies
    .filter(({ name }) => cookieStoreItemsKeys.includes(name))
    .map(({ name, value }) => ({ name, value, type: Types.COOKIE }));

  return cookieStoreItems.map((item) => {
    item.value = matchCookies.find(({ name }) => name === item.key)?.value || undefined;
    if (item.subKey) {
      try {
        item.value = JSON.parse(item.value)[item.subKey];
      } catch {
        item.value = undefined;
      }
    }
    return item;
  });
}

async function saveCookieValue(
  tab: chrome.tabs.Tab,
  key: StoredItem["key"],
  subKey: StoredItem["subKey"],
  value: StoredItem["value"],
) {
  const url = tabToStringUrl(tab);
  const domain = tabToStringDomain(tab);
  let details: chrome.cookies.Cookie | { [key: string]: string } = await chrome.cookies.get({
    name: key,
    url,
  });
  details ??= { name: key };

  let newValue: string | Record<string, unknown> = value;

  if (subKey) {
    const originalValue = details?.value;
    if (details?.value !== undefined)
      try {
        newValue = JSON.parse(originalValue) as Record<string, unknown>;
      } catch (_) {
        newValue = {};
      }
    else newValue = {};

    newValue[subKey] = value;
  }

  const stringifiedValue: string = typeof newValue === "object" && newValue !== null
    ? JSON.stringify(newValue)
    : newValue as string;

  details.value = stringifiedValue;

  delete details.hostOnly;
  delete details.session;

  return new Promise<void>((resolve, reject) => {
    chrome.cookies.set({ ...details, url, domain }, function (cookie) {
      if (cookie) resolve();
      else reject(new Error('Failed to set'));
    });
  });
}

function tabToStringUrl(tab: chrome.tabs.Tab) {
  const url = new URL(tab.url || "");
  return `${url.protocol}//${url.hostname}`;
}

function tabToStringDomain(tab: chrome.tabs.Tab) {
  const url = new URL(tab.url || "");
  return `.${url.hostname}`;
}

export { getCookie, saveCookieValue };
