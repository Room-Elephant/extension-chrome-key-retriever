function addClassesToElement(element: HTMLElement, classNames: string): void {
  const classes: string[] = classNames.split(" ");
  classes.forEach((elementClass: string) => element.classList.add(elementClass));
}

export { addClassesToElement };
