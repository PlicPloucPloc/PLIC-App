import { Alert } from 'react-native';

import 'react-native-get-random-values';

import { RootEnum, TokenResponse } from '@app/definitions';
import { setRoot } from '@app/redux/slices';
import store from '@app/redux/Store';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

// 3001 = User API
// 3002 = Apartment API
const PORT = 3001;
// const HOST = '10.68.251.33;
const HOST = '192.168.1.57';
const API_URL = `http://${HOST}:${PORT}`;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  withAuth: boolean = true,
): Promise<Response> {
  const requestId = uuidv4(); // <-- Unique ID for this request
  console.log(
    `Request ID: ${requestId} | ${options.method || 'GET'} ${endpoint} | Body:`,
    options.body,
  );

  const headers: HeadersInit = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('X-Request-ID', requestId);

  for (const [key, value] of Object.entries(options.headers || {})) {
    headers.set(key, value as string);
  }

  if (withAuth) {
    const token = await getToken();

    if (!token) {
      return userNeedsLogin(requestId);
    }

    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const res = response.clone();

  if (!response.ok) {
    const data = await response.text();

    if (data.includes('token is expired')) {
      console.log('--- Token expired, begin rotation ---');
      await SecureStore.deleteItemAsync('token');
      if (!(await getToken())) {
        return userNeedsLogin(requestId);
      }
      console.log('--- End rotation ---');

      return await apiFetch(endpoint, options, withAuth);
    }

    console.error(
      `Request ID: ${requestId} | Failed with status: ${response.status}, error: ${data}`,
    );
  } else {
    console.log(`Request ID: ${requestId} | Success`);
  }

  return res;
}

export async function getToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    return token;
  }

  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  if (refreshToken) {
    return await rotateTokens(refreshToken);
  }

  return null;
}

async function rotateTokens(refreshToken: string): Promise<string | null> {
  const response = await apiFetch(
    '/user/refresh',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
    false,
  );

  if (!response.ok) {
    return null;
  }

  const data: TokenResponse = await response.json();
  await SecureStore.setItemAsync('token', data.access_token);
  await SecureStore.setItemAsync('refresh_token', data.refresh_token);
  return data.access_token;
}

function userNeedsLogin(requestId: string): Response {
  Alert.alert('Session expired', 'Please login and retry', [
    {
      text: 'OK',
      onPress: () => {
        store.dispatch(setRoot(RootEnum.ROOT_AUTH));
      },
    },
  ]);

  console.error(`Request ID: ${requestId} | Token rotation failed, user needs to login`);

  return new Response(null, {
    status: 401,
    statusText: 'Unauthorized',
  });
}
