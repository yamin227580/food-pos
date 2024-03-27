export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
export interface MenuSlice {
  item: [];
  isLoading: boolean;
  isError: Error | null;
}

export interface GetMenuOptions extends BaseOptions {
  locationId: string;
}
