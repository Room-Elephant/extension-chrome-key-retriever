const store = appStore(onStoreUpdate);
const manager = appManager();
const page = appPage(onSaveItem, onDeleteKeys, onSetItemValue);

document.addEventListener("DOMContentLoaded", async function () {
  const storeItems = await store.getItems();
  if (!storeItems?.length) {
    page.show(page.PAGES.EMPTY);
    return;
  }

  page.renderPresentationList(await manager.getPresentationItems(storeItems));
});

async function onStoreUpdate(newItems) {
  const list = await manager.getPresentationItems(newItems);
  page.renderPresentationList(list);
  if (!list.length) {
    page.show(page.PAGES.EMPTY);
    return;
  }
  page.show(page.PAGES.LIST);
}

function onSaveItem(formData) {
  store.addItem(formData);
}

function onDeleteKeys(itemId) {
  store.removeItem(itemId);
}

async function onSetItemValue(itemId, value) {
  const storeItem = await store.getItems();
  const item = storeItem.find((item) => item.id === itemId);

  await manager.setItemValue(item, value);

  page.renderPresentationList(await manager.getPresentationItems(storeItem));
}
