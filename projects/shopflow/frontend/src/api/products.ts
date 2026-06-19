import { apiRequest } from './client';
import type { Product } from '../types';

export function getProducts(slug?: string) {
  const params = slug ? `?slug=${encodeURIComponent(slug)}` : '';
  return apiRequest<Product[]>(`/products${params}`);
}

export function getProduct(id: number) {
  return apiRequest<Product>(`/products/${id}`);
}

export function getAdminProducts() {
  return apiRequest<Product[]>('/products/admin');
}

export function createProduct(data: Partial<Product>) {
  return apiRequest<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: number, data: Partial<Product>) {
  return apiRequest<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: number) {
  return apiRequest<void>(`/products/${id}`, { method: 'DELETE' });
}
