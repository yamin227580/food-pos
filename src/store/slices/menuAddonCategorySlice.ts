import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuAddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

const menuAddonCategorySlice = createSlice({
  name: "menuAddonCategorySlice",
  initialState,
  reducers: {
    setMenuAddonCategories: (state, action) => {
      state.items = action.payload;
    },
    addMenuAddonCategory: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuAddonCategory: (state, action) => {
      const addonCategoryId = action.payload[0].addonCategoryId; // 5
      const otherMenuAddonCategory = state.items.filter(
        (item) => item.addonCategoryId !== addonCategoryId
      );
      state.items = [...otherMenuAddonCategory, ...action.payload];
    },
    removeMenuAddonCategoryById: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setMenuAddonCategories,
  addMenuAddonCategory,
  replaceMenuAddonCategory,
  removeMenuAddonCategoryById,
} = menuAddonCategorySlice.actions;
export default menuAddonCategorySlice.reducer;
