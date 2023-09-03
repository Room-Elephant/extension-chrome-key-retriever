import { TYPES } from "./common.js";
import { fireEvent } from "./handler/analytics.js";
import { newSessionItem, newLocalItem, newCookieItem } from "./view/items.js";

function appPage({ storeSave, storeDelete, storeSet, refreshValues }) {
  const PAGES = {
    EMPTY: {
      emptyPage: true,
      addKeyForm: false,
      addKeyFooter: false,
      keyListElement: false,
      keyListFooterElement: true,
      listActions: false,
    },
    LIST: {
      emptyPage: false,
      addKeyForm: false,
      addKeyFooter: false,
      keyListElement: true,
      keyListFooterElement: true,
      listActions: true,
    },
    ADD: {
      emptyPage: false,
      addKeyForm: true,
      addKeyFooter: true,
      keyListElement: false,
      keyListFooterElement: false,
      listActions: false,
    },
  };
  let presentationItems = [];
  let valueItems = [];

  document.getElementById("addKeyBtn").addEventListener("click", () => show(PAGES.ADD));

  document.getElementById("refreshBtn").addEventListener("click", () => refreshValues(presentationItems));

  document.getElementById("saveKeyBtn").addEventListener("click", () => {
    if (formValidation()) onSaveItem();
    else {
      const invalidFields = [...document.querySelectorAll(".form-control:invalid")].map((element) => element.name);
      fireEvent("invalid_form", { invalidFields: invalidFields.toString() });
    }
  });

  document.getElementById("cancelAddKeyBtn").addEventListener("click", () => {
    removeFormValidation();
    if (!presentationItems.length) {
      show(PAGES.EMPTY);
      return;
    }
    show(PAGES.LIST);
  });

  document.querySelectorAll('input[name="storage"]').forEach((input) =>
    input.addEventListener("click", (e) => {
      if (e.target.id === "localStorage" || e.target.id === "sessionStorage") hideDomainField();
      else document.getElementById("domainField").classList.remove("display-none");
    }),
  );

  function show(page) {
    const emptyPage = document.getElementById("emptyPage");
    const addKeyForm = document.getElementById("addKeyForm");
    const addKeyFooter = document.getElementById("addKeyFooter");
    const keyListElement = document.getElementById("keyList");
    const keyListFooterElement = document.getElementById("keyListFooter");
    const listActions = document.getElementsByClassName("listActions");
    const viewButtons = document.getElementsByClassName("viewBtn");
    const viewCards = document.getElementsByClassName("tokenTextArea");

    if (page.emptyPage) emptyPage.classList.remove("display-none");
    else emptyPage.classList.add("display-none");

    if (page.addKeyForm) addKeyForm.classList.remove("display-none");
    else addKeyForm.classList.add("display-none");

    if (page.addKeyFooter) addKeyFooter.classList.remove("display-none");
    else addKeyFooter.classList.add("display-none");

    if (page.keyListElement) keyListElement.classList.remove("display-none");
    else keyListElement.classList.add("display-none");

    if (page.keyListFooterElement) keyListFooterElement.classList.remove("display-none");
    else keyListFooterElement.classList.add("display-none");

    if (page.listActions) [...listActions].forEach((action) => action.classList.remove("invisible"));
    else [...listActions].forEach((action) => action.classList.add("invisible"));

    [...viewButtons].forEach((btn) => {
      if (btn.lastChild.classList.contains("fa-eye-slash")) {
        btn.lastChild.classList.remove("fa-eye-slash");
        btn.lastChild.classList.add("fa-eye");
      }
    });

    [...viewCards].forEach((card) => card.classList.add("display-none"));
  }

  function renderPresentationList(items) {
    presentationItems = items;

    const keyListElement = document.getElementById("keyList");
    keyListElement.textContent = "";

    const actions = {
      setFnc: onSetItemValue,
      copyFnc: onCopyValue,
      viewFnc: onViewValue,
      deleteFnc: onDeleteItem,
    };

    presentationItems.forEach((presentationItem) => {
      let item;
      switch (presentationItem.type) {
        case TYPES.SESSION:
          item = newSessionItem(presentationItem, actions);
          break;
        case TYPES.LOCAL:
          item = newLocalItem(presentationItem, actions);
          break;
        case TYPES.COOKIE:
          item = newCookieItem(presentationItem, actions);
      }
      keyListElement.appendChild(item);
    });
  }

  function renderValueElements({ itemValues, newValue }) {
    valueItems = itemValues || valueItems;
    if (newValue) {
      const updatableItem = valueItems.find(({ id }) => id === newValue.id);
      updatableItem.value = newValue.value;
    }

    const itemsByValue = presentationItems.reduce((acc, curr) => {
      const valueItem = valueItems.find(({ id }) => id === curr.id);
      if (valueItem.value) (acc.withValue = acc.withValue || []).push(valueItem);
      else (acc.emptyValue = acc.emptyValue || []).push(valueItem);

      return acc;
    }, {});

    itemsByValue.withValue?.forEach(({ id, value }) => {
      const copyBtn = document.getElementById(`copyBtn-${id}`);
      const textArea = document.getElementById(`token-${id}`);
      const viewBtn = document.getElementById(`viewBtn-${id}`);

      copyBtn.classList.remove("display-none");
      textArea.innerText = value;
      viewBtn.disabled = false;
    });

    itemsByValue.emptyValue?.forEach(({ id }) => {
      const copyBtn = document.getElementById(`copyBtn-${id}`);
      const textArea = document.getElementById(`token-${id}`);
      const viewBtn = document.getElementById(`viewBtn-${id}`);

      if (copyBtn.classList.contains("display-none")) return;

      copyBtn.classList.add("display-none");
      textArea.innerText = "";
      viewBtn.disabled = true;
    });
  }

  function alertOutdatedVersion() {
    document.getElementById("outdatedVersion").classList.remove("display-none");
  }

  function onSaveItem() {
    const formData = getFormData();
    clearFormData();
    removeFormValidation();
    storeSave(formData);
  }

  function onDeleteItem(itemId) {
    fireEvent("delete_item");
    const idToRemove = presentationItems.find((element) => itemId === element.id).id;

    storeDelete(idToRemove);
  }

  async function onSetItemValue(itemId, value) {
    const item = presentationItems.find(({ id }) => id === itemId);
    await storeSet(item, value);
    fireEvent("set_value");

    const viewBtn = document.getElementById(`viewBtn-${itemId}`);
    onViewValue(itemId, viewBtn);
  }

  function onCopyValue(element, itemId) {
    const token = document.getElementById(`token-${itemId}`)?.textContent;
    fireEvent("copy_value");
    navigator.clipboard.writeText(token).then(
      function () {
        element.lastChild.classList.remove("fa-copy");
        element.lastChild.classList.add("fa-check");
        element.lastChild.style.color = "var(--green)";
        setTimeout(function () {
          element.lastChild.classList.remove("fa-check");
          element.lastChild.classList.add("fa-copy");
          element.lastChild.style.color = "var(--dark-gray)";
        }, 1000);
      },
      function (err) {
        console.log("🐶 ~ could not copy text due to:", err);
      },
    );
  }

  function onViewValue(id, element) {
    fireEvent("view_value");
    const textArea = document.getElementById(`token-${id}`);
    textArea.disabled = true;
    const keyDetails = document.getElementById(`key-${id}`);

    const icon = element.firstChild;
    const text = element.lastChild;

    if (icon.classList.contains("fa-eye")) {
      textArea.classList.remove("display-none");
      keyDetails.classList.remove("display-none");
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
      text.nodeValue = "Hide value";
    } else {
      textArea.classList.add("display-none");
      keyDetails.classList.add("display-none");
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
      text.nodeValue = "View value";
    }
  }

  function getFormData() {
    const alias = document.getElementById("alias").value;
    const key = document.getElementById("key").value;
    const subKey = document.getElementById("subKey").value || undefined;
    const domain = document.getElementById("domain").value || undefined;
    const storageType = document.querySelector('input[name="storage"]:checked').value;

    return { alias, key, subKey, domain, type: storageType };
  }

  function clearFormData() {
    document.getElementById("alias").value = "";
    document.getElementById("key").value = "";
    document.getElementById("subKey").value = "";
    document.getElementById("domain").value = "";
    document.querySelector('input[name="storage"]').checked = false;
    document.querySelector('input[id="sessionStorage"]').checked = true;
  }

  function formValidation() {
    const form = document.getElementById("add-key-form");
    const validForm = form.checkValidity();
    form.classList.add("was-validated");
    return validForm;
  }

  function removeFormValidation() {
    const form = document.getElementById("add-key-form");
    form.classList.remove("was-validated");
  }

  function hideDomainField() {
    const domainField = document.getElementById("domainField");
    if (!domainField.classList.contains("display-none")) domainField.classList.add("display-none");
  }

  return {
    show,
    renderPresentationList,
    renderValueElements,
    alertOutdatedVersion,
    PAGES,
  };
}

export default appPage;
