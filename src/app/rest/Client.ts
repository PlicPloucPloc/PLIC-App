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
// const HOST = '192.168.1.57';
const HOST = '10.0.0.2';
const API_URL = `http://${HOST}:${PORT}`;
const TIMEOUT = 5000;

/**
 * Fetches data from the API with optional authentication.
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  withAuth: boolean = true,
): Promise<Response> {
  const requestId = uuidv4();
  console.log(
    `Request ID: ${requestId} | ${options.method || 'GET'} ${endpoint} | Body:`,
    options.body,
  );

  const headers = await prepareHeaders(options, withAuth);
  if (!headers) {
    return userNeedsLogin(requestId);
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(`${API_URL}${endpoint}`, { ...options, headers }, TIMEOUT);
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

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
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

  return response.clone();
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
