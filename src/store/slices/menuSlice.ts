import { CreateMenuOptions, GetMenuOptions, MenuSlice } from "@/types/menu";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addMenuCategoryMenu } from "./menuCategoryMenuSlice";

const initialState: MenuSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (options: CreateMenuOptions, thunkApi) => {
    const { name, price, menuCategoryIds, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, menuCategoryIds }),
      });
      const { menu, menuCategoryMenus } = await response.json();
      thunkApi.dispatch(addMenu(menu));
      thunkApi.dispatch(addMenuCategoryMenu(menuCategoryMenus));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const getMenus = createAsyncThunk(
  "menu/getMenus",
  async (options: GetMenuOptions, thunkApi) => {
    const { onSuccess, onError, locationId } = options;
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/menu?locationId=${locationId}`
      );
      const menus = response.json();
      thunkApi.dispatch(setMenus(menus));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (state, action) => {
      state.items = action.payload;
    },
    addMenu: (state, action) => {
      state.items = [...state.items, action.payload];
    },
  },
});

export const { setMenus, addMenu } = menuSlice.actions;
export default menuSlice.reducer;
