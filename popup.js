const manager = appManager();
const creator = appCreator();
let presentationList;
const keyListElement = document.getElementById("keyList");

document.addEventListener("DOMContentLoaded", async function () {
  presentationList = await manager.getKeyValues();

  if (presentationList === null || presentationList?.length === 0) {
    await loadDefaultKeys();
    presentationList = await manager.getKeyValues();
  }

  renderPresentationList();

  const saveButton = document.getElementById("saveKeyBtn");
  saveButton.addEventListener("click", async function () {
    creator.showKeyList();
    const formData = creator.getFormData();
    await manager.persistNewKey([formData]);
    presentationList = await manager.getKeyValues();
    keyListElement.innerHTML = "";
    renderPresentationList();
  });
});

function renderPresentationList() {
  presentationList.forEach((key) => {
    let item;
    if (key.type === "local")
      item = creator.localStorageItem(key.alias, key.value);
    else item = creator.cookieItem(key.alias, key.value);

    keyListElement.appendChild(item);
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
    chrome.storage.local.clear(function () {
      resolve();
    });
  });
}
