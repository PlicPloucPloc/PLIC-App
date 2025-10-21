import { configureStore } from '@reduxjs/toolkit';

import { appStateSlice, authStateSlice, filtersStateSlice } from './slices';

const store = configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    authState: authStateSlice.reducer,
    filtersState: filtersStateSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
