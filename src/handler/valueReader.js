function valueReader(remote, cookie) {
  async function getSessionValues(sessionStoreItems) {
    try {
      return await remote.executeRequest(
        [sessionStoreItems],
        remote.getSessionValue
      );
    } catch (e) {
      console.log("🐶 ~ could not read session values:", e);
    }
    return [];
  }

  async function getLocalValues(localStoreItems) {
    try {
      return await remote.executeRequest(
        [localStoreItems],
        remote.getLocalValue
      );
    } catch (e) {
      console.log("🐶 ~ could not read local values:", e);
    }
    return [];
  }

  async function getCookieValues(cookieStoreItems) {
    try {
      return await cookie.getCookie(cookieStoreItems);
    } catch (e) {
      console.log("🐶 ~ could not read cookie values:", e);
    }

    return [];
  }

  return {
    getSessionValues,
    getLocalValues,
    getCookieValues,
  };
}
