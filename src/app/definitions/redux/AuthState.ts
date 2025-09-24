export type AuthState = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string; // (YYYY-MM-DD)
  profilePictureUri: string | null;
};
