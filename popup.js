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

  const confirmDeleteKeysBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteKeysBtn.addEventListener("click", async function () {
    const checkedDeleteCheckboxList = document.querySelectorAll(
      "input[name=delete]:checked"
    );
    const deleteIds = [...checkedDeleteCheckboxList].map(
      (checkbox) => checkbox.id
    );

    const deleteAliasList = presentationList
      .filter((element) => deleteIds.includes(element.alias.trim()))
      .map((element) => element.alias);

    const deleteKeysFooter = document.getElementById("deleteKeysFooter");
    deleteKeysFooter.classList.add("display-none");

    const deleteCheckboxList =
      document.getElementsByClassName("delete-checkbox");

    [...deleteCheckboxList].forEach((checkbox) =>
      checkbox.classList.add("display-none")
    );

    await manager.removePersistKey(deleteAliasList);

    presentationList = await manager.getKeyValues();
    keyListElement.innerHTML = "";
    creator.showKeyList();
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
      alias: "Auth token",
      key: "X-Auth-Token",
      type: "cookie",
    },
    {
      alias: "Geo token",
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
