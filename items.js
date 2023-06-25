const appCreator = () => {
  function localStorageItem(alias, value) {
    return item(alias, value, "/images/icon-package-48.png");
  }

  function cookieItem(alias, value) {
    return item(alias, value, "/images/icon-cookies-48.png");
  }

  function item(alias, value, imgTypeSrc) {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("flex-row");
    mainDiv.classList.add("justify-between");
    mainDiv.classList.add("align-center");
    mainDiv.classList.add("full-width");

    const textDiv = itemDetails(alias, imgTypeSrc);

    const imgCopy = document.createElement("img");
    imgCopy.src = "./images/icon-copy-24.png";
    imgCopy.width = "15";
    imgCopy.height = "15";

    mainDiv.appendChild(textDiv);
    mainDiv.appendChild(imgCopy);

    /* DEBUG */
    const para = document.createElement("p");
    para.innerText = value;
    mainDiv.appendChild(para);
    /* DEBUG */

    return mainDiv;
  }

  function itemDetails(alias, imgTypeSrc) {
    const textDiv = document.createElement("div");
    textDiv.classList.add("flex-row");
    textDiv.classList.add("align-center");

    const para = document.createElement("p");
    para.innerText = alias;

    const imgType = type(imgTypeSrc);

    textDiv.appendChild(imgType);
    textDiv.appendChild(para);

    return textDiv;
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
