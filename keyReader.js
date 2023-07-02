const keyReader = (listOfKeys) => {
  const keyList = listOfKeys;
  async function getLocalKeys(tab) {
    return await getPresentationValuesFromRemote(TYPES.LOCAL, tab, getLocal);
  }

  async function getSessionKeys(tab) {
    return await getPresentationValuesFromRemote(
      TYPES.SESSION,
      tab,
      getSession
    );
  }

  async function getCookieKeys(tab) {
    let cookieKeyPresentation = [];
    if (keyList != null && keyList.length > 0) {
      const cookieKeyList = keyList?.filter(({ type }) => type === TYPES.COOKIE);
      try {
        cookieKeyPresentation = await getCookie(
          cookieKeyList,
          tabToStringUrl(tab)
        );
      } catch (e) {
        cookieKeyPresentation = keyListToPresentationList(cookieKeyList);
        console.log("🚀 ~ could not from read cookies:", e);
      }
    }
    return cookieKeyPresentation;
  }

  async function getPresentationValuesFromRemote(
    requestedType,
    tab,
    retrieverFnc
  ) {
    let requestedTypeKeyPresentation = [];

    if (keyList != null && keyList.length > 0) {
      const filteredKeyList = keyList?.filter(
        ({ type }) => type === requestedType
      );
      if (filteredKeyList.length > 0) {
        try {
          requestedTypeKeyPresentation = await remoteRequest(
            tab,
            retrieverFnc,
            filteredKeyList
          );
        } catch (e) {
          requestedTypeKeyPresentation =
            keyListToPresentationList(filteredKeyList);
          console.log(
            "🚀 ~ could not read from " + requestedType + " storage:",
            e
          );
        }
      }
    }
    return requestedTypeKeyPresentation;
  }

  async function remoteRequest(tab, func, data) {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func,
      args: [data],
    });
    return result[0].result;
  }

  function getLocal(localKeyList) {
    for (let i = 0; i < localKeyList.length; i++) {
      try {
        let value = window.localStorage.getItem(localKeyList[i].key);

        if (localKeyList[i].subKey) {
          value = JSON.parse(value)[localKeyList[i].subKey];
        }

        localKeyList[i].value = value;
      } catch (e) {}
    }
    return localKeyList.map(({ alias, value, type }) => ({
      alias,
      value,
      type,
    }));
  }

  function getSession(localKeyList) {
    for (let i = 0; i < localKeyList.length; i++) {
      try {
        let value = window.sessionStorage.getItem(localKeyList[i].key);

        if (localKeyList[i].subKey) {
          value = JSON.parse(value)[localKeyList[i].subKey];
        }

        localKeyList[i].value = value;
      } catch (e) {}
    }
    return localKeyList.map(({ alias, value, type }) => ({
      alias,
      value,
      type,
    }));
  }

  async function getCookie(cookieKeyList, url) {
    const cookies = await chrome.cookies.getAll({ url });
    const keyListKeys = cookieKeyList.map(({ key }) => key);

    const matchCookies = cookies
      .filter(({ name }) => keyListKeys.includes(name))
      .map(({ name, value }) => ({ name, value, type: TYPES.COOKIE }));

    return cookieKeyList.map(({ alias, key, type }) => {
      value = matchCookies.find(({ name }) => name === key)?.value || undefined;
      return { alias, type, value };
    });
  }

  function tabToStringUrl(tab) {
    const url = new URL(tab.url);
    return url.protocol + "//" + url.hostname;
  }

  function keyListToPresentationList(originalKeyList) {
    return originalKeyList.map(({ alias, type }) => ({
      alias,
      type,
    }));
  }

  return {
    getLocalKeys,
    getSessionKeys,
    getCookieKeys,
  };
};
