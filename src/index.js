import appPage from "./page.js";
import appStore from "./model/store.js";
import appManager from "./manager.js";

const store = appStore(onStoreChange);
const manager = appManager();

const page = appPage({
  storeSaveItem: onSaveItem,
  storeDeleteItem: onDeleteItem,
  storeSetItemValue: onSetItemValue,
  storeRefreshItems: onRefreshItems,
});

document.addEventListener("DOMContentLoaded", async function () {
  onStoreChange(await store.getItems());
});

async function onStoreChange(items) {
  if (!items?.length) {
    page.show(page.PAGES.EMPTY);
    return;
  }
  page.renderPresentationList(items);
  page.renderValueElements({ itemValues: await manager.getItemsValue(items) });
  page.show(page.PAGES.LIST);
}

function onSaveItem(item) {
  store.addItem(item);
}

function onDeleteItem(itemId) {
  store.removeItem(itemId);
}

async function onSetItemValue(item, value) {
  await manager.setItemValue(item, value);
  page.renderValueElements({ newValue: { id: item.id, value } });
}

async function onRefreshItems(items) {
  page.renderValueElements({ itemValues: await manager.getItemsValue(items) });
}
