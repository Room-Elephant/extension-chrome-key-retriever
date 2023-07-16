const components = appComponents();
const creator = appCreator(components);
const page = appPage(creator, onSaveItem, onDeleteKeys, onSetItemValue);
const store = appStore(onStoreUpdate);
const manager = appManager();

versionController(page);

document.addEventListener("DOMContentLoaded", async function () {
  onStoreUpdate(await store.getItems());
});

async function onStoreUpdate(items) {
  if (!items.length) {
    page.show(page.PAGES.EMPTY);
    return;
  }
  page.renderPresentationList(items);
  page.renderValueElements(await manager.getItemsValue(items));
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
}
