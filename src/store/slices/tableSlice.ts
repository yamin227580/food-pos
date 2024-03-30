import { TableSlice } from "@/types/table";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TableSlice = {
  items: [],
  isLoading: false,
  error: null,
};

const tableSlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setTables } = tableSlice.actions;
export default tableSlice.reducer;
