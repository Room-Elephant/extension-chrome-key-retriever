import { remoteExecution, remoteGetLocalStorageItems, remoteSetLocalStorageValue } from "./client/remote.js";
import { getActiveTab } from "./tab.js";

const tab = getActiveTab();

async function getLocalStorage(filters) {
  const { keys } = filters;
  
  try {
    return await remoteExecution(tab, [keys], remoteGetLocalStorageItems);
  } catch (e) {
    console.log("🐶 ~ could not read local storage values:", e);
    return [];
  }
}

async function SetLocalStorageValue(key, value) {
  try {
    return remoteExecution(tab, [key, value], remoteSetLocalStorageValue);
  } catch (e) {
    console.log("🐶 ~ could not set local storage value for key " + key + " :", e);
    return false;
  }
}

export { getLocalStorage, SetLocalStorageValue };
