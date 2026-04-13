import { isAxiosError } from "axios";
import api from "./api";

export interface AdminProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  sellerName: string;
  postedDate: string;
  imageUrl: string;
  condition: string;
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  price: string;
  category: string;
  sellerName: string;
  imageUrl: string;
  condition: string;
}

export type ProductUpdateRequest = ProductCreateRequest;

export interface AdminOrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface AdminOrder {
  id: number;
  confirmationNumber: string;
  total: number;
  createdDate: string;
  status: string;
  items: AdminOrderItem[];
}

export interface OrderStatusUpdateRequest {
  status: string;
}

function normalizeApiError(error: unknown, fallback: string): Error {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail as string | undefined;
    const title = error.response?.data?.title as string | undefined;

    if (status === 403) return new Error("Forbidden: admin access required.");
    if (status === 401) return new Error("Unauthorized: please log in.");

    return new Error(detail || title || fallback);
  }
  return new Error(fallback);
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  try {
    const response = await api.get<AdminProduct[]>("/admin/products");
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to load products.");
  }
}

export async function createAdminProduct(request: ProductCreateRequest): Promise<AdminProduct> {
  try {
    const response = await api.post<AdminProduct>("/admin/products", request);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to create product.");
  }
}

export async function updateAdminProduct(id: number, request: ProductUpdateRequest): Promise<AdminProduct> {
  try {
    const response = await api.put<AdminProduct>(`/admin/products/${id}`, request);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to update product.");
  }
}

export async function deleteAdminProduct(id: number): Promise<void> {
  try {
    await api.delete(`/admin/products/${id}`);
  } catch (error) {
    throw normalizeApiError(error, "Failed to delete product.");
  }
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const response = await api.get<AdminOrder[]>("/admin/orders");
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to load orders.");
  }
}

export async function updateAdminOrderStatus(orderId: number, request: OrderStatusUpdateRequest): Promise<AdminOrder> {
  try {
    const response = await api.put<AdminOrder>(`/admin/orders/${orderId}/status`, request);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to update order status.");
  }
}
