import { Table } from "@prisma/client";

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
export interface TableSlice {
  items: Table[];
  isLoading: boolean;
  error: Error | null;
}
