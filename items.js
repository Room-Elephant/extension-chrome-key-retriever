const appCreator = () => {
  function newSessionItem(alias, value, setFnc, copyFnc, viewFnc) {
    const iconElement = {
      class: "fa-sharp fa-regular fa-folder-open",
      style: "color: #ffaa3b",
    };
    return newItem(alias, value, iconElement, copyFnc, viewFnc);
  }

  function newLocalItem(alias, value, setFnc, copyFnc, viewFnc) {
    const iconElement = {
      class: "fa-solid fa-box-archive fa-lg",
      style: "color: #865318",
    };
    return newItem(alias, value, iconElement, copyFnc, viewFnc);
  }

  function newCookieItem(alias, value, setFnc, copyFnc, viewFnc) {
    const iconElement = {
      class: "fa-solid fa-cookie fa-lg",
      style: "color: #ffaa3b;",
    };

    return newItem(alias, value, iconElement, copyFnc, viewFnc);
  }

  function newItem(alias, value, iconType, copyFnc, viewFnc) {
    const itemId = alias.trim();

    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const itemBody = newItemBody(
      itemId,
      alias,
      value,
      iconType,
      copyFnc,
      viewFnc
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

  function newItemBody(itemId, alias, value, icon, setFnc, copyFnc, viewFnc) {
    const itemBody = document.createElement("div");
    itemBody.classList.add("d-flex");
    itemBody.classList.add("justify-content-between");
    itemBody.classList.add("align-items-center");
    itemBody.style.width = "100%";

    const aliasDiv = newAlias(itemId, alias, icon);
    itemBody.appendChild(aliasDiv);

    const actionDiv = newAction(itemId, value, setFnc, copyFnc, viewFnc);
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
    deleteCheckbox.style.marginRight = "5px";

    const icon = newIcon(iconType);
    icon.style.marginRight = "10px";

    const span = document.createElement("span");
    span.textContent = alias;

    aliasDiv.appendChild(deleteCheckbox);
    aliasDiv.appendChild(icon);
    aliasDiv.appendChild(span);

    return aliasDiv;
  }

  function newAction(itemId, value, setFnc, copyFnc, viewFnc) {
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("d-flex");

    const setBtn = newButton(
      { class: "fa-solid fa-clipboard", style: "color: #214687;" },
      itemId,
      false,
      setFnc
    );
    const viewBtn = newButton(
      { class: "fa-solid fa-eye fa-lg", style: "color: #495057;" },
      itemId,
      value === undefined || value === null,
      viewFnc
    );
    const copyBtn = newButton(
      { class: "fa-solid fa-copy fa-lg", style: "color: #495057;" },
      itemId,
      value === undefined || value === null,
      copyFnc
    );

    if (false) actionDiv.append(setBtn);
    if (value) actionDiv.append(viewBtn);
    if (value) actionDiv.append(copyBtn);

    return actionDiv;
  }

  function newButton(iconType, itemId, disabled, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = disabled;
    button.classList.add("btn");

    const icon = newIcon(iconType);

    button.appendChild(icon);

    button.addEventListener("click", () => onClick(button, itemId));

    return button;
  }

  function newIcon(iconType) {
    const icon = document.createElement("i");
    const classes = iconType.class.split(" ");
    for (let i = 0; i < classes.length; i++) {
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
