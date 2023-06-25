const manager = appManager();
const creator = appCreator();

let presentationList;

document.addEventListener("DOMContentLoaded", async function () {

    /* DEBUG */
    await manager.persistStorageKeyList(null);
    /* DEBUG */

  presentationList = await manager.getKeyValues();

  if (presentationList === null || presentationList?.length === 0) {
    await loadDefaults();
    presentationList = await manager.getKeyValues();
  }

  renderPresentationList(presentationList);
});

function renderPresentationList(presentationList) {
  presentationList.forEach((key) => {
    const superDiv = document.getElementById("keyList");

    let item;
    if (key.type === "local")
      item = creator.localStorageItem(key.alias, key.value);
    else item = creator.cookieItem(key.alias, key.value);

    superDiv.appendChild(item);
  });
}

async function loadDefaults() {
  let keyList = {
    cookie: [
      {
        alias: "auth token",
        key: "X-Auth-Token",
      },
    ],
    local: [
      {
        alias: "geo token",
        key: "location token",
        subKey: "jwt",
      },
    ],
  };

  await manager.persistStorageKeyList(keyList);
}
