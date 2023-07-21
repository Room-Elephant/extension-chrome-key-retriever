import { executeRequest, getSessionValue, getLocalValue } from "./operation/remote.js";
import { getCookie } from "./operation/cookie.js";

async function getSessionValues(tab, sessionStoreItems) {
  try {
    return await executeRequest(tab, [sessionStoreItems], getSessionValue);
  } catch (e) {
    console.log("🐶 ~ could not read session values:", e);
  }
  return [];
}

async function getLocalValues(tab, localStoreItems) {
  try {
    return await executeRequest(tab, [localStoreItems], getLocalValue);
  } catch (e) {
    console.log("🐶 ~ could not read local values:", e);
  }
  return [];
}

async function getCookieValues(tab, cookieStoreItems) {
  try {
    return await getCookie(tab, cookieStoreItems);
  } catch (e) {
    console.log("🐶 ~ could not read cookie values:", e);
  }

  return [];
}

export { getSessionValues, getLocalValues, getCookieValues };
