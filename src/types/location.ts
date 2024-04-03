import { Location } from "@prisma/client";
import { BaseOptions } from "./app";

export interface LocationSlice {
  items: Location[];
  isLoading: boolean;
  error: Error | null;
}
export interface CreateNewLocationOptions extends BaseOptions {
  name: string;
  address: string;
}
