const appCreator = () => {
  document.addEventListener("DOMContentLoaded", function () {
    let btn = document.getElementById("addKeyBtn");
    btn.addEventListener("click", function () {
      console.log("alert add");
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    let btn = document.getElementById("deleteKeysBtn");
    btn.addEventListener("click", function () {
      console.log("alert delete");
    });
  });

  function localStorageItem(alias, value) {
    return item(alias, value, "/images/icon-package-48.png");
  }

  function cookieItem(alias, value) {
    return item(alias, value, "/images/icon-cookies-48.png");
  }

  function item(alias, value, imgTypeSrc) {
    const itemParentDiv = document.createElement("div");
    const itemKey = alias.trim();
    itemParentDiv.classList.add("flex-row");
    itemParentDiv.classList.add("justify-between");
    itemParentDiv.classList.add("align-center");
    itemParentDiv.classList.add("full-width");

    const itemDetailsElement = itemDetails(alias, value, imgTypeSrc, itemKey);

    const copyElement = document.createElement("img");

    copyElement.addEventListener("click", function () {
      const token = document.getElementById(`token-${itemKey}`).innerHTML;
      navigator.clipboard.writeText(token).then(
        function () {
          console.log(copyElement);
          copyElement.src = "./images/icons8-check-30.png";
          setTimeout(function () {
            copyElement.src = "./images/icon-copy-24.png";
          }, 1000);
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    });
    copyElement.classList.add("cursor-pointer");
    copyElement.classList.add("copy-btn");
    copyElement.src = "./images/icon-copy-24.png";
    copyElement.width = "15";
    copyElement.height = "15";

    itemParentDiv.appendChild(itemDetailsElement);
    itemParentDiv.appendChild(copyElement);

    return itemParentDiv;
  }

  function itemDetails(alias, value, imgTypeSrc, itemKey) {
    const itemTextDiv = document.createElement("div");
    itemTextDiv.classList.add("flex-row");
    itemTextDiv.classList.add("align-center");

    const textElement = document.createElement("p");
    textElement.innerText = alias;

    /* DEBUG */
    const hiddenToken = document.createElement("p");
    hiddenToken.id = `token-${itemKey}`;
    hiddenToken.classList.add("display-none");
    hiddenToken.innerText = value;
    /* DEBUG */

    const imgType = type(imgTypeSrc);

    itemTextDiv.appendChild(imgType);
    itemTextDiv.appendChild(hiddenToken);
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
