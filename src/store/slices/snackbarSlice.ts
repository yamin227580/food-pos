import { SnackbarSlice } from "@/types/snackbar";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SnackbarSlice = {
  open: false,
  message: null,
  autoHideDuration: 5000,
  severity: "success",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setOpenSnackbar: (state, action) => {
      const { open, autoHideDuration, message, severity } = action.payload;
      state.open = open;
      state.message = message;
      state.autoHideDuration = autoHideDuration;
      state.severity = severity;
    },
    resetSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { setOpenSnackbar, resetSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
