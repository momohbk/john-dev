import { apiRequest } from './client';
import type { Category } from '../types';

export function getCategories() {
  return apiRequest<Category[]>('/categories');
}
