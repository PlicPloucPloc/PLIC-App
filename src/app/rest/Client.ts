// @app/rest/apiFetch.ts

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
  console.log(`Making ${options.method} request to '${endpoint}' with body:`, options.body);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (withAuth) {
    // const token = localStorage.getItem('authToken'); // Or from a cookie or other source
    // if (token) {
    //   headers['Authorization'] = `Bearer ${token}`;
    // }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const res = response.clone();

  if (!response.ok) {
    const data = await response.text();
    console.error('Response failed with status code:', response.status, 'and error: ', data);
  }

  return res;
}
