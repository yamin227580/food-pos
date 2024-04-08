import {
  AddonSlice,
  CreateAddonOptions,
  DeleteAddonOptions,
  UpdateAddonOptions,
} from "@/types/addon";
import { config } from "@/utils/config";
import { Addon } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AddonSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createAddon = createAsyncThunk(
  "addon/createAddon",
  async (options: CreateAddonOptions, thunkApi) => {
    const { name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addons`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, addonCategoryId }),
      });
      const { addon } = await response.json();
      thunkApi.dispatch(addAddon(addon));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const updateAddon = createAsyncThunk(
  "addon/updateAddon",
  async (options: UpdateAddonOptions, thunkApi) => {
    const { id, name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addons`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, price, addonCategoryId }),
      });
      const { addon } = await response.json();
      thunkApi.dispatch(replaceAddon(addon));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

export const deleteAddon = createAsyncThunk(
  "addon/deleteAddon",
  async (options: DeleteAddonOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/addons?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeAddon({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const addonSlice = createSlice({
  name: "addon",
  initialState,
  reducers: {
    setAddons: (state, action) => {
      state.items = action.payload;
    },
    replaceAddon: (state, action: PayloadAction<Addon>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    addAddon: (state, action: PayloadAction<Addon>) => {
      state.items = [...state.items, action.payload];
    },
    removeAddon: (state, action: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setAddons, replaceAddon, addAddon, removeAddon } =
  addonSlice.actions;
export default addonSlice.reducer;
