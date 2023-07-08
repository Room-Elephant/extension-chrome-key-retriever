const manager = appManager();
const creator = appCreator();
const PAGES = {
  LIST: {
    addKeyForm: false,
    addKeyFooter: false,
    keyListElement: true,
    keyListFooterElement: true,
    deleteCheckboxList: false,
    deleteKeysFooter: false,
    listActions: true,
  },
  ADD: {
    addKeyForm: true,
    addKeyFooter: true,
    keyListElement: false,
    keyListFooterElement: false,
    deleteCheckboxList: false,
    deleteKeysFooter: false,
    listActions: false,
  },
  REMOVE: {
    addKeyForm: false,
    addKeyFooter: false,
    keyListElement: true,
    keyListFooterElement: false,
    deleteCheckboxList: true,
    deleteKeysFooter: true,
    listActions: false,
  },
};
let presentationList = [];

document.addEventListener("DOMContentLoaded", async function () {
  presentationList = await manager.getKeyValues();

  if (presentationList === null || presentationList?.length === 0) {
    await loadDefaultKeys();
    presentationList = await manager.getKeyValues();
  }

  renderPresentationList();
});

document.getElementById("saveKeyBtn").addEventListener("click", onSaveKey);

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", onConfirmDeleteKeys);

document
  .getElementById("deleteKeysBtn")
  .addEventListener("click", () => showPage(PAGES.REMOVE));

document
  .getElementById("addKeyBtn")
  .addEventListener("click", () => showPage(PAGES.ADD));

document
  .getElementById("cancelDeleteKeyBtn")
  .addEventListener("click", () => showPage(PAGES.LIST));

document
  .getElementById("cancelAddKeyBtn")
  .addEventListener("click", () => showPage(PAGES.LIST));

async function onSaveKey() {
  const formData = getFormData();
  await manager.persistNewKey([formData]);

  clearFormData();
  document.getElementById("keyList").innerHTML = "";
  presentationList = await manager.getKeyValues();
  renderPresentationList();
  showPage(PAGES.LIST);
}

async function onDeleteKeys(deleteIds) {
  const deleteIdList = presentationList
    .filter((element) => deleteIds.includes(element.id))
    .map((element) => element.id);

  await manager.removePersistKey(deleteIdList);

  document.getElementById("keyList").innerHTML = "";
  presentationList = await manager.getKeyValues();

  renderPresentationList();
  showPage(PAGES.LIST);
}

async function onConfirmDeleteKeys() {
  const checkedDeleteCheckboxList = document.querySelectorAll(
    "input[name=delete]:checked"
  );
  const deleteIds = [...checkedDeleteCheckboxList].map(
    (checkbox) => checkbox.id
  );

  await onDeleteKeys(deleteIds);
}

function showPage(page) {
  const addKeyForm = document.getElementById("addKeyForm");
  const addKeyFooter = document.getElementById("addKeyFooter");
  const keyListElement = document.getElementById("keyList");
  const keyListFooterElement = document.getElementById("keyListFooter");
  const deleteKeysFooter = document.getElementById("deleteKeysFooter");
  const deleteCheckboxList = document.getElementsByClassName("delete-checkbox");
  const listActions = document.getElementsByClassName("listActions");
  const viewButtons = document.getElementsByClassName("viewBtn");
  const viewCards = document.getElementsByClassName("card");

  if (page.addKeyForm) addKeyForm.classList.remove("display-none");
  else addKeyForm.classList.add("display-none");

  if (page.addKeyFooter) addKeyFooter.classList.remove("display-none");
  else addKeyFooter.classList.add("display-none");

  if (page.keyListElement) keyListElement.classList.remove("display-none");
  else keyListElement.classList.add("display-none");

  if (page.keyListFooterElement)
    keyListFooterElement.classList.remove("display-none");
  else keyListFooterElement.classList.add("display-none");

  if (page.deleteKeysFooter) deleteKeysFooter.classList.remove("display-none");
  else deleteKeysFooter.classList.add("display-none");

  if (page.deleteCheckboxList)
    [...deleteCheckboxList].forEach((checkbox) =>
      checkbox.classList.remove("display-none")
    );
  else
    [...deleteCheckboxList].forEach((checkbox) =>
      checkbox.classList.add("display-none")
    );

  if (page.listActions)
    [...listActions].forEach((action) =>
      action.classList.remove("visibility-hidden")
    );
  else
    [...listActions].forEach((action) =>
      action.classList.add("visibility-hidden")
    );

  [...viewButtons].forEach((btn) => {
    if (btn.lastChild.classList.contains("fa-eye-slash")) {
      btn.lastChild.classList.remove("fa-eye-slash");
      btn.lastChild.classList.add("fa-eye");
    }
  });

  [...viewCards].forEach((card) => card.classList.add("display-none"));
}

function getFormData() {
  const alias = document.getElementById("alias").value;
  const key = document.getElementById("key").value;
  const subKey = document.getElementById("subKey").value || undefined;
  const storageType = document.querySelector(
    'input[name="storage"]:checked'
  ).value;

  return { alias, key, subKey, type: storageType };
}

function clearFormData() {
  document.getElementById("alias").value = "";
  document.getElementById("key").value = "";
  document.getElementById("subKey").value = "";
  document.querySelector('input[name="storage"]').checked = false;
  document.querySelector('input[id="sessionStorage"]').checked = true;
}

function renderPresentationList() {
  keyListElement = document.getElementById("keyList");

  presentationList.forEach((key) => {
    let item;
    switch (key.type) {
      case TYPES.SESSION:
        item = creator.newSessionItem(
          key.id,
          key.alias,
          key.value,
          setFnc,
          copyValue,
          viewKey,
          deleteSingleKey
        );
        break;
      case TYPES.LOCAL:
        item = creator.newLocalItem(
          key.id,
          key.alias,
          key.value,
          setFnc,
          copyValue,
          viewKey,
          deleteSingleKey
        );
        break;
      case TYPES.COOKIE:
        item = creator.newCookieItem(
          key.id,
          key.alias,
          key.value,
          setFnc,
          copyValue,
          viewKey,
          deleteSingleKey
        );
    }

    keyListElement.appendChild(item);
  });
}

function setFnc(element, itemId) {}

function copyValue(element, itemId) {
  const token = document.getElementById(`token-${itemId}`)?.innerHTML;
  navigator.clipboard.writeText(token).then(
    function () {
      element.lastChild.classList.remove("fa-copy");
      element.lastChild.classList.add("fa-check");
      element.lastChild.style.color = "#198754";
      setTimeout(function () {
        element.lastChild.classList.remove("fa-check");
        element.lastChild.classList.add("fa-copy");
        element.lastChild.style.color = "#495057";
      }, 1000);
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

function viewKey(element, itemId) {
  const card = document.getElementById(`card-${itemId}`);

  const icon = element.firstChild;
  const text = element.lastChild;

  if (icon.classList.contains("fa-eye")) {
    card.classList.remove("display-none");
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
    text.nodeValue = " hide value";
  } else {
    card.classList.add("display-none");
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
    text.nodeValue = " view value";
  }
}

async function deleteSingleKey(itemId) {
  await onDeleteKeys([itemId]);
}

async function loadDefaultKeys() {
  const defaultKeyList = [
    {
      alias: "Auth token",
      key: "X-Auth-Token",
      type: TYPES.COOKIE
    },
    {
      alias: "Geo token",
      key: "location token",
      subKey: "jwt",
      type: TYPES.LOCAL
    },
  ];
  await manager.persistNewKey(defaultKeyList);
}
