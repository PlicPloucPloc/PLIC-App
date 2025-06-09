import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string; // (YYYY-MM-DD)
}

const initialState: IAuthState = {
  userId: '',
  email: '',
  firstName: '',
  lastName: '',
  birthdate: '',
};

export const authStateSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
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

export const { setEmail, setFirstName, setLastName, setBirthdate, setUserId } =
  authStateSlice.actions;

export default authStateSlice.reducer;
