async function executeRequest(tab, args, func) {
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args,
    func,
  });
  return result[0].result;
}

function getLocalValue(localItems) {
  for (let i = 0; i < localItems.length; i++) {
    try {
      let value = window.localStorage.getItem(localItems[i].key);

      if (localItems[i].subKey) {
        value = JSON.parse(value)[localItems[i].subKey];
      }

      localItems[i].value = value;
    } catch (e) {
      /* empty */
    }
  }
  return localItems;
}

function saveLocalValue(key, subKey, value) {
  try {
    let newValue = value;

    if (subKey) {
      const originalValue = window.localStorage.getItem(key) || {};
      try {
        newValue = JSON.parse(originalValue);
      } catch {
        newValue = {};
      }

      newValue[subKey] = value;
    }

    const stringifiedValue = newValue instanceof Object ? JSON.stringify(newValue) : newValue;

    window.localStorage.setItem(key, stringifiedValue);
  } catch (e) {
    return false;
  }

  return true;
}

function getSessionValue(sessionItems) {
  for (let i = 0; i < sessionItems.length; i++) {
    try {
      let value = window.sessionStorage.getItem(sessionItems[i].key);

      if (sessionItems[i].subKey) {
        value = JSON.parse(value)[sessionItems[i].subKey];
      }

      sessionItems[i].value = value;
    } catch (e) {
      /* empty */
    }
  }
  return sessionItems;
}

function saveSessionValue(key, subKey, value) {
  try {
    let newValue = value;

    if (subKey) {
      const originalValue = window.sessionStorage.getItem(key) || {};
      try {
        newValue = JSON.parse(originalValue);
      } catch {
        newValue = {};
      }
      newValue[subKey] = value;
    }

    const stringifiedValue = newValue instanceof Object ? JSON.stringify(newValue) : newValue;

    window.sessionStorage.setItem(key, stringifiedValue);
  } catch (e) {
    return false;
  }

  return true;
}

export { executeRequest, getLocalValue, getSessionValue, saveSessionValue, saveLocalValue };
