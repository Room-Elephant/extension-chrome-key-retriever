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
  page.renderValueElements({ itemValues: await manager.getItemsValue(items) });
  page.show(page.PAGES.LIST);
}

function onSaveItem(formData) {
  store.addItem(formData);
}

function onDeleteKeys(itemId) {
  store.removeItem(itemId);
}

async function onSetItemValue(item, value) {
  await manager.setItemValue(item, value);
  page.renderValueElements({ newValue: { id: item.id, value } });
}
