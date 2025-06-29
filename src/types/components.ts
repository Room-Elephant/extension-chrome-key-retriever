import { Types } from "../types/constants";
import { Action } from "./action";
import { Item } from "./item";
import { Icon, Option } from "./options";

export interface NewButton extends Omit<Option, "itemId" | "separator" | "onClick"> {
  classNames?: string;
  onClick?: (button: HTMLButtonElement) => void;
}

export interface NewListItemItem extends Item {
  text: string;
  icon: Icon;
}

export interface NewAction {
  action: HTMLButtonElement | HTMLDivElement;
  visible?: boolean;
}

export interface Footer {
  body: HTMLTextAreaElement | HTMLDivElement;
  actions: HTMLButtonElement[];
}

export interface NewItem {
  storageType: Types;
  item: Item;
  actions: Action;
}

export interface NewListItem {
  item: NewListItemItem;
  actions: NewAction[];
  footer?: Footer;
}
