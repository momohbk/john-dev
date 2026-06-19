import { apiRequest } from './client';
import type { Settings } from '../types';

export function getSettings() {
  return apiRequest<Settings>('/settings');
}

export function updateSettings(data: Partial<Settings>) {
  return apiRequest<Settings>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
