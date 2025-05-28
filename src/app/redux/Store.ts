import { configureStore } from '@reduxjs/toolkit';

import { apartmentApi, appStateSlice, authStateSlice, userApi } from './slices';

const store = configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    authState: authStateSlice.reducer,
    [apartmentApi.reducerPath]: apartmentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      .concat(apartmentApi.middleware)
      .concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
