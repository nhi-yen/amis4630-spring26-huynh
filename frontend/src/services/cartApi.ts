
import { TOKEN_KEY } from './api';

const BASE_URL = 'http://localhost:5000/api/cart';

/**
 * Returns the Authorization header if a JWT token is stored, or an empty object.
 * All cart API calls include this header so the backend's [Authorize] policy is satisfied.
 */

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Custom error class for API responses with HTTP status codes.
 * Used to distinguish auth failures (401/403) from other errors.
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getCart() {
  // If no token is stored the cart endpoint will return 401.
  // Return an empty cart immediately so CartProvider can mount without redirecting
  // unauthenticated users away from public pages (e.g. product list).
  if (!localStorage.getItem(TOKEN_KEY)) {
    return { items: [], totalItems: 0, subtotal: 0, total: 0 };
  }

  const response = await fetch(BASE_URL, {
    headers: { ...getAuthHeaders() },
  });

  if (response.status === 401) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }
  if (response.status === 403) {
    throw new ApiError(403, 'Access denied.');
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to get cart: ${response.statusText}`);
  }
  return response.json();
}

export async function addToCart(productId: number, quantity: number) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ productId, quantity }),
  });
  
  if (response.status === 401) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }
  if (response.status === 403) {
    throw new ApiError(403, 'Access denied.');
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to add to cart: ${response.statusText}`);
  }
  return response.json();
}

export async function updateCartItem(cartItemId: number, quantity: number) {
  const response = await fetch(`${BASE_URL}/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ quantity }),
  });
  
  if (response.status === 401) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }
  if (response.status === 403) {
    throw new ApiError(403, 'Access denied.');
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to update cart item: ${response.statusText}`);
  }
  return response.json();
}

export async function removeCartItem(cartItemId: number) {
  const response = await fetch(`${BASE_URL}/${cartItemId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  
  if (response.status === 401) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }
  if (response.status === 403) {
    throw new ApiError(403, 'Access denied.');
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to remove cart item: ${response.statusText}`);
  }
}

export async function clearCart() {
  const response = await fetch(`${BASE_URL}/clear`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  
  if (response.status === 401) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }
  if (response.status === 403) {
    throw new ApiError(403, 'Access denied.');
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to clear cart: ${response.statusText}`);
  }
}