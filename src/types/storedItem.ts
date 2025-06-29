import { Types } from "./constants";

export interface StoredItem {
  id: number;
  key: string;
  subKey?: string;
  type: Types;
  alias: string;
  value?: string;
}

export type ValueItem = Pick<StoredItem, "id" | "value">;
