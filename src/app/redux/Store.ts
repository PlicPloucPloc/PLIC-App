import { configureStore } from '@reduxjs/toolkit';
import { appStateSlice, authStateSlice, apartmentApi } from './slices';

const store = configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    authState: authStateSlice.reducer,
    [apartmentApi.reducerPath]: apartmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apartmentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
