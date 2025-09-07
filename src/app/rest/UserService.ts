import {
  LoginRequest,
  RegisterRequest,
  ResendEmailRequest,
} from '@app/definitions/rest/UserService';

import { alertOnError, apiFetch } from './Client';
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

export async function resendVerificationEmail(body: ResendEmailRequest): Promise<boolean> {
  const response = await apiFetch(
    Endpoints.USER.RESEND_EMAIL(),
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    false,
  );

  if (await alertOnError(response, 'User', 'resending verification email')) {
    return false;
  }

  return true;
}

// TODO: Forgot password
