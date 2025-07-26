export interface Icon {
  classNames: string;
  style: string;
}

export interface Option {
  id?: string;
  itemId: string;
  icon: Icon;
  label?: string;
  disabled?: boolean;
  onClick: (itemId: string, element: HTMLButtonElement) => void;
  separator?: boolean;
}
