import { apiRequest } from './client';
import type { Order } from '../types';

export function getMyOrders() {
  return apiRequest<Order[]>('/orders');
}

export function getAdminOrders(status?: string) {
  const params = status ? `?status=${status}` : '';
  return apiRequest<Order[]>(`/orders/admin${params}`);
}

export function createOrder(data: {
  items: { product_id: number; quantity: number }[];
  shipping_address: string;
  customer_name?: string;
  customer_phone?: string;
  delivery_option?: string;
  payment_method?: string;
}) {
  return apiRequest<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateOrderStatus(id: number, status: string) {
  return apiRequest<Order>(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
