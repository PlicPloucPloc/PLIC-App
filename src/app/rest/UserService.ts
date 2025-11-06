import { Alert } from 'react-native';

import * as SecureStore from 'expo-secure-store';

import { API_PAGE_SIZE } from '@app/config/Constants.ts';
import {
  AuthState,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendEmailRequest,
  RootEnum,
  UserInfoResponse,
} from '@app/definitions';
import { setRoot, setUserInfo } from '@app/redux/slices';
import store from '@app/redux/Store';
import { alertOnResponseError } from '@app/utils/Error.ts';
import { fetchAndCompressImage } from '@app/utils/Image.ts';

import { apiFetch } from './Client';
import Endpoints from './Endpoints';
import { checkProfilePictureExists, postProfilePictureFromSignedUrl } from './S3Service.ts';

async function userInfoToAuthState(userInfo: UserInfoResponse): Promise<AuthState> {
  const authState: AuthState = {
    userId: userInfo.id,
    email: '',
    firstName: userInfo.firstname,
    lastName: userInfo.lastname,
    birthdate: userInfo.birthdate,
    profilePictureUri: null,
  };

  const profilePictureUrl = await checkProfilePictureExists(authState.userId);

  if (profilePictureUrl) {
    authState.profilePictureUri = profilePictureUrl;
  }

  return authState;
}

async function getUserInfo(request: () => Promise<Response>): Promise<AuthState | null> {
  const response = await request();

  if (await alertOnResponseError(response, 'User', 'fetching user info')) {
    return null;
  }

  const userInfo: UserInfoResponse = await response.json();

  return userInfoToAuthState(userInfo);
}

export async function getCurrentUserInfo() {
  return getUserInfo(() => apiFetch(Endpoints.USER.INFO, { method: 'GET' }));
}

export async function getOtherUserInfo(userId: string): Promise<AuthState | null> {
  return getUserInfo(() => apiFetch(Endpoints.USER.OTHER_INFO(userId), { method: 'GET' }));
}

export async function loadCurrentUserInfo(): Promise<void> {
  const userInfo = await getCurrentUserInfo();

  if (!userInfo) {
    return;
  }

  store.dispatch(setUserInfo(userInfo));
}

export async function loginUser(credentials: LoginRequest): Promise<boolean | null> {
  const response = await apiFetch(
    Endpoints.USER.LOGIN,
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    },
    false,
  );

  if (!response.ok) {
    const errorData = await response.json();

    if (errorData.message && errorData.message == 'Email not confirmed') {
      return null; // Signal to navigate to VerifyEmail screen
    }

    Alert.alert('User Error', errorData.message || 'An error occurred during login.');
    return false;
  }

  const userData: LoginResponse = await response.json();
  await SecureStore.setItemAsync('token', userData.session.access_token);
  await SecureStore.setItemAsync('refresh_token', userData.session.refresh_token);
  await loadCurrentUserInfo();

  return true;
}

export async function logoutUser(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync('token'),
    SecureStore.deleteItemAsync('refresh_token'),
  ]);

  store.dispatch(setRoot(RootEnum.ROOT_AUTH));
  store.dispatch(
    setUserInfo({
      userId: '',
      email: '',
      firstName: '',
      lastName: '',
      birthdate: '',
      profilePictureUri: null,
    }),
  );
}

export async function registerUser(userInfo: RegisterRequest): Promise<boolean> {
  // Register user
  const response = await apiFetch(
    Endpoints.USER.REGISTER,
    {
      method: 'POST',
      body: JSON.stringify(userInfo),
    },
    false,
  );

  if (await alertOnResponseError(response, 'User', 'Error registering user')) {
    return false;
  }

  if (!userInfo.profilePictureUri) {
    return true;
  }

  const registerResponse: RegisterResponse = await response.json();

  return postPictureAfterRegister(userInfo.profilePictureUri, registerResponse);
}

async function postPictureAfterRegister(
  imageUri: string,
  { path, token }: RegisterResponse,
): Promise<boolean> {
  const image = await fetchAndCompressImage(imageUri);

  if (!image) {
    return false;
  }

  const ppResponse = await postProfilePictureFromSignedUrl(path, token, image.blob);

  if (await alertOnResponseError(ppResponse, 'User', 'Error registering user')) {
    return false;
  }

  return true;
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

  if (await alertOnResponseError(response, 'User', 'resending verification email')) {
    return false;
  }

  return true;
}

export async function getRecommendedColloc(
  offset: number,
  pageSize: number = API_PAGE_SIZE,
): Promise<AuthState[]> {
  const response = await apiFetch(
    Endpoints.USER.RECOMMENDED_COLLOC(offset, pageSize),
    {
      method: 'GET',
    },
    true,
  );
  console.log(response);
  if (await alertOnResponseError(response, 'User', 'getting recommended colloc')) {
    return [];
  }

  const users: UserInfoResponse[] = await response.json();

  const usersWithProfilePictures: AuthState[] = await Promise.all(
    users.map(async (user) => userInfoToAuthState(user)),
  );

  return usersWithProfilePictures;
}

// TODO: Forgot password
