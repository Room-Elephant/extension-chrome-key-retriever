async function getCookies(tab, { keys }) {
  let cookies = [];
  try {
    cookies = await chrome.cookies.getAll({
      url: tabToStringUrl(tab),
    });
  } catch (e) {
    console.log("🐶 ~ could not read cookie values:", e);
    return [];
  }

  cookies
    .filter((cookie) => {
      if (keys.length === 0) return false;
      return keys.find(({ key }) => cookie.name === key);
    })
    .map(({ name, value }) => {
      return { name, value };
    });
}

async function saveCookieValue(key, value) {
  try {
    return await setBrowserCookieValue(key, value);
  } catch (e) {
    console.log("🐶 ~ could not set cookie value for key " + key + " :", e);
    return false;
  }
}

async function setBrowserCookieValue(tab, key, value) {
  const url = tabToStringUrl(tab);
  const domain = tabToStringDomain(tab);

  let details = await chrome.cookies.get({
    name: key,
    url,
  });
  if (details === null) {
    details = { name: key };
  }

  details.value = value;

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

export { getCookies, saveCookieValue };
