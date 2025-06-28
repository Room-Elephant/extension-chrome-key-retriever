function addClassesToElement(element, classNames) {
  const classes = classNames.split(" ");
  classes.forEach((elementClass) => element.classList.add(elementClass));
}

export { addClassesToElement };
