const BASE_URL = 'http://localhost:5000/api/cart';

export async function getCart() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to get cart: ${response.statusText}`);
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
  if (!response.ok) {
    throw new Error(`Failed to add to cart: ${response.statusText}`);
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
  if (!response.ok) {
    throw new Error(`Failed to update cart item: ${response.statusText}`);
  }
  return response.json();
}

export async function removeCartItem(cartItemId: number) {
  const response = await fetch(`${BASE_URL}/${cartItemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to remove cart item: ${response.statusText}`);
  }
}

export async function clearCart() {
  const response = await fetch(`${BASE_URL}/clear`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to clear cart: ${response.statusText}`);
  }
}