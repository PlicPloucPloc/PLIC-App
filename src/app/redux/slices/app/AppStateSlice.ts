import { RootEnum } from '@app/definitions';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface IAppState {
  root: RootEnum;
  shouldRefetchLiked: boolean;
}

const initialState: IAppState = {
  root: RootEnum.ROOT_AUTH,
  shouldRefetchLiked: true,
};

export const appStateSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setRoot: (state, action: PayloadAction<RootEnum>) => {
      state.root = action.payload;
    },
    setShouldRefetchLiked: (state, action: PayloadAction<boolean>) => {
      state.shouldRefetchLiked = action.payload;
    },
  },
});

export const { setRoot, setShouldRefetchLiked } = appStateSlice.actions;

export default appStateSlice.reducer;
