import {
  LoginRequest,
  RegisterRequest,
  ResendEmailRequest,
  RootEnum,
  UserInfoResponse,
} from '@app/definitions';
import { setRoot } from '@app/redux/slices';
import store from '@app/redux/Store';
import * as SecureStore from 'expo-secure-store';

import { alertOnError, apiFetch } from './Client';
import Endpoints from './Endpoints';

export async function getUserInfo(): Promise<UserInfoResponse> {
  const userInfo = await apiFetch(Endpoints.USER.INFO, { method: 'GET' });

  if (await alertOnError(userInfo, 'User', 'fetching user info')) {
    throw new Error('Error fetching user info');
  }

  return (await userInfo.json()) as UserInfoResponse;
}

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

export function logoutUser(): void {
  SecureStore.deleteItemAsync('token');
  SecureStore.deleteItemAsync('refresh_token');

  store.dispatch(setRoot(RootEnum.ROOT_AUTH));
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
