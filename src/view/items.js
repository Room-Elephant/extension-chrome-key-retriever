import { TYPES, addClassesToElement } from "../common.js";
import { newListItem, newButton, newTextArea, newDropdown, newLabelWithBadge } from "./components.js";

function newSessionItem(item, actions) {
  return newItem({ storageType: TYPES.SESSION, item, actions });
}

function newLocalItem(item, actions) {
  return newItem({ storageType: TYPES.LOCAL, item, actions });
}

function newCookieItem(item, actions) {
  return newItem({ storageType: TYPES.COOKIE, item, actions });
}

function newItem({ storageType, item, actions }) {
  return newListItem({
    item: {
      ...item,
      text: item.alias,
      icon: iconByStorageType(storageType),
    },
    actions: itemActions({ id: item.id }),
    footer: itemFooter({ ...item }),
  });

  function itemActions({ id }) {
    const copyButton = newButton({
      icon: {
        classNames: "fa-solid fa-copy fa-lg",
        style: "color: var(--dark-gray);",
      },
      id: `copyBtn-${id}`,
      onClick: (element) => actions.copyFnc(element, item.id),
    });

    const moreActionsButton = moreActions({
      id: item.id,
      value: item.value,
      actions,
    });

    return [{ action: copyButton, visible: false }, { action: moreActionsButton }];
  }

  function itemFooter({ id, key, subKey }) {
    const footerBody = document.createElement("div");
    addClassesToElement(footerBody, "flex flex-col mb-2");

    const keyDetailsArea = document.createElement("div");
    addClassesToElement(keyDetailsArea, "flex flex-row display-none");
    keyDetailsArea.id = `key-${id}`;

    const keyLabel = newLabelWithBadge({ label: "Key", value: key });
    keyDetailsArea.appendChild(keyLabel);

    if (subKey) {
      const subKeyLabel = newLabelWithBadge({ label: "Subkey", value: subKey || "" });
      keyDetailsArea.appendChild(subKeyLabel);
    }

    footerBody.appendChild(keyDetailsArea);

    const tokenArea = newTextArea({
      id: `token-${item.id}`,
      classNames: "tokenTextArea w-100 display-none",
      style: "overflowX: hidden; overflowY: scroll",
      text: "",
      disabled: true,
    });

    footerBody.appendChild(tokenArea);

    const applyButton = newButton({
      classNames: "btn btn-outline-success",
      onClick: () => {
        const textArea = document.getElementById(`token-${item.id}`);
        textArea.disabled = true;

        hideApplyFooter(item.id);
        const value = textArea.value;
        actions.setFnc(item.id, value);
      },
      label: "Apply",
      icon: {
        classNames: "fa-solid fa-floppy-disk fa-lg me-1",
      },
    });

    const cancelButton = newButton({
      onClick: () => {
        hideTokenArea(item.id);
        hideApplyFooter(item.id);
      },
      classNames: "me-2",
      icon: {
        classNames: "fa-solid fa-circle-xmark fa-lg",
        style: "color: var(--dark-gray)",
      },
    });
    return {
      body: footerBody,
      actions: [cancelButton, applyButton],
    };
  }
}

function moreActions({ id, actions }) {
  const options = [
    {
      id: `viewBtn-${id}`,
      itemId: id,
      icon: {
        classNames: "fa-solid fa-eye fa-lg me-2",
        style: "color: var(--dark-gray);",
      },
      label: "View value",
      disabled: true,
      onClick: actions.viewFnc,
    },
    {
      id: `setBtn-${id}`,
      itemId: id,
      icon: {
        classNames: "fa-solid fa-wand-magic-sparkles fa-lg me-2",
        style: "color: var(--dark-gray);",
      },
      label: "Set value",
      disabled: false,
      onClick: () => showFooter(id),
    },
    {
      id: `deleteBtn-${id}`,
      itemId: id,
      icon: {
        classNames: "fa-solid fa-trash-can fa-lg me-2",
        style: "color: var(--dark-gray);",
      },
      label: "Delete key",
      disabled: false,
      onClick: actions.deleteFnc,
      separator: true,
    },
  ];
  return newDropdown({ options });
}

function showFooter(id) {
  const textArea = document.getElementById(`token-${id}`);
  textArea.classList.remove("display-none");
  textArea.disabled = false;
  const keyDetails = document.getElementById(`key-${id}`);
  keyDetails.classList.remove("display-none");
  const textAreaFooter = document.getElementById(`textAreaFooter-${id}`);
  textAreaFooter.classList.remove("display-none");
}

function hideTokenArea(id) {
  const textArea = document.getElementById(`token-${id}`);
  textArea.classList.add("display-none");
  textArea.disabled = true;
  const keyDetails = document.getElementById(`key-${id}`);
  keyDetails.classList.add("display-none");
}

function hideApplyFooter(id) {
  const textAreaFooter = document.getElementById(`textAreaFooter-${id}`);
  textAreaFooter.classList.add("display-none");
}

function iconByStorageType(storageType) {
  switch (storageType) {
    case TYPES.SESSION:
      return {
        classNames: "fa-sharp fa-regular fa-folder-open fa-lg me-2",
        style: "color: var(--yellow)",
      };
    case TYPES.LOCAL:
      return {
        classNames: "fa-solid fa-box-archive fa-lg me-2",
        style: "color: var(--brown)",
      };
    case TYPES.COOKIE:
      return {
        classNames: "fa-solid fa-cookie-bite fa-lg me-2",
        style: "color: var(--yellow);",
      };
  }
}

export { newCookieItem, newLocalItem, newSessionItem };
