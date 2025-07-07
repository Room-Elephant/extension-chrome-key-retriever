import { StoredItem } from "../../types/storedItem";

async function executeRequest(
  tab: chrome.tabs.Tab,
  args: string[] | StoredItem[][],
  func: (...args: string[] | StoredItem[][]) => boolean | StoredItem[],
) {
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args,
    func,
  });
  return result[0].result;
}

function getLocalValue(localItems) {
  for (const element of localItems) {
    try {
      let value = window.localStorage.getItem(element.key);

      if (element.subKey) {
        value = JSON.parse(value)[element.subKey];
      }

      element.value = value;
    } catch (_) {
      /* empty */
    }
  }
  return localItems;
}

function getSessionValue(sessionItems: StoredItem[]) {
  for (const element of sessionItems) {
    try {
      let value = window.sessionStorage.getItem(element.key);

      if (element.subKey) {
        value = JSON.parse(value)[element.subKey];
      }

      element.value = value;
    } catch (_) {
      /* empty */
    }
  }
  return sessionItems;
}

function saveSessionValue(key: StoredItem["key"], subKey: StoredItem["subKey"], value: StoredItem["value"]) {
  try {
    let newValue: string | Record<string, unknown> = value;

    if (subKey) {
      const originalValue = window.sessionStorage.getItem(key) || "{}";
      try {
        newValue = JSON.parse(originalValue);
      } catch {
        newValue = {};
      }
      newValue[subKey] = value;
    }

    const stringifiedValue = typeof newValue === "object" ? JSON.stringify(newValue) : newValue;

    window.sessionStorage.setItem(key, stringifiedValue);
  } catch (_) {
    return false;
  }

  return true;
}

function saveLocalValue(key: StoredItem["key"], subKey: StoredItem["subKey"], value: StoredItem["value"]) {
  try {
    let newValue: string | Record<string, unknown>    = value;

    if (subKey) {
      const originalValue = window.localStorage.getItem(key) || "{}";
      try {
        newValue = JSON.parse(originalValue);
      } catch {
        newValue = {};
      }

      newValue[subKey] = value;
    }

    const stringifiedValue = typeof newValue === "object" ? JSON.stringify(newValue) : newValue;

    window.localStorage.setItem(key, stringifiedValue);
  } catch (_) {
    return false;
  }

  return true;
}

export { executeRequest, getLocalValue, getSessionValue, saveSessionValue, saveLocalValue };
