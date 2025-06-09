export type TokenResponse = {
  access_token: string;
  refresh_token: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  session: TokenResponse & {
    user: {
      id: string;
      email: string;
    };
  };
};

export type RegisterRequest = {
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  password: string;
};
