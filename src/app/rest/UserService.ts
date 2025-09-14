import { Alert } from 'react-native';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendEmailRequest,
  RootEnum,
  UserInfoResponse,
} from '@app/definitions';
import { IAuthState, setRoot, setUserInfo } from '@app/redux/slices';
import store from '@app/redux/Store';
import * as ImageManipulator from 'expo-image-manipulator';
import * as SecureStore from 'expo-secure-store';

import { alertOnError, apiFetch } from './Client';
import Endpoints from './Endpoints';
import { checkProfilePictureExists, postProfilePicture } from './S3Service.ts';

export async function getUserInfo(): Promise<UserInfoResponse | null> {
  const userInfo = await apiFetch(Endpoints.USER.INFO, { method: 'GET' });

  if (await alertOnError(userInfo, 'User', 'fetching user info')) {
    return null;
  }

  return (await userInfo.json()) as UserInfoResponse;
}

export async function loadUserInfo(): Promise<void> {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    return;
  }

  const authState: IAuthState = {
    userId: userInfo.id,
    email: '',
    firstName: userInfo.firstname,
    lastName: userInfo.lastname,
    birthdate: userInfo.birthdate,
    profilePicture: null,
  };

  const profilePictureUrl = await checkProfilePictureExists(userInfo.id);
  if (profilePictureUrl) {
    authState.profilePicture = profilePictureUrl;
  }

  store.dispatch(setUserInfo(authState));
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
  await loadUserInfo();

  return true;
}

export async function logoutUser(): Promise<void> {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('refresh_token');

  store.dispatch(setRoot(RootEnum.ROOT_AUTH));
  store.dispatch(
    setUserInfo({
      userId: '',
      email: '',
      firstName: '',
      lastName: '',
      birthdate: '',
      profilePicture: null,
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

  if (await alertOnError(response, 'User', 'Error registering user')) {
    return false;
  }

  if (!userInfo.profilePicture) {
    return true;
  }

  const registerResponse: RegisterResponse = await response.json();

  return postPictureAfterRegister(userInfo.profilePicture, registerResponse);
}

async function postPictureAfterRegister(
  imageUri: string,
  { path, token }: RegisterResponse,
): Promise<boolean> {
  // Convert image to PNG
  const manipResult = await ImageManipulator.manipulateAsync(imageUri, [], {
    compress: 1,
    format: ImageManipulator.SaveFormat.PNG,
  });

  imageUri = manipResult.uri;

  // fetch profile picture from local uri
  console.log('retrieveing profile picture from local uri');
  const imageResponse = await fetch(imageUri);

  if (await alertOnError(imageResponse, 'User', 'Error fetching profile picture')) {
    return false;
  }

  console.log('converting profile picture to blob');
  const imageBlob = await imageResponse.blob();
  if (!imageBlob) {
    console.error('Error converting profile picture to blob');
    return false;
  }

  console.log('uploading profile picture to bucket', path, token);
  // Upload profile picture to bucket
  const ppResponse = await postProfilePicture(path, token, imageBlob);

  if (await alertOnError(ppResponse, 'User', 'Error registering user')) {
    return false;
  }

  console.log('profile picture uploaded successfully');
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

  if (await alertOnError(response, 'User', 'resending verification email')) {
    return false;
  }

  return true;
}

// TODO: Forgot password
