import { GetMenuOptions, MenuSlice } from "@/types/menu";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: MenuSlice = {
  item: [],
  isLoading: false,
  isError: null,
};

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
      state.item = action.payload;
    },
  },
});

export const { setMenus } = menuSlice.actions;
export default menuSlice.reducer;
