import { RootEnum } from '@app/definitions';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface IAppState {
  root: RootEnum;
  shouldRefetchLikeList: boolean;
  shouldRefetchHistory: boolean;
}

const initialState: IAppState = {
  root: RootEnum.ROOT_INSIDE,
  shouldRefetchLikeList: false,
  shouldRefetchHistory: false,
};

export const appStateSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setRoot: (state, action: PayloadAction<RootEnum>) => {
      state.root = action.payload;
    },
    setShouldRefetchLikeList: (state, action: PayloadAction<boolean>) => {
      state.shouldRefetchLikeList = action.payload;
    },
    setShouldRefetchHistory: (state, action: PayloadAction<boolean>) => {
      state.shouldRefetchHistory = action.payload;
    },
  },
});

export const { setRoot, setShouldRefetchLikeList, setShouldRefetchHistory } = appStateSlice.actions;

export default appStateSlice.reducer;
