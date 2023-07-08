const keyWriter = () => {
    async function setSessionKeys(tab, key, subKey, value) {
      return await setKeyInRemote(tab, key, subKey, value, setSession);
    }
  
    async function setLocalKey(tab, key, subKey, value) {
      return await setKeyInRemote(tab, key, subKey, value, setLocal);
    }
  
    async function setCookie(key, subKey, value) {
      let cookie = await chrome.cookies.get({ name: key });
      if (cookie === undefined) {
        cookie = {};
        cookie.name = key;
      }
  
      if (subKey) {
        cookie.value[subKey] = value;
      } else {
        cookie.value = value;
      }
  
      return new Promise((resolve) => {
        chrome.cookies.set(details, function (cookie) {
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
        requestedTypeKeyPresentation = keyListToPresentationList(filteredKeyList);
        console.log(
          "🚀 ~ could not set key " + key + " in " + requestedType + " storage:",
          e
        );
      }
  
      return requestedTypeKeyPresentation;
    }
  
    async function remoteRequest(tab, key, subKey, value, func) {
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
          const originalValue = window.sessionStorage.getItem(key);
          const newValue = JSON.parse(originalValue);
  
          newValue[subKey] = value;
        }
  
        const stringifiedValue =
          newValue instanceof Object ? JSON.stringify(value) : value;
  
        window.sessionStorage.setItem(key, stringifiedValue);
      } catch (e) {
        return false;
      }
  
      return true;
    }
  
    function setLocal(key, value) {
      try {
        let newValue = value;
  
        if (subKey) {
          const originalValue = window.localStorage.getItem(key);
          const newValue = JSON.parse(originalValue);
  
          newValue[subKey] = value;
        }
  
        const stringifiedValue =
          newValue instanceof Object ? JSON.stringify(value) : value;
  
        window.localStorage.setItem(key, stringifiedValue);
      } catch (e) {
        return false;
      }
  
      return true;
    }
  
    return {
      setSessionKeys,
      setLocalKey,
      setCookie,
    };
  };
  