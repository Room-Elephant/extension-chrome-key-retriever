async function getCookie(tab, cookieStoreItems) {
  const cookies = await chrome.cookies.getAll({ url: tabToStringUrl(tab), domain: cookieStoreItems.domain });

  return cookieStoreItems.map((item) => {
    const cookie = cookies.find((cookie) => {
      if(item.key !== cookie.name) return false;
      
      if(item.domain && !isDomainMatch(item.domain, cookie.domain)) return false;
      return true
    });

    const value = cookie?.value;
    if (item.subKey) {
      try {
        value = JSON.parse(value)[item.subKey];
      } catch {
        value = undefined;
      }
    }

    return { ...item, value };
  });
}

async function saveCookieValue(tab, key, subKey, value) {
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

function tabToStringUrl(tab) {
  const url = new URL(tab.url);
  return `${url.protocol}//${url.hostname}`;
}

function tabToStringDomain(tab) {
  const url = new URL(tab.url);
  return `.${url.hostname}`;
}

function isDomainMatch(itemDomain, cookieDomain) {
  return itemDomain === cookieDomain || "." + itemDomain === cookieDomain;
}

export { getCookie, saveCookieValue };
