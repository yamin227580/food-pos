import { Table } from "@prisma/client";
import { BaseOptions } from "./app";

export interface TableSlice {
  items: Table[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateTableOptions extends BaseOptions {
  name: string;
  locationId?: number;
}

export interface UpdateTableOptions extends BaseOptions {
  id: number;
  name: string;
}

export interface DeleteTableOptions extends BaseOptions {
  id: number;
}
