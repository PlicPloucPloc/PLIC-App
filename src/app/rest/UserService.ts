import { LoginRequest, RegisterRequest } from '@app/definitions/rest/UserService';

import { apiFetch } from './Client';
import Endpoints from './Endpoints';

export async function loginUser(credentials: LoginRequest): Promise<Response> {
  return apiFetch(
    Endpoints.USER.LOGIN,
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    },
    false,
  );
}

export async function registerUser(userInfo: RegisterRequest): Promise<Response> {
  return apiFetch(
    Endpoints.USER.REGISTER,
    {
      method: 'POST',
      body: JSON.stringify(userInfo),
    },
    false,
  );
}

export async function checkEmailExists(email: string): Promise<Response> {
  return apiFetch(
    Endpoints.USER.CHECK_EMAIL(email),
    {
      method: 'GET',
    },
    false,
  );
}

// TODO: Resend email
// TODO: Forgot password

export async function getUserId(): Promise<Response> {
  return apiFetch(
    Endpoints.USER.GET_ID,
    {
      method: 'GET',
    },
    true,
  );
}
