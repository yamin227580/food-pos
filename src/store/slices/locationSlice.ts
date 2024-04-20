import { CreateNewLocationOptions, LocationSlice } from "@/types/location";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: LocationSlice = {
  items: [],
  selectedLocation: null,
  isLoading: false,
  error: null,
};

export const createNewLocation = createAsyncThunk(
  "location/createNewLocation",
  async (options: CreateNewLocationOptions, thunkApi) => {
    const { name, address, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/locations`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, address }),
      });
      const createdLocation = await response.json();
      thunkApi.dispatch(addLocation(createdLocation));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.items = action.payload;
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (!selectedLocationId) {
        const firstLocationId = action.payload[0].id;
        localStorage.setItem("selectedLocationId", firstLocationId);
        state.selectedLocation = action.payload[0];
      } else {
        const location = state.items.find(
          (item) => item.id === Number(selectedLocationId)
        );
        if (location) {
          state.selectedLocation = location;
        }
      }
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    addLocation: (state, action) => {
      state.items = [...state.items, action.payload];
    },
  },
});

export const { setLocations, addLocation, setSelectedLocation } =
  locationSlice.actions;
export default locationSlice.reducer;
