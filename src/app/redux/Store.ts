import { configureStore } from '@reduxjs/toolkit';

import { appStateSlice, authStateSlice } from './slices';

const store = configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    authState: authStateSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
