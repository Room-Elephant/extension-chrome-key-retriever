import { addClassesToElement } from "./view/utils/styles.js";

import "./index.css";

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
    if (body) footer.appendChild(body);
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

export default newListItem;
