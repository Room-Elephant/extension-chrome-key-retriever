const appCreator = () => {
  function newSessionItem(item, actions) {
    const iconElement = {
      class: "fa-sharp fa-regular fa-folder-open",
      style: "color: #ffaa3b",
    };
    return newItem(iconElement, item, actions);
  }

  function newLocalItem(item, actions) {
    const iconElement = {
      class: "fa-solid fa-box-archive fa-lg",
      style: "color: #865318",
    };
    return newItem(iconElement, item, actions);
  }

  function newCookieItem(item, actions) {
    const iconElement = {
      class: "fa-solid fa-cookie fa-lg",
      style: "color: #ffaa3b;",
    };

    return newItem(iconElement, item, actions);
  }

  function newItem(iconElement, item, actions) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const itemBody = newItemBody(iconElement, item, actions);
    const tokenArea = newTokenArea(item.id, item.value);
    const tokenTextAreaFooter = newItemFooter(item.id, actions.setFnc);

    li.appendChild(itemBody);
    li.appendChild(tokenArea);
    li.appendChild(tokenTextAreaFooter);

    return li;
  }

  function newItemBody(iconElement, item, actions) {
    const itemBody = document.createElement("div");
    itemBody.classList.add("d-flex");
    itemBody.classList.add("justify-content-between");
    itemBody.classList.add("align-items-center");
    itemBody.style.width = "100%";

    const aliasDiv = newAlias(item.alias, iconElement);
    itemBody.appendChild(aliasDiv);

    const actionDiv = newAction(item.id, item.value, actions);
    itemBody.appendChild(actionDiv);

    return itemBody;
  }

  function newAlias(alias, iconType) {
    const aliasDiv = document.createElement("div");
    aliasDiv.classList.add("align-items-center");
    aliasDiv.classList.add("d-flex");

    const icon = newIcon(iconType);
    icon.style.marginRight = "10px";

    const span = document.createElement("span");
    span.textContent = alias;

    aliasDiv.appendChild(icon);
    aliasDiv.appendChild(span);

    return aliasDiv;
  }

  function newAction(itemId, value, actions) {
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("d-flex");
    actionDiv.classList.add("listActions");

    const copyBtn = newButton(
      { class: "fa-solid fa-copy fa-lg", style: "color: #495057;" },
      itemId,
      value === undefined || value === null,
      undefined,
      actions.copyFnc
    );

    if (value) actionDiv.append(copyBtn);
    actionDiv.append(newDropdown(itemId, value, actions));

    return actionDiv;
  }

  function newDropdown(itemId, value, actions) {
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");
    dropdown.classList.add("dropstart");
    dropdown.append(newDropDownButton());

    const options = document.createElement("ul");
    options.classList.add("dropdown-menu");

    options.appendChild(
      newDropdownOption(
        itemId,
        "View value",
        !value,
        {
          class: "fa-solid fa-eye fa-lg",
          style: "color: #495057; margin-right: 10px;",
        },
        actions.viewFnc,
        `viewBtn-${itemId}`
      )
    );
    options.appendChild(
      newDropdownOption(
        itemId,
        "Set value",
        false,
        {
          class: "fa-solid fa-wand-magic-sparkles fa-lg",
          style: "color: #495057; margin-right: 10px;",
        },
        function () {
          const textArea = document.getElementById(`token-${itemId}`);
          textArea.classList.remove("display-none");
          textArea.disabled = false;
          const textAreaFooter = document.getElementById(
            `textAreaFooter-${itemId}`
          );
          textAreaFooter.classList.remove("display-none");
        }
      )
    );
    options.appendChild(newLiItemSeparator());
    options.appendChild(
      newDropdownOption(
        itemId,
        "Delete key",
        false,
        {
          class: "fa-solid fa-trash-can fa-lg",
          style: "color: #495057; margin-right: 10px;",
        },
        actions.deleteFnc
      )
    );

    dropdown.appendChild(options);

    return dropdown;
  }

  function newButton(iconType, itemId, disabled, btnClass, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = disabled;
    button.classList.add("btn");
    button.classList.add(btnClass);

    const icon = newIcon(iconType);
    button.appendChild(icon);

    button.addEventListener("click", () => onClick(button, itemId));

    return button;
  }

  function newDropDownButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-bs-toggle", "dropdown");
    button.setAttribute("aria-expanded", "false");
    button.classList.add("btn");

    const icon = newIcon({
      class: "fa-solid fa-ellipsis-vertical",
      style: "color: #495057;",
    });
    button.appendChild(icon);

    return button;
  }

  function newDropdownOption(
    itemId,
    text,
    disabled,
    iconType,
    onClick,
    buttonId
  ) {
    const liItem = document.createElement("li");
    const button = document.createElement("button");
    button.id = buttonId;
    button.type = "button";
    button.disabled = disabled;

    button.classList.add("dropdown-item");
    button.addEventListener("click", () => onClick(itemId, button));

    if (iconType) {
      const icon = newIcon(iconType);
      button.appendChild(icon);
    }
    button.appendChild(document.createTextNode(text));

    liItem.appendChild(button);
    return liItem;
  }

  function newLiItemSeparator() {
    const liItem = document.createElement("li");

    const hr = document.createElement("hr");
    hr.classList.add("dropdown-divider");

    liItem.appendChild(hr);
    return liItem;
  }

  function newItemFooter(itemId, setFnc) {
    const textAreaFooter = document.createElement("div");
    textAreaFooter.style.marginTop = "10px";
    textAreaFooter.classList.add("display-none");
    textAreaFooter.classList.add("flex-row");
    textAreaFooter.classList.add("justify-end");
    textAreaFooter.id = `textAreaFooter-${itemId}`;

    const applyBtn = document.createElement("button");
    applyBtn.type = "button";
    applyBtn.classList.add("btn");
    applyBtn.classList.add("btn-outline-success");

    applyBtn.addEventListener("click", function () {
      const textAreaFooter = document.getElementById(
        `textAreaFooter-${itemId}`
      );
      textAreaFooter.classList.add("display-none");

      const textArea = document.getElementById(`token-${itemId}`);
      textArea.disabled = true;

      const value = textArea.value;
      setFnc(itemId, value);
    });

    const label = document.createElement("span");
    label.classList.add("btn-label");

    const icon = newIcon({ class: "fa-solid fa-floppy-disk fa-lg" });
    icon.style.marginRight = "10px";

    label.appendChild(icon);
    applyBtn.appendChild(label);
    applyBtn.appendChild(document.createTextNode("Apply"));

    textAreaFooter.appendChild(applyBtn);
    return textAreaFooter;
  }
  
  function newIcon(iconType) {
    const icon = document.createElement("i");
    const classes = iconType.class.split(" ");
    for (let i = 0; i < classes?.length; i++) {
      icon.classList.add(classes[i]);
    }
    if (iconType.style) icon.style.cssText += iconType.style;

    return icon;
  }

  function newTokenArea(itemId, value) {
    const textArea = document.createElement("textarea");
    textArea.id = `token-${itemId}`;
    textArea.classList.add("tokenTextArea");
    textArea.classList.add("full-width");
    textArea.style.overflowX = "hidden";
    textArea.style.overflowY = "scroll";
    textArea.classList.add("display-none");
    textArea.disabled = true;
    textArea.innerText = value || "";
    textArea.rows = 1;

    return textArea;
  }
  
  return {
    newCookieItem,
    newLocalItem,
    newSessionItem,
  };
};
