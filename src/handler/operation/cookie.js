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

async function saveCookieValue(tab, key, subKey, userDomain, value) {
  const url = tabToStringUrl(tab);
  const domain = getCookieDomain(userDomain, url);

  const cookies = await chrome.cookies.getAll({ url, domain });
  const cookie = cookieFinder(cookies, key, userDomain);

  const cookieValue = getCookieValue(subKey, value, cookie.value);

  cookie.value = cookieValue;
  cookie.domain = domain;
  cookie.name = key;

  delete cookie.hostOnly;
  delete cookie.session;

  return new Promise((resolve, reject) => {
    chrome.cookies.set({ ...cookie, url, domain: cookie.domain }, function (cookie) {
      if (cookie) resolve();
      else reject();
    });
  });
}

function tabToStringUrl(tab) {
  const url = new URL(tab.url);
  return `${url.protocol}//${url.hostname}`;
}

function getCookieDomain(userDomain, tabUrl) {
  let sUrl = tabUrl;
  if (userDomain) sUrl = `http://${userDomain}`;

  const url = new URL(sUrl);
  return url.hostname;
}

function cookieFinder(cookies, key, domain) {
  return (
    cookies.find((cookie) => {
      if (key !== cookie.name) return false;
      if (domain && !isDomainMatch(domain, cookie.domain)) return false;
      return true;
    }) || {}
  );
}

function isDomainMatch(itemDomain, cookieDomain) {
  return itemDomain === cookieDomain || itemDomain === cookieDomain.substring(1);
}

function getCookieValue(subKey, newValue, originalValue) {
  let value;

  if (subKey) {
    if (originalValue !== undefined) {
      try {
        value = JSON.parse(originalValue);
      } catch (e) {
        value = {};
      }
    } else value = {};

    value[subKey] = newValue;
  } else {
    value = newValue;
  }

  return value instanceof Object ? JSON.stringify(value) : value;
}

export { getCookie, saveCookieValue };
