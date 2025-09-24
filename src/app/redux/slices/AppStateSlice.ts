import { RootEnum } from '@app/definitions';
import { AppState } from '@app/definitions/redux';
import { SwipeDirection } from '@ellmos/rn-swiper-list';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AppState = {
  root: RootEnum.ROOT_AUTH,
  shouldRefetchLikeList: false,
  shouldRefetchHistory: false,
  swipeDirection: undefined,
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
    setSwipeDirection: (state, action: PayloadAction<SwipeDirection | undefined>) => {
      state.swipeDirection = action.payload;
    },
  },
});

export const { setRoot, setShouldRefetchLikeList, setShouldRefetchHistory, setSwipeDirection } =
  appStateSlice.actions;

export default appStateSlice.reducer;
