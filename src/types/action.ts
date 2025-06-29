export interface Action {
  viewFnc: (id: number, element: HTMLButtonElement) => void;
  deleteFnc: (id: number) => void;
  copyFnc: (element: HTMLButtonElement, id: number) => void;
  setFnc: (id: number, value: string) => void;
}
