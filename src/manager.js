function appManager() {
  let tab;
  let remoteExecutor;
  let cookieExecutor;
  let reader;
  let writer;

  getActiveTab().then((result) => {
    tab = result;

    remoteExecutor = remote(tab);
    cookieExecutor = cookie(tab);
    reader = valueReader(remoteExecutor, cookieExecutor);
    writer = valueWriter(remoteExecutor, cookieExecutor);
  });

  async function getItemsValue(storeItems) {
    const valueItems = [];

    const sessionKeyPresentation = await reader.getSessionValues(
      storeItems.filter(({ type }) => TYPES.SESSION === type),
    );
    const localKeyPresentation = await reader.getLocalValues(storeItems.filter(({ type }) => TYPES.LOCAL === type));
    const cookieKeyPresentation = await reader.getCookieValues(storeItems.filter(({ type }) => TYPES.COOKIE === type));

    valueItems.push(...sessionKeyPresentation.map(({ id, value }) => ({ id, value })));
    valueItems.push(...localKeyPresentation.map(({ id, value }) => ({ id, value })));
    valueItems.push(...cookieKeyPresentation.map(({ id, value }) => ({ id, value })));

    return valueItems;
  }

  async function setItemValue(item, value) {
    switch (item.type) {
      case TYPES.SESSION:
        return writer.saveSessionValue(item.key, item.subKey, value);
      case TYPES.LOCAL:
        return writer.saveLocalValue(item.key, item.subKey, value);
      case TYPES.COOKIE:
        return writer.saveCookieValue(item.key, item.subKey, value);
    }

    return false;
  }

  async function getActiveTab() {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tabs[0];
  }

  return {
    getItemsValue,
    setItemValue,
  };
}
