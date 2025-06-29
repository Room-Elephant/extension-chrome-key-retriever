import {
  executeRequest,
  saveSessionValue as remoteSaveSessionValue,
  saveLocalValue as remoteSaveLocalValue,
} from "./operation/remote.js";
import { saveCookieValue as chromeSaveCookieValue } from "./operation/cookie.js";

async function saveSessionValue(tab, key, subKey = "", value) {
  try {
    return executeRequest(tab, [key, subKey, value], remoteSaveSessionValue);
  } catch (e) {
    console.log("🐶 ~ could not set session value for key " + key + " :", e);
  }
  return false;
}

async function saveLocalValue(tab, key, subKey = "", value) {
  try {
    return executeRequest(tab, [key, subKey, value], remoteSaveLocalValue);
  } catch (e) {
    console.log("🐶 ~ could not set local value for key " + key + " :", e);
  }
  return false;
}

async function saveCookieValue(tab, key, subKey = "", domain, value) {
  try {
    return await chromeSaveCookieValue(tab, key, subKey, domain, value);
  } catch (e) {
    console.log("🐶 ~ could not set cookie value for key " + key + " :", e);
  }
  return false;
}

export { saveSessionValue, saveLocalValue, saveCookieValue };
