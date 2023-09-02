import { executeRequest, getSessionValue, getLocalValue } from "./operation/remote.js";
import { getCookie } from "./operation/cookie.js";

async function getSessionValues(tab, sessionStoreItems) {
  try {
    return await executeRequest(tab, [sessionStoreItems], getSessionValue);
  } catch (e) {
    console.log("🐶 ~ could not read session values:", e);
  }
  return sessionStoreItems;
}

async function getLocalValues(tab, localStoreItems) {
  try {
    return await executeRequest(tab, [localStoreItems], getLocalValue);
  } catch (e) {
    console.log("🐶 ~ could not read local values:", e);
  }
  return localStoreItems;
}

async function getCookieValues(tab, cookieStoreItems) {
  try {
    return await getCookie(tab, cookieStoreItems);
  } catch (e) {
    console.log("🐶 ~ could not read cookie values:", e);
  }

  return cookieStoreItems;
}

export { getSessionValues, getLocalValues, getCookieValues };
