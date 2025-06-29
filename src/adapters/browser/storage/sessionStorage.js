import { remoteExecution, remoteGetLocalStorageItems, remoteSetLocalStorageValue } from "./client/remote.js";

async function getSessionStorage(tab, {keys}) {
  try {
    return await remoteExecution(tab, [keys], remoteGetLocalStorageItems);
  } catch (e) {
    console.log("🐶 ~ could not read session storage values:", e);
    return [];
  }
}

async function SetSessionStorageValue(tab, key, value) {
  try {
    return remoteExecution(tab, [key, value], remoteSetLocalStorageValue);
  } catch (e) {
    console.log("🐶 ~ could not set session storage value for key " + key + " :", e);
    return false;
  }
}

export { getSessionStorage, SetSessionStorageValue };
