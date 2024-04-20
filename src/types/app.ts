export interface AppSlice {
  init: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface GetAppDataOptions extends BaseOptions {
  tableId?: number;
}
