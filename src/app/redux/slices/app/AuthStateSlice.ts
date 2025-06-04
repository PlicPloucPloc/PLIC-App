import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string; // (YYYY-MM-DD)
}

const initialState: IAuthState = {
  email: '',
  firstName: '',
  lastName: '',
  birthdate: '',
};

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
    setBirthdate: (state, action: PayloadAction<string>) => {
      state.birthdate = action.payload;
    },
  },
});

export const { setEmail, setFirstName, setLastName, setBirthdate } = authStateSlice.actions;

export default authStateSlice.reducer;
