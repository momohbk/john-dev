import { apiRequest } from './client';
import type { Order } from '../types';

export function trackOrder(order_id: number, phone: string) {
  return apiRequest<Order>('/tracking', {
    method: 'POST',
    body: JSON.stringify({ order_id, phone }),
  });
}
