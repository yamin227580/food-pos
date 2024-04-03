import { configureStore } from "@reduxjs/toolkit";
import addonCategoryReducer from "./slices/addonCategorySlice";
import addonReducer from "./slices/addonSlice";
import appReducer from "./slices/appSlice";
import locationReducer from "./slices/locationSlice";
import menuAddonCategoryReducer from "./slices/menuAddonCategorySlice";
import menuCategoryMenuReducer from "./slices/menuCategoryMenuSlice";
import menuCategoryReducer from "./slices/menuCategorySlice";
import menuReducer from "./slices/menuSlice";
import snackbarReducer from "./slices/snackbarSlice";
import tableReducer from "./slices/tableSlice";
// ...

export const store = configureStore({
  reducer: {
    app: appReducer,
    menu: menuReducer,
    menuCategory: menuCategoryReducer,
    menuCategoryMenu: menuCategoryMenuReducer,
    menuAddonCategory: menuAddonCategoryReducer,
    addonCategory: addonCategoryReducer,
    addon: addonReducer,
    location: locationReducer,
    table: tableReducer,
    snackbar: snackbarReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
