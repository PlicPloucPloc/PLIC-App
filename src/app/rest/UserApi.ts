import { apiFetch } from './Client';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  password: string;
}

export async function loginUser(credentials: LoginRequest): Promise<Response> {
  return apiFetch(
    '/user/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    },
    false,
  );
}

export async function registerUser(userInfo: RegisterRequest): Promise<Response> {
  return apiFetch(
    '/user/register',
    {
      method: 'POST',
      body: JSON.stringify(userInfo),
    },
    false,
  );
}

export async function checkEmailExists(email: string): Promise<Response> {
  return apiFetch(
    `/user/checkEmail/${email.toLowerCase()}`,
    {
      method: 'GET',
    },
    false,
  );
}

// TODO: Resend email
// TODO: Forgot password
