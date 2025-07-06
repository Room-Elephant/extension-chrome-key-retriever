async function remoteExecution(tab, args, func) {
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args,
    func,
  });
  return result[0].result;
}

function remoteGetLocalStorageItems(keys) {
  try {
    return Object.keys(window.localStorage)
      .filter((localStorageKey) => {
        if (keys.length === 0) return false;
        return keys.find(({ key }) => localStorageKey === key);
      })
      .map((key) => ({
        key,
        value: window.localStorage.getItem(key),
      }));
  } catch (e) {
    return [];
  }
}

function remoteSetLocalStorageValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    return false;
  }
  return true;
}

function remoteGetSessionStorageItems(keys) {
  try {
    return Object.keys(window.sessionStorage)
      .filter((sessionStorageKey) => {
        if (keys.length === 0) return false;
        return keys.find(({ key }) => sessionStorageKey === key);
      })
      .map((key) => ({
        key,
        value: window.sessionStorage.getItem(key),
      }));
  } catch (e) {
    return [];
  }
}

function remoteSetSessionStorageValue(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch (e) {
    return false;
  }
  return true;
}

export {
  remoteExecution,
  remoteGetLocalStorageItems,
  remoteSetLocalStorageValue,
  remoteGetSessionStorageItems,
  remoteSetSessionStorageValue,
};
