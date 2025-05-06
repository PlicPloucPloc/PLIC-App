import { RootEnum } from '@app/definitions';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface IAppState {
  root: RootEnum;
}

const initialState: IAppState = {
  root: RootEnum.ROOT_AUTH,
};

export const appStateSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setRoot: (state, action: PayloadAction<RootEnum>) => {
      state.root = action.payload;
    },
  },
});

export const { setRoot } = appStateSlice.actions;

export default appStateSlice.reducer;
