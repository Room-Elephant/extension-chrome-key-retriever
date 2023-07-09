const keyWriter = () => {
  async function setSessionKey(tab, key, subKey, value) {
    return await setKeyInRemote(tab, key, subKey, value, setSession);
  }

  async function setLocalKey(tab, key, subKey, value) {
    return await setKeyInRemote(tab, key, subKey, value, setLocal);
  }

  async function setCookieKey(tab, key, subKey, value) {
    let url = tabToStringUrl(tab);
    let domain = tabToStringDomain(tab);
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

    const stringifiedValue =
      newValue instanceof Object ? JSON.stringify(newValue) : newValue;

    details.value = stringifiedValue;

    delete details.hostOnly;
    delete details.session;

    return new Promise((resolve) => {
      chrome.cookies.set({ ...details, url, domain }, function (cookie) {
        if (cookie) resolve();
        else reject();
      });
    });
  }

  async function setKeyInRemote(tab, key, subKey, value, setterFnc) {
    let requestedTypeKeyPresentation = [];
    try {
      requestedTypeKeyPresentation = await remoteRequest(
        tab,
        key,
        subKey,
        value,
        setterFnc
      );
    } catch (e) {
      console.log(
        "🚀 ~ could not set key " + key + " in " + requestedType + " storage:",
        e
      );
      return false;
    }

    return requestedTypeKeyPresentation;
  }

  async function remoteRequest(tab, key, subKey = "", value, func) {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func,
      args: [key, subKey, value],
    });
    return result[0].result;
  }

  function setSession(key, subKey, value) {
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

      const stringifiedValue =
        newValue instanceof Object ? JSON.stringify(newValue) : newValue;

      window.sessionStorage.setItem(key, stringifiedValue);
    } catch (e) {
      return false;
    }

    return true;
  }

  function setLocal(key, subKey, value) {
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

      const stringifiedValue =
        newValue instanceof Object ? JSON.stringify(newValue) : newValue;

      window.localStorage.setItem(key, stringifiedValue);
    } catch (e) {
      return false;
    }

    return true;
  }

  function tabToStringUrl(tab) {
    const url = new URL(tab.url);
    return url.protocol + "//" + url.hostname;
  }

  function tabToStringDomain(tab) {
    const url = new URL(tab.url);
    return "." + url.hostname;
  }

  return {
    setSessionKey,
    setLocalKey,
    setCookieKey,
  };
};
