export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderResponse {
  orderId: number;
  createdDate?: string;
  orderDate?: string;
  status: string;
  total: number;
  confirmationNumber: string;
  items: OrderItem[];
}
