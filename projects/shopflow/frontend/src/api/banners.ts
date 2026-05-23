import { apiRequest } from './client';
import type { Banner } from '../types';

export function getBanners() {
  return apiRequest<Banner[]>('/banners');
}

export function getAllBanners() {
  return apiRequest<Banner[]>('/banners/all');
}

export function createBanner(data: Partial<Banner>) {
  return apiRequest<Banner>('/banners', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBanner(id: number, data: Partial<Banner>) {
  return apiRequest<Banner>(`/banners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBanner(id: number) {
  return apiRequest<{ message: string }>(`/banners/${id}`, { method: 'DELETE' });
}
