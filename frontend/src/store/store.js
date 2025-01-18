import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./api/authApiSlice";
import themeSlice from "./themeSlice";
import { blogApiSlice } from "./api/blogApiSlice";
const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [blogApiSlice.reducerPath]: blogApiSlice.reducer,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      blogApiSlice.middleware
    ),
});

export default store;
