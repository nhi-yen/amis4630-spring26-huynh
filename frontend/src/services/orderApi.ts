import { isAxiosError } from 'axios';
import api from './api';
import type { OrderResponse } from '../types/order';

function getProblemMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    return error.response?.data?.detail ?? error.response?.data?.title ?? fallback;
  }
  return fallback;
}

export async function placeOrder(shippingAddress: string): Promise<OrderResponse> {
  try {
    const response = await api.post<OrderResponse>('/orders', { shippingAddress });
    return response.data;
  } catch (error) {
    throw new Error(getProblemMessage(error, 'Failed to place order.'));
  }
}

export async function getMyOrders(): Promise<OrderResponse[]> {
  try {
    const response = await api.get<OrderResponse[]>('/orders/mine');
    return response.data;
  } catch (error) {
    throw new Error(getProblemMessage(error, 'Failed to load order history.'));
  }
}
