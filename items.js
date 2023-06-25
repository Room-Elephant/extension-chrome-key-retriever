const appCreator = () => {
  function localStorageItem(alias, value) {
    return item(alias, value, "/images/icon-package-48.png");
  }

  function cookieItem(alias, value) {
    return item(alias, value, "/images/icon-cookies-48.png");
  }

  function item(alias, value, imgTypeSrc) {
    const itemParentDiv = document.createElement("div");
    itemParentDiv.classList.add("flex-row");
    itemParentDiv.classList.add("justify-between");
    itemParentDiv.classList.add("align-center");
    itemParentDiv.classList.add("full-width");

    const itemDetailsElement = itemDetails(alias, imgTypeSrc);

    const copyElement = document.createElement("img");
    copyElement.src = "./images/icon-copy-24.png";
    copyElement.width = "15";
    copyElement.height = "15";

    itemParentDiv.appendChild(itemDetailsElement);
    itemParentDiv.appendChild(copyElement);

    /* DEBUG */
    const para = document.createElement("p");
    para.innerText = value;
    itemParentDiv.appendChild(para);
    /* DEBUG */

    return itemParentDiv;
  }

  function itemDetails(alias, imgTypeSrc) {
    const itemTextDiv = document.createElement("div");
    itemTextDiv.classList.add("flex-row");
    itemTextDiv.classList.add("align-center");

    const textElement = document.createElement("p");
    textElement.innerText = alias;

    const imgType = type(imgTypeSrc);

    itemTextDiv.appendChild(imgType);
    itemTextDiv.appendChild(textElement);

    return itemTextDiv;
  }

  function type(imgTypeSrc) {
    const imgType = document.createElement("img");
    imgType.width = "20";
    imgType.height = "20";
    imgType.classList.add("margin-s");
    imgType.src = imgTypeSrc;

    return imgType;
  }

  return {
    localStorageItem,
    cookieItem,
  };
};
