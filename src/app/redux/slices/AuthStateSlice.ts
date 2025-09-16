import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string; // (YYYY-MM-DD)
  profilePictureUri: string | null;
}

const initialState: IAuthState = {
  userId: '',
  email: '',
  firstName: '',
  lastName: '',
  birthdate: '',
  profilePictureUri: '',
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
    setProfilePictureUri: (state, action: PayloadAction<string | null>) => {
      const newUri = action.payload ? action.payload + '?t=' + new Date().getTime() : null; // Cache busting
      state.profilePictureUri = newUri;
    },
    setUserInfo: (_, action: PayloadAction<IAuthState>) => {
      if (action.payload.profilePictureUri) {
        action.payload.profilePictureUri =
          action.payload.profilePictureUri + '?t=' + new Date().getTime(); // Cache busting
      }
      return action.payload;
    },
  },
});

export const {
  setEmail,
  setFirstName,
  setLastName,
  setBirthdate,
  setUserId,
  setProfilePictureUri,
  setUserInfo,
} = authStateSlice.actions;

export default authStateSlice.reducer;
