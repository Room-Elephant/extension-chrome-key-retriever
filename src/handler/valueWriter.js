function valueWriter(remote, cookie) {
  async function saveSessionValue(key, subKey = "", value) {
    try {
      return remote.executeRequest([key, subKey, value], remote.saveSessionValue);
    } catch (e) {
      console.log("🐶 ~ could not set session value for key " + key + " :", e);
    }
    return false;
  }

  async function saveLocalValue(key, subKey = "", value) {
    try {
      return remote.executeRequest([key, subKey, value], remote.saveLocalValue);
    } catch (e) {
      console.log("🐶 ~ could not set local value for key " + key + " :", e);
    }
    return false;
  }

  async function saveCookieValue(key, subKey = "", value) {
    try {
      return await cookie.saveCookieValue(key, subKey, value);
    } catch (e) {
      console.log("🐶 ~ could not set cookie value for key " + key + " :", e);
    }
    return false;
  }

  return {
    saveSessionValue,
    saveLocalValue,
    saveCookieValue,
  };
}
