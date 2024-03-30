import { AddonCategorySlice } from "@/types/addonCategory";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

const addonCategorySlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setAddonCategories: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setAddonCategories } = addonCategorySlice.actions;
export default addonCategorySlice.reducer;
