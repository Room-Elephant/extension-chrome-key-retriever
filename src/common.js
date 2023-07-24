const TYPES = { LOCAL: "local", SESSION: "session", COOKIE: "cookie" };

function addClassesToElement(element, classNames) {
  const classes = classNames.split(" ");
  classes.forEach((elementClass) => element.classList.add(elementClass));
}

export { TYPES
        ,
        addClassesToElement };
