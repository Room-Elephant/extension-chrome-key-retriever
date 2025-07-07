import { addClassesToElement } from "../common";
import { Item } from "../types/item";
import { Icon, Option } from "../types/options";
import { Action } from "../types/action";
import { NewItem } from "../types/components";
import { newListItem, newButton, newTextArea, newDropdown, newLabelWithBadge } from "./components";
import { Types } from "../types/constants";

function newSessionItem(item: Item, actions: Action) {
  return newItem({ storageType: Types.SESSION, item, actions });
}

function newLocalItem(item: Item, actions: Action) {
  return newItem({ storageType: Types.LOCAL, item, actions });
}

function newCookieItem(item: Item, actions: Action) {
  return newItem({ storageType: Types.COOKIE, item, actions });
}

function newItem({ storageType, item, actions }: NewItem) {
  return newListItem({
    item: {
      ...item,
      text: item.alias,
      icon: iconByStorageType(storageType),
    },
    actions: itemActions({ id: item.id }),
    footer: itemFooter({ ...item }),
  });

  function itemActions({ id }: { id: Item["id"] }) {
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
      actions,
    });

    return [{ action: copyButton, visible: false }, { action: moreActionsButton }];
  }

  function itemFooter({ id, key, subKey }: { id: Item["id"]; key: Item["key"]; subKey?: Item["subKey"] }) {
    const footerBody = document.createElement("div");
    addClassesToElement(footerBody, "flex flex-col mb-2");

    const keyDetailsArea = document.createElement("div");
    addClassesToElement(keyDetailsArea, "flex flex-row display-none");
    keyDetailsArea.id = `key-${id}`;

    const keyLabel = newLabelWithBadge({ label: "Key", value: key });
    keyDetailsArea.appendChild(keyLabel);

    if (subKey) {
      const subKeyLabel = newLabelWithBadge({ label: "Subkey", value: subKey });
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
        const textArea = document.getElementById(`token-${item.id}`) as HTMLTextAreaElement;
        textArea.disabled = true;

        hideApplyFooter(item.id);
        const value = textArea.value;
        actions.setFnc(item.id, value);
      },

      label: "Apply",
      icon: {
        classNames: "fa-solid fa-floppy-disk fa-lg me-1",
      } as Icon,
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
  const options: Option[] = [
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

function showFooter(id: string) {
  const textArea = document.getElementById(`token-${id}`) as HTMLTextAreaElement;
  textArea.classList.remove("display-none");
  textArea.disabled = false;
  textArea.focus();
  const keyDetails = document.getElementById(`key-${id}`);
  keyDetails.classList.remove("display-none");
  const textAreaFooter = document.getElementById(`textAreaFooter-${id}`);
  textAreaFooter.classList.remove("display-none");
}

function hideTokenArea(id: number) {
  const textArea = document.getElementById(`token-${id}`) as HTMLTextAreaElement;
  textArea.classList.add("display-none");
  textArea.disabled = true;
  const keyDetails = document.getElementById(`key-${id}`);
  keyDetails.classList.add("display-none");
}

function hideApplyFooter(id: number) {
  const textAreaFooter = document.getElementById(`textAreaFooter-${id}`);
  textAreaFooter.classList.add("display-none");
}

function iconByStorageType(storageType: Types) {
  switch (storageType) {
    case Types.SESSION:
      return {
        classNames: "fa-sharp fa-regular fa-folder-open fa-lg me-2",
        style: "color: var(--yellow)",
      };
    case Types.LOCAL:
      return {
        classNames: "fa-solid fa-box-archive fa-lg me-2",
        style: "color: var(--brown)",
      };
    case Types.COOKIE:
      return {
        classNames: "fa-solid fa-cookie-bite fa-lg me-2",
        style: "color: var(--yellow);",
      };
  }
}

export { newCookieItem, newLocalItem, newSessionItem };
