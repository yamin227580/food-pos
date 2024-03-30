import { AddonSlice } from "@/types/addon";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AddonSlice = {
  items: [],
  isLoading: false,
  error: null,
};

const addonSlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setAddons: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setAddons } = addonSlice.actions;
export default addonSlice.reducer;
