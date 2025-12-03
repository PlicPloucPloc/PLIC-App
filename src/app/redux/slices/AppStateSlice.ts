import { SwipeDirection } from '@ellmos/rn-swiper-list';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootEnum } from '@app/definitions';
import { Room } from '@app/definitions/rest/ChatService';

export interface IAppState {
  root: RootEnum;
  shouldRefetchLikeList: boolean;
  shouldRefetchHistory: boolean;
  swipeDirection: SwipeDirection | undefined;
  shouldRefecthMessages: boolean;
  shouldRefetchRoomInfo: Room | null;
}

const initialState: IAppState = {
  root: RootEnum.ROOT_AUTH,
  shouldRefetchLikeList: false,
  shouldRefetchHistory: false,
  swipeDirection: undefined,
  shouldRefecthMessages: false,
  shouldRefetchRoomInfo: null,
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
    setShouldRefecthMessages: (state, action: PayloadAction<boolean>) => {
      state.shouldRefecthMessages = action.payload;
    },
    setShouldRefetchRoomInfo: (state, action: PayloadAction<Room | null>) => {
      state.shouldRefetchRoomInfo = action.payload;
    },
  },
});

export const {
  setRoot,
  setShouldRefetchLikeList,
  setShouldRefetchHistory,
  setSwipeDirection,
  setShouldRefecthMessages,
  setShouldRefetchRoomInfo,
} = appStateSlice.actions;

export default appStateSlice.reducer;
