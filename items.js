const appCreator = () => {
  document.addEventListener("DOMContentLoaded", function () {
    let btn = document.getElementById("addKeyBtn");
    btn.addEventListener("click", () => showAddKeyForm());
  });

  document.addEventListener("DOMContentLoaded", function () {
    let btn = document.getElementById("deleteKeysBtn");
    btn.addEventListener("click", () => showDeleteCheckbox());
  });

  function showKeyList() {
    const addKeyForm = document.getElementById("addKeyForm");
    addKeyForm.classList.add("display-none");

    const addKeyFooter = document.getElementById("addKeyFooter");
    addKeyFooter.classList.add("display-none");

    const keyListElement = document.getElementById("keyList");
    keyListElement.classList.remove("display-none");

    const keyListFooterElement = document.getElementById("keyListFooter");
    keyListFooterElement.classList.remove("display-none");
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

  function showAddKeyForm() {
    const keyListElement = document.getElementById("keyList");
    keyListElement.classList.add("display-none");

    const keyListFooterElement = document.getElementById("keyListFooter");
    keyListFooterElement.classList.add("display-none");

    const addKeyForm = document.getElementById("addKeyForm");
    addKeyForm.classList.remove("display-none");

    const addKeyFooter = document.getElementById("addKeyFooter");
    addKeyFooter.classList.remove("display-none");
  }

  function showDeleteCheckbox() {
    const deleteCheckboxList =
      document.getElementsByClassName("delete-checkbox");

    [...deleteCheckboxList].forEach((checkbox) =>
      checkbox.classList.remove("display-none")
    );

    const keyListFooterElement = document.getElementById("keyListFooter");
    keyListFooterElement.classList.add("display-none");

    const deleteKeysFooter = document.getElementById("deleteKeysFooter");
    deleteKeysFooter.classList.remove("display-none");
  }

  function copyValue(element, itemKey) {
    const token = document.getElementById(`token-${itemKey}`)?.innerHTML;
    navigator.clipboard.writeText(token).then(
      function () {
        console.log("Async: Copy value with success");
        element.src = "./images/icon-check-30.png";
        setTimeout(function () {
          element.src = "./images/icon-copy-24.png";
        }, 1000);
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  function localStorageItem(alias, value) {
    return item(alias, value, "/images/icon-package-48.png");
  }

  function cookieItem(alias, value) {
    return item(alias, value, "/images/icon-cookies-48.png");
  }

  function item(alias, value, imgTypeSrc) {
    const itemParentDiv = document.createElement("div");
    const itemKey = alias.trim();
    itemParentDiv.classList.add("flex-row");
    itemParentDiv.classList.add("justify-between");
    itemParentDiv.classList.add("align-center");
    itemParentDiv.classList.add("full-width");

    const itemDetailsElement = itemDetails(alias, value, imgTypeSrc, itemKey);

    const copyElement = document.createElement("img");

    copyElement.addEventListener("click", () =>
      copyValue(copyElement, itemKey)
    );
    copyElement.classList.add("cursor-pointer");
    copyElement.classList.add("copy-btn");
    copyElement.src = "./images/icon-copy-24.png";
    copyElement.width = "15";
    copyElement.height = "15";

    if (value === undefined) copyElement.hidden = true;

    itemParentDiv.appendChild(itemDetailsElement);
    itemParentDiv.appendChild(copyElement);

    return itemParentDiv;
  }

  function itemDetails(alias, value, imgTypeSrc, itemKey) {
    const itemTextDiv = document.createElement("div");
    itemTextDiv.classList.add("flex-row");
    itemTextDiv.classList.add("align-center");

    const deleteCheckbox = document.createElement("input");
    deleteCheckbox.setAttribute("type", "checkbox");
    deleteCheckbox.setAttribute("name", "delete");
    deleteCheckbox.setAttribute("id", alias.trim());
    deleteCheckbox.classList.add("display-none");
    deleteCheckbox.classList.add("delete-checkbox");

    const textElement = document.createElement("p");
    textElement.innerText = alias;

    const hiddenToken = document.createElement("p");
    hiddenToken.id = `token-${itemKey}`;
    hiddenToken.classList.add("display-none");
    hiddenToken.innerText = value;

    const imgType = type(imgTypeSrc);

    itemTextDiv.appendChild(deleteCheckbox);
    itemTextDiv.appendChild(imgType);
    itemTextDiv.appendChild(hiddenToken);
    itemTextDiv.appendChild(textElement);

    return itemTextDiv;
  }

  function type(imgTypeSrc) {
    const imgType = document.createElement("img");
    imgType.width = "20";
    imgType.height = "20";
    imgType.classList.add("margin-s");
    imgType.src = imgTypeSrc;

    return imgType;
  }

  return {
    localStorageItem,
    cookieItem,
    showKeyList,
    getFormData,
  };
};
