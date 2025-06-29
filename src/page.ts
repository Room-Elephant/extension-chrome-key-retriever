import { Types } from "./types/constants";
import { Item } from "./types/item";
import { Action } from "./types/action";
import { Page } from "./types/page";
import { newSessionItem, newLocalItem, newCookieItem } from "./view/items";
import { ValueItem } from "./types/storedItem";

const DEFAULT_PAGE = {
  emptyPage: false,
  addKeyForm: false,
  addKeyFooter: false,
  keyListElement: false,
  keyListFooterElement: false,
  listActions: false,
};

function appPage({ storeSave, storeDelete, storeSet, refreshValues }) {
  const PAGES = {
    EMPTY: {
      ...DEFAULT_PAGE,
      emptyPage: true,
      keyListFooterElement: true,
    },
    LIST: {
      ...DEFAULT_PAGE,
      keyListElement: true,
      keyListFooterElement: true,
      listActions: true,
    },
    ADD: {
      ...DEFAULT_PAGE,
      addKeyForm: true,
      addKeyFooter: true,
    },
  };
  let presentationItems: Item[] = [];
  let valueItems: ValueItem[] = [];

  document.getElementById("addKeyBtn").addEventListener("click", () => show(PAGES.ADD));

  document.getElementById("refreshBtn").addEventListener("click", () => refreshValues(presentationItems));

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

  function show(page: Page) {
    const emptyPage = document.getElementById("emptyPage");
    const addKeyForm = document.getElementById("addKeyForm");
    const addKeyFooter = document.getElementById("addKeyFooter");
    const keyListElement = document.getElementById("keyList");
    const keyListFooterElement = document.getElementById("keyListFooter");
    const listActions = document.getElementsByClassName("listActions");
    const viewButtons = document.getElementsByClassName("viewBtn");
    const viewCards = document.getElementsByClassName("tokenTextArea");

    if (page.emptyPage) emptyPage?.classList.remove("display-none");
    else emptyPage?.classList.add("display-none");

    if (page.addKeyForm) addKeyForm?.classList.remove("display-none");
    else addKeyForm?.classList.add("display-none");

    if (page.addKeyFooter) addKeyFooter?.classList.remove("display-none");
    else addKeyFooter?.classList.add("display-none");

    if (page.keyListElement) keyListElement?.classList.remove("display-none");
    else keyListElement?.classList.add("display-none");

    if (page.keyListFooterElement) keyListFooterElement?.classList.remove("display-none");
    else keyListFooterElement?.classList.add("display-none");

    if (page.listActions) [...listActions].forEach((action) => action.classList.remove("invisible"));
    else [...listActions].forEach((action) => action.classList.add("invisible"));

    [...viewButtons].forEach((btn) => {
      const lastChild = btn.lastElementChild as HTMLElement;
      if (lastChild?.classList.contains("fa-eye-slash")) {
        lastChild.classList.remove("fa-eye-slash");
        lastChild.classList.add("fa-eye");
      }
    });

    [...viewCards].forEach((card) => card.classList.add("display-none"));
  }

  function renderPresentationList(items: Item[]) {
    presentationItems = items;

    const keyListElement = document.getElementById("keyList");
    keyListElement.textContent = "";

    const actions: Action = {
      setFnc: onSetItemValue,
      copyFnc: onCopyValue,
      viewFnc: onViewValue,
      deleteFnc: onDeleteItem,
    };

    presentationItems.forEach((presentationItem) => {
      let item: HTMLLIElement;
      switch (presentationItem.type) {
        case Types.SESSION:
          item = newSessionItem(presentationItem, actions);
          break;
        case Types.LOCAL:
          item = newLocalItem(presentationItem, actions);
          break;
        case Types.COOKIE:
          item = newCookieItem(presentationItem, actions);
      }
      keyListElement.appendChild(item);
    });
  }

  function renderValueElements({ itemValues, newValue }: { itemValues?: ValueItem[]; newValue?: ValueItem }) {
    valueItems = itemValues || valueItems;
    if (newValue) {
      const updatableItem = valueItems.find(({ id }) => id === newValue.id);
      updatableItem.value = newValue.value;
    }

    const itemsByValue = presentationItems.reduce(
      (acc, curr) => {
        const valueItem = valueItems.find(({ id }) => id === curr.id);
        if (valueItem.value) (acc.withValue = acc.withValue || []).push(valueItem);
        else (acc.emptyValue = acc.emptyValue || []).push(valueItem);

        return acc;
      },
      {} as { withValue?: ValueItem[]; emptyValue?: ValueItem[] },
    );

    itemsByValue.withValue?.forEach(({ id, value }) => {
      const copyBtn = document.getElementById(`copyBtn-${id}`);
      const textArea = document.getElementById(`token-${id}`);
      const viewBtn = document.getElementById(`viewBtn-${id}`) as HTMLButtonElement;

      copyBtn.classList.remove("display-none");
      textArea.innerText = value;
      viewBtn.disabled = false;
    });

    itemsByValue.emptyValue?.forEach(({ id }) => {
      const copyBtn = document.getElementById(`copyBtn-${id}`);
      const textArea = document.getElementById(`token-${id}`);
      const viewBtn = document.getElementById(`viewBtn-${id}`) as HTMLButtonElement;

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

  function onDeleteItem(itemId: number) {
    const idToRemove = presentationItems.find((element) => itemId === element.id).id;

    storeDelete(idToRemove);
  }

  async function onSetItemValue(itemId: number, value: string) {
    const item = presentationItems.find(({ id }) => id === itemId);
    await storeSet(item, value);

    const viewBtn = document.getElementById(`viewBtn-${itemId}`);
    onViewValue(itemId, viewBtn);
  }

  function onCopyValue(element: HTMLButtonElement, itemId: number) {
    const token = document.getElementById(`token-${itemId}`)?.textContent;
    navigator.clipboard.writeText(token).then(
      function () {
        const icon = element.lastChild as HTMLElement;
        if (icon instanceof Element) {
          icon.classList.remove("fa-copy");
          icon.classList.add("fa-check");
          icon.style.color = "var(--green)";
          setTimeout(function () {
            icon.classList.remove("fa-check");
            icon.classList.add("fa-copy");
            icon.style.color = "var(--dark-gray)";
          }, 1000);
        }
      },
      function (err) {
        console.log("🐶 ~ could not copy text due to:", err);
      },
    );
  }

  function onViewValue(id: number, element: HTMLButtonElement | HTMLElement) {
    const textArea = document.getElementById(`token-${id}`) as HTMLInputElement;
    textArea.disabled = true;
    const keyDetails = document.getElementById(`key-${id}`);

    const icon = element.firstElementChild as HTMLElement;
    const text = element.lastElementChild as HTMLElement;

    if (icon.classList.contains("fa-eye")) {
      textArea.classList.remove("display-none");
      keyDetails?.classList.remove("display-none");
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
      text.innerText = "Hide value";
    } else {
      textArea.classList.add("display-none");
      keyDetails?.classList.add("display-none");
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
      text.innerText = "View value";
    }
  }

  function getFormData() {
    const alias: string = (document.getElementById("alias") as HTMLInputElement).value;
    const key: string = (document.getElementById("key") as HTMLInputElement).value;
    const subKey: string | undefined = (document.getElementById("subKey") as HTMLInputElement).value || undefined;
    const storageType: string = (document.querySelector('input[name="storage"]:checked') as HTMLInputElement).value;

    return { alias, key, subKey, type: storageType };
  }

  function clearFormData() {
    (document.getElementById("alias") as HTMLInputElement).value = "";
    (document.getElementById("key") as HTMLInputElement).value = "";
    (document.getElementById("subKey") as HTMLInputElement).value = "";
    (document.querySelector('input[name="storage"]') as HTMLInputElement).checked = false;
    (document.querySelector('input[id="sessionStorage"]') as HTMLInputElement).checked = true;
  }

  function formValidation() {
    const form = document.getElementById("add-key-form") as HTMLFormElement;
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

export default appPage;
export type AppPage = ReturnType<typeof appPage>;
