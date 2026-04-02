import React, { createContext, useContext, useReducer, useMemo, useEffect, useState } from "react";
import type { CartState, CartAction } from "../types/cart";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../services/cartApi";

type CartContextType = {
  state: CartState;
  cartItemCount: number;
  cartTotal: number;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeCartItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const cart = await getCart();
        dispatch({ type: "LOAD_CART", payload: { items: cart.items } });
      } catch (error) {
        setError("Failed to load cart");
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const cartItemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const cartTotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const handleAddToCart = async (productId: number, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      await addToCart(productId, quantity);
      const cart = await getCart();
      dispatch({ type: "LOAD_CART", payload: { items: cart.items } });
    } catch (error) {
      setError("Failed to add to cart");
      console.error("Failed to add to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCartItem = async (cartItemId: number, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      await updateCartItem(cartItemId, quantity);
      const cart = await getCart();
      dispatch({ type: "LOAD_CART", payload: { items: cart.items } });
    } catch (error) {
      setError("Failed to update cart item");
      console.error("Failed to update cart item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCartItem = async (cartItemId: number) => {
    setLoading(true);
    setError(null);
    try {
      await removeCartItem(cartItemId);
      const cart = await getCart();
      dispatch({ type: "LOAD_CART", payload: { items: cart.items } });
    } catch (error) {
      setError("Failed to remove cart item");
      console.error("Failed to remove cart item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await clearCart();
      const cart = await getCart();
      dispatch({ type: "LOAD_CART", payload: { items: cart.items } });
    } catch (error) {
      setError("Failed to clear cart");
      console.error("Failed to clear cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      state,
      cartItemCount,
      cartTotal,
      loading,
      error,
      addToCart: handleAddToCart,
      updateCartItem: handleUpdateCartItem,
      removeCartItem: handleRemoveCartItem,
      clearCart: handleClearCart,
    }),
    [state, cartItemCount, cartTotal, loading, error]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return ctx;
};