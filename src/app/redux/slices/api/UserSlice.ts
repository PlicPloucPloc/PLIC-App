import customBaseQuery from '@app/rest/Client';
import Endpoints from '@app/rest/Endpoints';
import { createApi } from '@reduxjs/toolkit/query/react';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: { id: number; email: string; name: string };
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: Endpoints.USER.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<any, Record<string, any>>({
      query: (userInfo) => ({
        url: Endpoints.USER.REGISTER,
        method: 'POST',
        body: userInfo,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = userApi;
