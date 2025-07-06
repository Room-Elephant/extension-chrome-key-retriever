function getItems(){

}







function getItems(storeitems){
      const rawSessionItems = await getSessionValues(
      tab,
      storeItems.filter(({ type }) => TYPES.SESSION === type),
    );
    const localKeyPresentation = await getLocalValues(
      tab,
      storeItems.filter(({ type }) => TYPES.LOCAL === type),
    );
    const cookieKeyPresentation = await getCookieValues(
      tab,
      storeItems.filter(({ type }) => TYPES.COOKIE === type),
    );
}

function getCokie(){
      return matchCookies.map((item) => {
    item.value = cookieItems.find(({ name }) => name === item.key)?.value || undefined;
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

async function saveCookieValue(tab, key, subKey = "", value) {
  try {
    return await setBrowserCookieValue(tab, key, subKey, value);
  } catch (e) {
    console.log("🐶 ~ could not set cookie value for key " + key + " :", e);
  }
  return false;
}

async function setBrowserCookieValue(tab, key, subKey, value) {
  const url = tabToStringUrl(tab);
  const domain = tabToStringDomain(tab);
  let details = await chrome.cookies.get({
    name: key,
    url,
  });
  if (details === null) {
    details = { name: key };
  }

  let newValue = value;

  if (subKey) {
    const originalValue = details.value;
    if (details.value !== undefined)
      try {
        newValue = JSON.parse(originalValue);
      } catch (e) {
        newValue = {};
      }
    else newValue = {};

    newValue[subKey] = value;
  }

  const stringifiedValue = newValue instanceof Object ? JSON.stringify(newValue) : newValue;

  details.value = stringifiedValue;

  delete details.hostOnly;
  delete details.session;

  return new Promise((resolve, reject) => {
    chrome.cookies.set({ ...details, url, domain }, function (cookie) {
      if (cookie) resolve();
      else reject();
    });
  });
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








async function remoteExecution(tab, args, func) {
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args,
    func,
  });
  return result[0].result;
}

function getLocalValue(keys) {
  return Object.keys(localStorage)
    .filter((localStorageKey) => {
      if (keys.length === 0) return false;
      return keys.find(({ key }) => localStorageKey === key);
    })
    .map((key) => ({
      key,
      value: localStorage.getItem(key),
    }));
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

export { remoteExecution, getLocalValue, getSessionValue, saveSessionValue, saveLocalValue };

  async function getActiveTab() {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tabs[0];
  }

export { getActiveTab };