import { Menu } from "@prisma/client";
import { BaseOptions } from "./app";

export interface MenuSlice {
  items: Menu[];
  isLoading: boolean;
  error: Error | null;
}

export interface GetMenuOptions extends BaseOptions {
  locationId: string;
}

export interface CreateMenuOptions extends BaseOptions {
  name: string;
  price: number;
  menuCategoryIds: number[];
}

export interface UpdateMenuOptions extends BaseOptions {
  id: number;
  name: string;
  price: number;
  menuCategoryIds: number[];
}

export interface DeleteMenuOptions extends BaseOptions {
  id: number;
}
