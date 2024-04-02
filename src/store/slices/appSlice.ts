import { AppSlice, GetAppDataOptions } from "@/types/app";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAddonCategories } from "./addonCategorySlice";
import { setAddons } from "./addonSlice";
import { setLocations } from "./locationSlice";
import { setMenuCategoryMenus } from "./menuCategoryMenuSlice";
import { setMenuCategories } from "./menuCategorySlice";
import { setMenus } from "./menuSlice";
import { setTables } from "./tableSlice";

const initialState: AppSlice = {
  init: false,
  isLoading: false,
  error: null,
};

export const fetchAppData = createAsyncThunk(
  "app/fetchAppData",
  async (options: GetAppDataOptions, thunkApi) => {
    const { onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/app`);
      const appData = await response.json();
      const {
        locations,
        menuCategories,
        menuCategoryMenus,
        menus,
        addonCategories,
        addons,
        tables,
      } = appData;
      thunkApi.dispatch(setMenuCategories(menuCategories));
      thunkApi.dispatch(setMenus(menus));
      thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenus));
      thunkApi.dispatch(setAddonCategories(addonCategories));
      thunkApi.dispatch(setAddons(addons));
      thunkApi.dispatch(setLocations(locations));
      thunkApi.dispatch(setTables(tables));

      onSuccess && onSuccess();

      thunkApi.dispatch(setInit(true));
    } catch (err) {
      onError && onError();
    }
  }
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInit: (state, action) => {
      state.init = action.payload;
    },
  },
});

export const { setInit } = appSlice.actions;
export default appSlice.reducer;
