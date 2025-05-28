import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  email?: string;
  firstName?: string;
  lastName?: string;
  birth?: string; // (YYYY-MM-DD)
}

const initialState: IAuthState = {};

export const authStateSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setBirth: (state, action: PayloadAction<string>) => {
      state.birth = action.payload;
    },
  },
});

export const { setEmail, setFirstName, setLastName, setBirth } = authStateSlice.actions;

export default authStateSlice.reducer;
