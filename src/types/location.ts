import { Location } from "@prisma/client";

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
export interface LocationSlice {
  items: Location[];
  isLoading: boolean;
  error: Error | null;
}
export interface CreateNewLocationOptions extends BaseOptions {
  name: string;
  address: string;
}
