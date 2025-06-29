import { addClassesToElement } from "./view/utils/styles.js";

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

function newLabelWithBadge({ label, value }) {
  const wrapper = document.createElement("div");
  addClassesToElement(wrapper, "mb-2");

  const labelElement = document.createElement("span");
  addClassesToElement(labelElement, "me-2 fw-lighter");
  labelElement.innerText = label;

  const badge = newBadge({ value });

  wrapper.appendChild(labelElement);
  wrapper.appendChild(badge);

  return wrapper;
}

function newBadge({ value }) {
  const badge = document.createElement("span");
  addClassesToElement(badge, "badge text-bg-secondary me-3");
  badge.innerText = value;
  return badge;
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

export { newIcon, newSeparator, newButton, newTextArea, newDropdown, newListItem, newLabelWithBadge, newBadge };
