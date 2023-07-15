const appCreator = () => {
  const components = appComponents();

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
    return components.newListItem({
      item: {
        ...item,
        text: item.alias,
        icon: iconByStorageType(storageType),
      },
      actions: itemActions(),
      footer: itemFooter(),
    });

    function itemActions() {
      const copyButton = components.newButton({
        icon: {
          classNames: "fa-solid fa-copy fa-lg",
          style: "color: var(--dark-gray);",
        },
        onClick: (element) => actions.copyFnc(element, item.id),
      });

      const moreActionsButton = moreActions({
        id: item.id,
        value: item.value,
        actions,
      });

      return [
        { action: copyButton, visible: Boolean(item.value) },
        { action: moreActionsButton },
      ];
    }

    function itemFooter() {
      const tokenArea = components.newTextArea({
        id: `token-${item.id}`,
        classNames: "tokenTextArea w-100 display-none",
        style: "overflowX: hidden; overflowY: scroll",
        text: item.value,
        disabled: true,
      });

      const applyButton = components.newButton({
        classNames: "btn btn-outline-success",
        onClick: () => applyValue(item.id),
        label: "Apply",
        icon: {
          classNames: "fa-solid fa-floppy-disk fa-lg me-1",
        },
      });
      return {
        body: tokenArea,
        actions: [applyButton],
      };
    }
  }

  function moreActions({ id, value, actions }) {
    const options = [
      {
        id: `viewBtn-${id}`,
        itemId: id,
        icon: {
          classNames: "fa-solid fa-eye fa-lg me-2",
          style: "color: var(--dark-gray);",
        },
        label: "View value",
        disabled: !value,
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
        onClick: () => showApplyFooter(id),
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
    return components.newDropdown({ options });
  }

  function showApplyFooter(id) {
    const textArea = document.getElementById(`token-${id}`);
    textArea.classList.remove("display-none");
    textArea.disabled = false;
    const textAreaFooter = document.getElementById(`textAreaFooter-${id}`);
    textAreaFooter.classList.remove("display-none");
  }

  function applyValue(id) {
    const textAreaFooter = document.getElementById(`textAreaFooter-${id}`);
    textAreaFooter.classList.add("display-none");

    const textArea = document.getElementById(`token-${id}`);
    textArea.disabled = true;

    const value = textArea.value;
    actions.setFnc(id, value);
  }

  function iconByStorageType(storageType) {
    switch (storageType) {
      case TYPES.SESSION:
        return {
          classNames: "fa-sharp fa-regular fa-folder-open me-1",
          style: "color: var(--yellow)",
        };
      case TYPES.LOCAL:
        return {
          classNames: "fa-solid fa-box-archive fa-lg me-1",
          style: "color: var(--brown)",
        };
      case TYPES.COOKIE:
        return {
          classNames: "fa-solid fa-cookie fa-lg me-1",
          style: "color: var(--yellow);",
        };
    }
  }

  return {
    newCookieItem,
    newLocalItem,
    newSessionItem,
  };
};
