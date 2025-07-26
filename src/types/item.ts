import { StoredItem } from "./storedItem";

export interface Item extends StoredItem {
  icon: {
    classNames: string;
    style: string;
  };
  label: string;
  disabled: boolean;
  onClick: (id: string) => void;
  separator: boolean;
  text: string;
}
