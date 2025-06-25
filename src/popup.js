import versionController from "./handler/versionController.js";
import appPage from "./page.js";
import appStore from "./handler/store.js";
import appManager from "./manager.js";

const store = appStore(onStoreUpdate);
const manager = appManager();
const page = appPage({
  storeSave: onSaveItem,
  storeDelete: onDeleteKeys,
  storeSet: onSetItemValue,
  refreshValues: onRefreshValues,
});
versionController(page);

document.addEventListener("DOMContentLoaded", async function () {
  onStoreUpdate(await store.getItems());
});

async function onStoreUpdate(items) {
  if (!items?.length) {
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

async function onRefreshValues(items) {
  page.renderValueElements({ itemValues: await manager.getItemsValue(items) });
}
