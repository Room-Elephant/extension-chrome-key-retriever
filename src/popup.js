const store = appStore(onStoreUpdate);
const manager = appManager();
const page = appPage(onSaveItem, onDeleteKeys, onSetItemValue);

document.addEventListener("DOMContentLoaded", async function () {
  let storeItem = await store.getItems();
  if (!storeItem?.length) {
    await loadDefaultKeys();
    storeItem = await store.getItems();
  }

  page.renderPresentationList(await manager.getPresentationItems(storeItem));
});

async function onStoreUpdate(newItems) {
  page.renderPresentationList(await manager.getPresentationItems(newItems));
  page.show(page.PAGES.LIST);
}

function onSaveItem(formData) {
  store.addItem(formData);
}

function onDeleteKeys(itemId) {
  store.removeItems(itemId);
}

async function onSetItemValue(itemId, value) {
  await manager.setItemValue(itemId, value);
}

async function loadDefaultKeys() {
  const defaultKeyList = [
    {
      alias: "Auth token",
      key: "X-Auth-Token",
      type: TYPES.COOKIE,
    },
    {
      alias: "Geo token",
      key: "location token",
      subKey: "jwt",
      type: TYPES.LOCAL,
    },
  ];
  defaultKeyList.forEach(async (item) => store.addItem(item));
}
