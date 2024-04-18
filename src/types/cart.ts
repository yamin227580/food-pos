import { Addon, Menu } from "@prisma/client";

export interface CartItem {
  id: number;
  menu: Menu;
  addons: Addon[];
  quantity: number;
}
