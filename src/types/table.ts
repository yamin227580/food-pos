import { Table } from "@prisma/client";

export interface TableSlice {
  items: Table[];
  isLoading: boolean;
  error: Error | null;
}
