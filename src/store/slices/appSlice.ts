import { AppSlice, GetAppDataOptions } from "@/types/app";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAddonCategories } from "./addonCategorySlice";
import { setAddons } from "./addonSlice";
import { setCompany } from "./companySlice";
import { setDisabledLocationMenus } from "./disableLocationMenu";
import { setDisabledLocationMenuCategories } from "./disableLocationMenuCategorySlice";
import { setLocations } from "./locationSlice";
import { setMenuAddonCategories } from "./menuAddonCategorySlice";
import { setMenuCategoryMenus } from "./menuCategoryMenuSlice";
import { setMenuCategories } from "./menuCategorySlice";
import { setMenus } from "./menuSlice";
import { setOrders } from "./orderSlice";
import { setTables } from "./tableSlice";

const initialState: AppSlice = {
  init: false,
  isLoading: false,
  error: null,
};

export const fetchAppData = createAsyncThunk(
  "app/fetchAppData",
  async (options: GetAppDataOptions, thunkApi) => {
    const { tableId, onSuccess, onError } = options;
    console.log("tableId", tableId);
    try {
      const appDataUrl = tableId
        ? `${config.apiBaseUrl}/app?tableId=${tableId}`
        : `${config.apiBaseUrl}/app`;
      const response = await fetch(appDataUrl);
      const appData = await response.json();
      const {
        locations,
        menuCategories,
        menuCategoryMenus,
        menus,
        menuAddonCategories,
        addonCategories,
        addons,
        tables,
        disabledLocationMenuCategories,
        disabledLocationMenus,
        orders,
        company,
      } = appData;
      thunkApi.dispatch(setMenuCategories(menuCategories));
      thunkApi.dispatch(setMenus(menus));
      thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenus));
      thunkApi.dispatch(setAddonCategories(addonCategories));
      thunkApi.dispatch(setMenuAddonCategories(menuAddonCategories));
      thunkApi.dispatch(setAddons(addons));
      thunkApi.dispatch(setLocations(locations));
      thunkApi.dispatch(setTables(tables));
      thunkApi.dispatch(setOrders(orders));
      thunkApi.dispatch(setCompany(company));
      thunkApi.dispatch(
        setDisabledLocationMenuCategories(disabledLocationMenuCategories)
      );
      thunkApi.dispatch(setDisabledLocationMenus(disabledLocationMenus));
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
