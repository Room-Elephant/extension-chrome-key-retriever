import versionController from "./handler/versionController";
import appPage from "./page";
import appStore from "./handler/store";
import appManager from "./manager";
import { Types } from "./types/constants";
import { fireEvent } from "./handler/analytics";
import { EventName } from "./types/constants";
import { Item } from "./types/item";

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

async function onStoreUpdate(items: Item[]) {
  fireEvent(EventName.NUMBER_OF_KEYS, {
    total: items?.length || 0,
    session: items?.filter(({ type }) => type === Types.SESSION).length || 0,
    local: items?.filter(({ type }) => type === Types.LOCAL).length || 0,
    cookie: items?.filter(({ type }) => type === Types.COOKIE).length || 0,
  });

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
