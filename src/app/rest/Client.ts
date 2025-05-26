const BASE_URL = 'https://localhost:3000';

async function apiClient(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  headers: Record<string, string> = {},
  authToken?: string,
) {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data;
}

export default apiClient;
