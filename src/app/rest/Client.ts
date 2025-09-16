import { Alert } from 'react-native';

import 'react-native-get-random-values';

import { API_TIMEOUT } from '@app/config/Constants';
import { RootEnum, TokenResponse } from '@app/definitions';
import { setRoot } from '@app/redux/slices';
import store from '@app/redux/Store';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

import Endpoints from './Endpoints';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4242';
const TIMEOUT = API_TIMEOUT;

/**
 * Fetches data from the API with optional authentication.
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  withAuth: boolean = true,
  prefix: string = API_URL,
): Promise<Response> {
  const requestId = uuidv4();
  console.log(
    `Request ID: ${requestId} ${withAuth ? '(authed)' : ''} | ${options.method || 'GET'} ${endpoint} | Body:`,
    options.body,
  );

  const headers = await prepareHeaders(options, withAuth);
  if (!headers) {
    return await userNeedsLogin(requestId);
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(`${prefix}${endpoint}`, { ...options, headers });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`Request ID: ${requestId} | Request timed out after ${TIMEOUT}ms`);
      return new Response(JSON.stringify({ message: `Request timed out after ${TIMEOUT}ms` }), {
        status: 408,
        statusText: 'Request Timeout',
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error(`Request ID: ${requestId} | Fetch failed:`, error);
    throw error;
  }

  if (!response.ok) {
    return await handleErrorResponse(response, endpoint, options, withAuth, requestId);
  }

  console.log(`Request ID: ${requestId} | Success`);
  return response.clone();
}

async function prepareHeaders(
  options: RequestInit,
  withAuth: boolean,
): Promise<HeadersInit | null> {
  const headers: HeadersInit = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('X-Request-ID', uuidv4());

  for (const [key, value] of Object.entries(options.headers || {})) {
    headers.set(key, value as string);
  }

  if (withAuth) {
    const token = await getToken();
    if (!token) return null;
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

export async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(id);
  }
}

async function handleErrorResponse(
  response: Response,
  endpoint: string,
  options: RequestInit,
  withAuth: boolean,
  requestId: string,
): Promise<Response> {
  const clone = response.clone();

  const data = await clone.text();

  if (data.includes('token is expired')) {
    console.log('--- Token expired, begin rotation ---');
    await SecureStore.deleteItemAsync('token');
    if (!(await getToken())) {
      return await userNeedsLogin(requestId);
    }
    console.log('--- End rotation ---');

    return await apiFetch(endpoint, options, withAuth);
  }

  if (clone.status === 403 || clone.status === 401) {
    return await userNeedsLogin(requestId);
  }

  console.error(`Request ID: ${requestId} | Failed with status: ${clone.status}, error: ${data}`);

  return response;
}

/**
 * Retrieves the token from secure storage, or rotates tokens if necessary.
 * Returns the token or null if not available.
 */
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
    Endpoints.USER.REFRESH,
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

async function userNeedsLogin(requestId: string): Promise<Response> {
  Alert.alert('Session expired', 'Please login and retry', [
    {
      text: 'OK',
      onPress: () => {
        store.dispatch(setRoot(RootEnum.ROOT_AUTH));
      },
    },
  ]);

  console.error(`Request ID: ${requestId} | Token rotation failed, user needs to login`);

  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('refresh_token');

  return new Response(null, {
    status: 401,
    statusText: 'Unauthorized',
  });
}
