const appCreator = (components) => {
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
      actions: itemActions({ id: item.id }),
      footer: itemFooter(item.key, item.subKey),
    });

    function itemActions({ id }) {
      const copyButton = components.newButton({
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

    function addClassesToElement(element, classNames) {
      const classes = classNames.split(" ");
      classes.forEach((elementClass) => element.classList.add(elementClass));
    }

    function itemFooter(key, subKey) {
      const superDiv = document.createElement("div");
      const div = document.createElement("div");
      addClassesToElement(div, "mb-2");

      const span0 = document.createElement("span");
      //addClassesToElement(span0, "fw-lighter");
      span0.style = "color: var(--dark-gray)";
      span0.innerHTML = "key ";

      const span1 = document.createElement("span");
      addClassesToElement(span1, "badge text-bg-secondary me-3");
      span1.innerHTML = key;

      div.appendChild(span0);
      div.appendChild(span1);

      if (subKey) {
        //const span2 = document.createElement("span");
        //addClassesToElement(span2, "fw-lighter ms-3 me-3");
        //span2.innerHTML = "|";

        const span3 = document.createElement("span");
        //addClassesToElement(span3, "fw-lighter");
        span3.style = "color: var(--dark-gray)";
        span3.innerHTML = "subkey ";

        const span4 = document.createElement("span");
        addClassesToElement(span4, "badge text-bg-secondary");
        span4.innerHTML = subKey;

        //div.appendChild(span2);

        div.appendChild(span3);
        div.appendChild(span4);
      }

      const tokenArea = components.newTextArea({
        id: `token-${item.id}`,
        classNames: "tokenTextArea w-100 display-none",
        style: "overflowX: hidden; overflowY: scroll",
        text: "",
        disabled: true,
      });

      superDiv.appendChild(div);
      superDiv.appendChild(tokenArea);

      const applyButton = components.newButton({
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

      const cancelButton = components.newButton({
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
        body: superDiv,
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
    return components.newDropdown({ options });
  }

  function showFooter(id) {
    const textArea = document.getElementById(`token-${id}`);
    textArea.classList.remove("display-none");
    textArea.disabled = false;
    const textAreaFooter = document.getElementById(`textAreaFooter-${id}`);
    textAreaFooter.classList.remove("display-none");
  }

  function hideTokenArea(id) {
    const textArea = document.getElementById(`token-${id}`);
    textArea.classList.add("display-none");
    textArea.disabled = true;
  }

  function hideApplyFooter(id) {
    const textAreaFooter = document.getElementById(`textAreaFooter-${id}`);
    textAreaFooter.classList.add("display-none");
  }

  function iconByStorageType(storageType) {
    switch (storageType) {
      case TYPES.SESSION:
        return {
          classNames: "fa-sharp fa-regular fa-folder-open me-2",
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

  return {
    newCookieItem,
    newLocalItem,
    newSessionItem,
  };
};
