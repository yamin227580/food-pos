import { AddonCategory } from "@prisma/client";

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
export interface AddonCategorySlice {
  items: AddonCategory[];
  isLoading: boolean;
  error: Error | null;
}
