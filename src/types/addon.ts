import { Addon } from "@prisma/client";

export interface AddonSlice {
  items: Addon[];
  isLoading: boolean;
  error: Error | null;
}
