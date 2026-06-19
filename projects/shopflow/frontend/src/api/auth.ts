import { apiRequest } from './client';
import type { User } from '../types';

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
