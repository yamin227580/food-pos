import { MenuCategory } from "@prisma/client";
import { BaseOptions } from "./app";

export interface MenuCategorySlice {
  items: MenuCategory[];
  isLoading: boolean;
  error: Error | null;
}
export interface CreateMenuCategoryOptions extends BaseOptions {
  name: string;
  locationId: number;
}
export interface UpdateMenuCategoryOptions extends BaseOptions {
  id: number;
  name: string;
  locationId: number;
  isAvailable: boolean;
}
export interface DeleteMenuCategoryOptions extends BaseOptions {
  id: number;
}
