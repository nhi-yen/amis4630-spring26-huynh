const BASE_URL = 'http://localhost:5000/api/cart';

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
  const response = await fetch(BASE_URL);
  
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