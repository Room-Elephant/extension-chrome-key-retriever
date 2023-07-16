function appPage(creator, storeSave, storeDelete, storeSet) {
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

  document.getElementById("addKeyBtn").addEventListener("click", () => show(PAGES.ADD));

  document.getElementById("saveKeyBtn").addEventListener("click", () => {
    if (formValidation()) onSaveItem();
  });

  document.getElementById("cancelAddKeyBtn").addEventListener("click", () => {
    removeFormValidation();
    if (!presentationItems.length) {
      show(PAGES.EMPTY);
      return;
    }
    show(PAGES.LIST);
  });

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
    keyListElement.innerHTML = "";

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
          item = creator.newSessionItem(presentationItem, actions);
          break;
        case TYPES.LOCAL:
          item = creator.newLocalItem(presentationItem, actions);
          break;
        case TYPES.COOKIE:
          item = creator.newCookieItem(presentationItem, actions);
      }
      keyListElement.appendChild(item);
    });
  }

  function renderValueElements(itemValues) {
    const itemsByValue = presentationItems.reduce((acc, curr) => {
      if (itemValues.includes(curr.id)) (acc.withValue = acc.withValue || []).push(curr);
      else (acc.emptyValue = acc.emptyValue || []).push(curr);

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
    const idToRemove = presentationItems.find((element) => itemId === element.id).id;

    storeDelete(idToRemove);
  }

  async function onSetItemValue(itemId, value) {
    await storeSet(itemId, value);

    renderPresentationList(presentationItems);

    const viewBtn = document.getElementById(`viewBtn-${itemId}`);
    viewBtn.disabled = false;
    onViewValue(itemId, viewBtn);
  }

  function onCopyValue(element, itemId) {
    const token = document.getElementById(`token-${itemId}`)?.innerHTML;
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

  function onViewValue(itemId, element) {
    const textArea = document.getElementById(`token-${itemId}`);
    textArea.disabled = true;

    const icon = element.firstChild;
    const text = element.lastChild;

    if (icon.classList.contains("fa-eye")) {
      textArea.classList.remove("display-none");
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
      text.nodeValue = "Hide value";
    } else {
      textArea.classList.add("display-none");
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
      text.nodeValue = "View value";
    }
  }

  function getFormData() {
    const alias = document.getElementById("alias").value;
    const key = document.getElementById("key").value;
    const subKey = document.getElementById("subKey").value || undefined;
    const storageType = document.querySelector('input[name="storage"]:checked').value;

    return { alias, key, subKey, type: storageType };
  }

  function clearFormData() {
    document.getElementById("alias").value = "";
    document.getElementById("key").value = "";
    document.getElementById("subKey").value = "";
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

  return {
    show,
    renderPresentationList,
    renderValueElements,
    alertOutdatedVersion,
    PAGES,
  };
}
