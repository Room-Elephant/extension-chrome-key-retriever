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
  },
  ADD: {
    addKeyForm: true,
    addKeyFooter: true,
    keyListElement: false,
    keyListFooterElement: false,
    deleteCheckboxList: false,
    deleteKeysFooter: false,
  },
  REMOVE: {
    addKeyForm: false,
    addKeyFooter: false,
    keyListElement: true,
    keyListFooterElement: false,
    deleteCheckboxList: true,
    deleteKeysFooter: true,
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

document
  .getElementById("saveKeyBtn")
  .addEventListener("click", async function () {
    const formData = creator.getFormData();
    await manager.persistNewKey([formData]);


    document.getElementById("keyList").innerHTML = "";
    presentationList = await manager.getKeyValues();

    renderPresentationList();
    showPage(PAGES.LIST);
  });

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", async function () {
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

    document.getElementById("keyList").innerHTML = "";
    presentationList = await manager.getKeyValues();

    renderPresentationList();
    showPage(PAGES.LIST);
  });

document
  .getElementById("deleteKeysBtn")
  .addEventListener("click", () => showPage(PAGES.REMOVE));

document
  .getElementById("addKeyBtn")
  .addEventListener("click", () => showPage(PAGES.ADD));

  document
  .getElementById("cancelDeleteBtn")
  .addEventListener("click", () => showPage(PAGES.LIST));

  document
  .getElementById("cancelKeyBtn")
  .addEventListener("click", () => showPage(PAGES.LIST));
  

function showPage(page) {
  const addKeyForm = document.getElementById("addKeyForm");
  const addKeyFooter = document.getElementById("addKeyFooter");
  const keyListElement = document.getElementById("keyList");
  const keyListFooterElement = document.getElementById("keyListFooter");
  const deleteKeysFooter = document.getElementById("deleteKeysFooter");
  const deleteCheckboxList = document.getElementsByClassName("delete-checkbox");

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
}

function renderPresentationList() {
  keyListElement = document.getElementById("keyList");

  presentationList.forEach((key) => {
    let item;
    if (key.type === "local")
      item = creator.newLocalItem(key.alias, key.value, copyValue, viewKey);
    else item = creator.newCookieItem(key.alias, key.value, copyValue, viewKey);

    keyListElement.appendChild(item);
  });
}

function copyValue(element, itemId) {
  const token = document.getElementById(`token-${itemId}`)?.innerHTML;
  navigator.clipboard.writeText(token).then(
    function () {
      element.lastChild.classList.remove("bi-clipboard");
      element.lastChild.classList.add("bi-check");
      setTimeout(function () {
        element.lastChild.classList.remove("bi-check");
        element.lastChild.classList.add("bi-clipboard");
      }, 1000);
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

function viewKey(element, itemId) {
  const card = document.getElementById(`card-${itemId}`);

  if (element.lastChild.classList.contains("bi-eye")) {
    card.classList.remove("display-none");
    element.lastChild.classList.remove("bi-eye");
    element.lastChild.classList.add("bi-eye-slash");
  } else {
    card.classList.add("display-none");
    element.lastChild.classList.remove("bi-eye-slash");
    element.lastChild.classList.add("bi-eye");
  }
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
