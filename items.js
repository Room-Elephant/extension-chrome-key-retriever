const appCreator = () => {
  function newSessionItem(
    itemId,
    alias,
    value,
    setFnc,
    copyFnc,
    viewFnc,
    deleteFnc
  ) {
    const iconElement = {
      class: "fa-sharp fa-regular fa-folder-open",
      style: "color: #ffaa3b",
    };
    return newItem(
      itemId,
      alias,
      value,
      iconElement,
      setFnc,
      copyFnc,
      viewFnc,
      deleteFnc
    );
  }

  function newLocalItem(
    itemId,
    alias,
    value,
    setFnc,
    copyFnc,
    viewFnc,
    deleteFnc
  ) {
    const iconElement = {
      class: "fa-solid fa-box-archive fa-lg",
      style: "color: #865318",
    };
    return newItem(
      itemId,
      alias,
      value,
      iconElement,
      setFnc,
      copyFnc,
      viewFnc,
      deleteFnc
    );
  }

  function newCookieItem(
    itemId,
    alias,
    value,
    setFnc,
    copyFnc,
    viewFnc,
    deleteFnc
  ) {
    const iconElement = {
      class: "fa-solid fa-cookie fa-lg",
      style: "color: #ffaa3b;",
    };

    return newItem(
      itemId,
      alias,
      value,
      iconElement,
      setFnc,
      copyFnc,
      viewFnc,
      deleteFnc
    );
  }

  function newItem(
    itemId,
    alias,
    value,
    iconType,
    setFnc,
    copyFnc,
    viewFnc,
    deleteFnc
  ) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const itemBody = newItemBody(
      itemId,
      alias,
      value,
      iconType,
      setFnc,
      copyFnc,
      viewFnc,
      deleteFnc
    );
    const TokenParent = newItemFooter(itemId, value);

    li.appendChild(itemBody);
    li.appendChild(TokenParent);

    return li;
  }

  function newItemFooter(itemId, value) {
    const card = document.createElement("div");
    card.id = `card-${itemId}`;
    card.classList.add("card");
    card.style.maxHeight = "60px";
    card.style.overflow = "hidden";
    card.style.overflowY = "scroll";
    card.classList.add("display-none");
    const cardBody = document.createElement("div");
    card.classList.add("card-body");

    const token = document.createElement("p");
    token.id = `token-${itemId}`;
    token.classList.add("text-break");
    token.innerText = value;

    cardBody.appendChild(token);
    card.appendChild(cardBody);

    return card;
  }

  function newItemBody(
    itemId,
    alias,
    value,
    icon,
    setFnc,
    copyFnc,
    viewFnc,
    deleteFnc
  ) {
    const itemBody = document.createElement("div");
    itemBody.classList.add("d-flex");
    itemBody.classList.add("justify-content-between");
    itemBody.classList.add("align-items-center");
    itemBody.style.width = "100%";

    const aliasDiv = newAlias(itemId, alias, icon);
    itemBody.appendChild(aliasDiv);

    const actionDiv = newAction(
      itemId,
      value,
      setFnc,
      copyFnc,
      viewFnc,
      deleteFnc
    );
    itemBody.appendChild(actionDiv);

    return itemBody;
  }

  function newAlias(itemId, alias, iconType) {
    const aliasDiv = document.createElement("div");
    aliasDiv.classList.add("align-items-center");
    aliasDiv.classList.add("d-flex");

    const deleteCheckbox = document.createElement("input");
    deleteCheckbox.setAttribute("type", "checkbox");
    deleteCheckbox.setAttribute("name", "delete");
    deleteCheckbox.setAttribute("id", itemId);
    deleteCheckbox.classList.add("form-check-input");
    deleteCheckbox.classList.add("display-none");
    deleteCheckbox.classList.add("delete-checkbox");
    deleteCheckbox.style.marginRight = "10px";

    const icon = newIcon(iconType);
    icon.style.marginRight = "10px";

    const span = document.createElement("span");
    span.textContent = alias;

    aliasDiv.appendChild(deleteCheckbox);
    aliasDiv.appendChild(icon);
    aliasDiv.appendChild(span);

    return aliasDiv;
  }

  function newAction(itemId, value, setFnc, copyFnc, viewFnc, deleteFnc) {
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("d-flex");
    actionDiv.classList.add("listActions");

    const copyBtn = newButton(
      { class: "fa-solid fa-copy fa-lg", style: "color: #495057;" },
      itemId,
      value === undefined || value === null,
      undefined,
      copyFnc
    );

    if (value) actionDiv.append(copyBtn);
    actionDiv.append(newDropdown(itemId, value, viewFnc, deleteFnc));

    return actionDiv;
  }

  function newDropdown(itemId, value, viewFnc, deleteFnc) {
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");
    dropdown.classList.add("dropstart");
    dropdown.append(newDropDownButton());

    const options = document.createElement("ul");
    options.classList.add("dropdown-menu");

    options.appendChild(
      newDropdownOption(
        itemId,
        " view value",
        !value,
        { class: "fa-solid fa-eye fa-lg", style: "color: #495057;" },
        viewFnc
      )
    );
    options.appendChild(
      newDropdownOption(itemId, "set value", true, undefined, () => {})
    );
    options.appendChild(newLiItemSeparator());
    options.appendChild(
      newDropdownOption(itemId, "edit", true, undefined, () => {})
    );
    options.appendChild(
      newDropdownOption(itemId, "delete", false, undefined, deleteFnc)
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

  function newDropdownOption(itemId, text, disabled, iconType, onClick) {
    const liItem = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = disabled;

    button.classList.add("dropdown-item");
    button.addEventListener("click", () => onClick(itemId));

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

  function newIcon(iconType) {
    const icon = document.createElement("i");
    const classes = iconType.class.split(" ");
    for (let i = 0; i < classes?.length; i++) {
      icon.classList.add(classes[i]);
    }
    if (iconType.style) icon.style.cssText += iconType.style;

    return icon;
  }

  return {
    newCookieItem,
    newLocalItem,
    newSessionItem,
  };
};
