import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootEnum } from '../definitions';

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
    changeRoot: (state, action: PayloadAction<IAppState>) => {
      state.root = action.payload.root;
    },
  },
});

export const { changeRoot } = appStateSlice.actions;

export default appStateSlice.reducer;
