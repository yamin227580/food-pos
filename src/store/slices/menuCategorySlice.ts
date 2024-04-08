import {
  CreateMenuCategoryOptions,
  DeleteMenuCategoryOptions,
  MenuCategorySlice,
  UpdateMenuCategoryOptions,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { MenuCategory } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { removeMenuCategoryMenu } from "./menuCategoryMenuSlice";

const initialState: MenuCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createMenuCategory = createAsyncThunk(
  "menuCategory/createMenuCategory",
  async (options: CreateMenuCategoryOptions, thunkApi) => {
    const { name, locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-categories`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, locationId }),
      });
      const menuCategory = await response.json();
      thunkApi.dispatch(addMenuCategory(menuCategory));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateMenuCategory = createAsyncThunk(
  "menuCategory/updateMenuCategory",
  async (options: UpdateMenuCategoryOptions, thunkApi) => {
    const { id, name, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-categories`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      const { menuCategory } = await response.json();
      thunkApi.dispatch(replaceMenuCategory(menuCategory));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const deleteMenuCategory = createAsyncThunk(
  "menuCategory/deleteMenuCategory",
  async (options: DeleteMenuCategoryOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/menu-categories?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeMenuCategory({ id }));
      thunkApi.dispatch(removeMenuCategoryMenu({ menuCategoryId: id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const menuCategorySlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setMenuCategories: (state, action) => {
      state.items = action.payload;
    },
    addMenuCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenuCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMenuCategory: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setMenuCategories,
  addMenuCategory,
  replaceMenuCategory,
  removeMenuCategory,
} = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
