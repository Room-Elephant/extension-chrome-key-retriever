function appComponents() {
  function newListItem({ item, actions, footer }) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const liBody = document.createElement("div");
    addClassesToElement(liBody, "flex justify-content-between align-items-center w-100");

    liBody.appendChild(newLabel({ icon: item.icon, text: item.text }));

    if (actions) {
      const actionsElement = document.createElement("div");
      addClassesToElement(actionsElement, "flex flex-row");

      actions.forEach((action) => actionsElement.appendChild(newAction(action)));
      liBody.appendChild(actionsElement);
    }

    const liFooter = document.createElement("div");
    liFooter.appendChild(newFooter(footer));

    li.appendChild(liBody);
    li.appendChild(liFooter);
    return li;

    function newLabel({ icon, text }) {
      const label = document.createElement("div");
      addClassesToElement(label, "flex align-items-center");

      const iconElement = newIcon(icon);

      const textElement = document.createElement("span");
      textElement.textContent = text;

      label.appendChild(iconElement);
      label.appendChild(textElement);

      return label;
    }

    function newAction({ action, visible = true }) {
      const actionElement = document.createElement("div");
      addClassesToElement(actionElement, "flex listActions");

      if (!visible) action.classList.add("display-none");
      actionElement.appendChild(action);

      return actionElement;
    }

    function newFooter({ body, actions }) {
      const footer = document.createElement("div");
      if (body) {
        footer.appendChild(body.keyDetails);
        footer.appendChild(body.tokenArea);
      }
      if (actions) {
        const actionsFooter = document.createElement("div");
        actionsFooter.id = `textAreaFooter-${item.id}`;
        addClassesToElement(actionsFooter, "mt-1 display-none flex flex-row justify-content-end");

        actions.forEach((action) => actionsFooter.appendChild(action));

        footer.appendChild(actionsFooter);
      }
      return footer;
    }
  }

  function newDropdown({ options }) {
    const dropdown = document.createElement("div");
    addClassesToElement(dropdown, "dropdown dropstart");

    dropdown.append(newDropdownButton());

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu");
    options?.forEach((option) => dropdownMenu.appendChild(newDropdownOption({ ...option })));

    dropdown.appendChild(dropdownMenu);

    return dropdown;

    function newDropdownButton() {
      const button = newButton({
        icon: {
          classNames: "fa-solid fa-ellipsis-vertical",
          style: "color: var(--dark-gray);",
        },
        classNames: "btn",
      });

      button.setAttribute("data-bs-toggle", "dropdown");
      button.setAttribute("aria-expanded", "false");
      return button;
    }

    function newDropdownOption({ icon, id, itemId, label, disabled = false, onClick, separator = false }) {
      const liItem = document.createElement("li");
      const option = newButton({
        icon,
        id,
        classNames: "dropdown-item",
        label,
        disabled,
        onClick: (element) => onClick(itemId, element),
      });

      if (separator) liItem.appendChild(newSeparator());
      liItem.appendChild(option);
      return liItem;
    }
  }

  function newTextArea({ id, classNames, style, disabled = false, text = "", rows = 1 }) {
    const textArea = document.createElement("textarea");
    if (id) textArea.id = id;
    if (classNames) addClassesToElement(textArea, classNames);
    if (style) textArea.style.cssText += style;

    textArea.disabled = disabled;
    textArea.innerText = text;
    textArea.rows = rows;

    return textArea;
  }

  function newKeyDetails({ id, key, subKey }) {
    const wrapper = document.createElement("div");
    addClassesToElement(wrapper, "mb-2 display-none");
    wrapper.id = `key-${id}`;

    const spanKey = document.createElement("span");
    addClassesToElement(spanKey, "fw-lighter");
    spanKey.innerHTML = "Key ";

    const spanKeyValue = document.createElement("span");
    addClassesToElement(spanKeyValue, "badge text-bg-secondary me-3");
    spanKeyValue.innerHTML = key;

    wrapper.appendChild(spanKey);
    wrapper.appendChild(spanKeyValue);

    if (subKey) {
      const spanSubKey = document.createElement("span");
      addClassesToElement(spanSubKey, "fw-lighter");
      spanSubKey.innerHTML = "Subkey ";

      const spanSubKeyValue = document.createElement("span");
      addClassesToElement(spanSubKeyValue, "badge text-bg-secondary");
      spanSubKeyValue.innerHTML = subKey;

      wrapper.appendChild(spanSubKey);
      wrapper.appendChild(spanSubKeyValue);
    }

    return wrapper;
  }

  function newButton({ icon, disabled = false, onClick, classNames, id, label }) {
    const button = document.createElement("button");

    button.type = "button";
    button.disabled = disabled;
    button.classList.add("btn");

    if (id) button.id = id;

    if (classNames) addClassesToElement(button, classNames);

    if (onClick) button.addEventListener("click", () => onClick(button));

    if (icon) {
      const iconElement = newIcon(icon);
      button.appendChild(iconElement);
    }

    if (label) button.appendChild(document.createTextNode(label));

    return button;
  }

  function newIcon({ classNames, style }) {
    const icon = document.createElement("i");
    if (classNames) addClassesToElement(icon, classNames);
    if (style) icon.style.cssText += style;

    return icon;
  }

  function newSeparator() {
    const liItem = document.createElement("li");

    const hr = document.createElement("hr");
    hr.classList.add("dropdown-divider");

    liItem.appendChild(hr);
    return liItem;
  }

  function addClassesToElement(element, classNames) {
    const classes = classNames.split(" ");
    classes.forEach((elementClass) => element.classList.add(elementClass));
  }

  return {
    newIcon,
    newSeparator,
    newButton,
    newTextArea,
    newDropdown,
    newListItem,
    newKeyDetails,
  };
}
