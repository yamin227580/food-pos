import { Location } from "@prisma/client";
import { BaseOptions } from "./app";

export interface LocationSlice {
  items: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: Error | null;
}
export interface CreateNewLocationOptions extends BaseOptions {
  name: string;
  street: string;
  township: string;
  city: string;
}
