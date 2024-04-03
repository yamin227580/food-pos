import {
  CreateMenuCategoryOptions,
  MenuCategorySlice,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { setMenuCategories, addMenuCategory } = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
