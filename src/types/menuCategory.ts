import { MenuCategory } from "@prisma/client";

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
export interface MenuCategorySlice {
  items: MenuCategory[];
  isLoading: boolean;
  error: Error | null;
}
export interface CreateMenuCategoryOptions extends BaseOptions {
  name: string;
  locationId: number;
}
