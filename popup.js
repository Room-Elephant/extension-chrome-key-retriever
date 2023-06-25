const manager = appManager();
const creator = appCreator();
let presentationList;
const keyList = document.getElementById("keyList");

document.addEventListener("DOMContentLoaded", async function () {
  /* DEBUG */
  cleanup();
  /* DEBUG */
  presentationList = await manager.getKeyValues();

  if (presentationList === null || presentationList?.length === 0) {
    await loadDefaultKeys();
    presentationList = await manager.getKeyValues();
  }

  renderPresentationList();
});

function renderPresentationList() {
  presentationList.forEach((key) => {
    let item;
    if (key.type === "local")
      item = creator.localStorageItem(key.alias, key.value);
    else item = creator.cookieItem(key.alias, key.value);

    keyList.appendChild(item);
  });
}

async function loadDefaultKeys() {
  const defaultKeyList = [
    {
      alias: "auth token",
      key: "X-Auth-Token",
      type: "cookie",
    },
    {
      alias: "geo token",
      key: "location token",
      subKey: "jwt",
      type: "local",
    },
  ];
  await manager.persistNewKey(defaultKeyList);
}

async function cleanup() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ keyList: undefined }, function () {
      resolve();
    });
  });
}
