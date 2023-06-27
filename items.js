const appCreator = () => {
  function getFormData() {
    const alias = document.getElementById("alias").value;
    const key = document.getElementById("key").value;
    const subKey = document.getElementById("subKey").value || undefined;
    const storageType = document.querySelector(
      'input[name="storage"]:checked'
    ).value;

    return { alias, key, subKey, type: storageType };
  }

  function newLocalItem(alias, value, copyFnc, viewFnc) {
    return newItem(alias, value, "bi-archive", copyFnc, viewFnc);
  }

  function newCookieItem(alias, value, copyFnc, viewFnc) {
    return newItem(alias, value, "bi-egg-fried", copyFnc, viewFnc);
  }

  function newItem(alias, value, type, copyFnc, viewFnc) {
    const itemId = alias.trim();

    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const itemBody = newItemBody(itemId, alias, value, type, copyFnc, viewFnc);
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

  function newItemBody(itemId, alias, value, type, copyFnc, viewFnc) {
    const itemBody = document.createElement("div");
    itemBody.classList.add("d-flex");
    itemBody.classList.add("justify-content-between");
    itemBody.classList.add("align-items-center");
    itemBody.style.width = "100%";
    itemBody.style.marginBottom = "5px";

    const aliasDiv = newAlias(itemId, alias, type);
    const actionDiv = newAction(itemId, value, copyFnc, viewFnc);

    itemBody.appendChild(aliasDiv);
    itemBody.appendChild(actionDiv);

    return itemBody;
  }

  function newAlias(itemId, alias, type) {
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

    const i = newI(type);
    i.style.marginRight = "5px";

    const span = document.createElement("span");
    span.textContent = alias;

    aliasDiv.appendChild(deleteCheckbox);
    aliasDiv.appendChild(i);
    aliasDiv.appendChild(span);

    return aliasDiv;
  }

  function newAction(itemId, value, copyFnc, viewFnc) {
    const actionDiv = document.createElement("div");

    const viewBtn = newButton("bi-eye", itemId, value === undefined, viewFnc);
    viewBtn.style.marginRight = "5px";
    const copyBtn = newButton(
      "bi-clipboard",
      itemId,
      value === undefined,
      copyFnc
    );

    actionDiv.append(viewBtn);
    actionDiv.append(copyBtn);

    return actionDiv;
  }

  function newButton(icon, itemId, disabled, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = disabled;
    button.classList.add("btn");

    const i = newI(icon);

    button.appendChild(i);

    button.addEventListener("click", () => onClick(button, itemId));

    return button;
  }

  function newI(icon) {
    const i = document.createElement("div");
    i.classList.add("bi");
    i.classList.add(icon);

    return i;
  }

  return {
    newCookieItem,
    newLocalItem,
    getFormData,
  };
};
