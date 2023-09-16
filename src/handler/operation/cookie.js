async function getCookie(tab, cookieStoreItems) {
  const cookies = await chrome.cookies.getAll({ url: tabToStringUrl(tab), domain: cookieStoreItems.domain });

  return cookieStoreItems.map((item) => {
    const cookie = cookieFinder(cookies, item.key, item.domain);

    let value = cookie?.value;
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

async function saveCookieValue(tab, key, subKey, domain, value) {
  const cookies = await chrome.cookies.getAll({ url: tabToStringUrl(tab), domain });
  const cookie = cookieFinder(cookies, key, domain);

  let newValue = value;

  if (subKey) {
    const originalValue = cookie.value;
    if (cookie.value !== undefined)
      try {
        newValue = JSON.parse(originalValue);
      } catch (e) {
        newValue = {};
      }
    else newValue = {};

    newValue[subKey] = value;
  }

  const stringifiedValue = newValue instanceof Object ? JSON.stringify(newValue) : newValue;

  cookie.value = stringifiedValue;

  delete cookie.hostOnly;
  delete cookie.session;

  const url = tabToStringUrl(tab);

  return new Promise((resolve, reject) => {
    chrome.cookies.set({ ...cookie, url, domain: cookie.domain }, function (cookie) {
      if (cookie) resolve();
      else reject();
    });
  });
}

function cookieFinder(cookies, key, domain) {
  return cookies.find((cookie) => {
    if (key !== cookie.name) return false;

    if (domain && !isDomainMatch(domain, cookie.domain)) return false;
    return true;
  });
}

function isDomainMatch(itemDomain, cookieDomain) {
  return itemDomain === cookieDomain || itemDomain === cookieDomain.substring(1);
}

function tabToStringUrl(tab) {
  const url = new URL(tab.url);
  return `${url.protocol}//${url.hostname}`;
}

export { getCookie, saveCookieValue };
