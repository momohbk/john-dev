import { apiRequest } from './client';
import type { Review } from '../types';

export function getProductReviews(productId: number) {
  return apiRequest<Review[]>(`/reviews/product/${productId}`);
}

export function getPendingReviews() {
  return apiRequest<Review[]>('/reviews/pending');
}

export function getAllReviews() {
  return apiRequest<Review[]>('/reviews/all');
}

export function createReview(data: { product_id: number; customer_name: string; customer_phone?: string; rating: number; text: string }) {
  return apiRequest<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function approveReview(id: number) {
  return apiRequest<{ message: string }>(`/reviews/${id}/approve`, { method: 'PUT' });
}

export function deleteReview(id: number) {
  return apiRequest<{ message: string }>(`/reviews/${id}`, { method: 'DELETE' });
}
