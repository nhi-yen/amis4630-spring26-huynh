import { describe, it, expect } from "vitest";
import { cartReducer, initialCartState } from "../cartReducer";
import type { CartState, CartAction } from "../../types/cart";

describe("cartReducer", () => {
  it("ADD_TO_CART adds a new item when product is not in cart", () => {
    const action: CartAction = {
      type: "ADD_TO_CART",
      payload: {
        id: 101,
        name: "MacBook Air",
        price: 899.99,
        imageUrl: "https://example.com/macbook.jpg",
      },
    };

    const next = cartReducer(initialCartState, action);

    expect(next.items).toHaveLength(1);
    expect(next.items[0]).toEqual({
      id: 101,
      productId: 101,
      productName: "MacBook Air",
      price: 899.99,
      quantity: 1,
      imageUrl: "https://example.com/macbook.jpg",
    });
    expect(next.isOpen).toBe(initialCartState.isOpen);
  });

  it("ADD_TO_CART increments quantity when item already exists", () => {
    const state: CartState = {
      isOpen: false,
      items: [
        {
          id: 1,
          productId: 101,
          productName: "MacBook Air",
          price: 899.99,
          quantity: 2,
          imageUrl: "https://example.com/macbook.jpg",
        },
      ],
    };

    const action: CartAction = {
      type: "ADD_TO_CART",
      payload: {
        id: 101,
        name: "MacBook Air",
        price: 899.99,
        imageUrl: "https://example.com/macbook.jpg",
      },
    };

    const next = cartReducer(state, action);

    expect(next.items).toHaveLength(1);
    expect(next.items[0].quantity).toBe(3);
    expect(next.items[0].productId).toBe(101);
  });

  it("UPDATE_QUANTITY updates quantity and removes item when quantity < 1", () => {
    const state: CartState = {
      isOpen: false,
      items: [
        {
          id: 1,
          productId: 101,
          productName: "MacBook Air",
          price: 899.99,
          quantity: 2,
        },
      ],
    };

    const updateAction: CartAction = {
      type: "UPDATE_QUANTITY",
      payload: { productId: 101, quantity: 5 },
    };

    const updated = cartReducer(state, updateAction);

    expect(updated.items).toHaveLength(1);
    expect(updated.items[0].quantity).toBe(5);

    const removeByQuantityAction: CartAction = {
      type: "UPDATE_QUANTITY",
      payload: { productId: 101, quantity: 0 },
    };

    const removed = cartReducer(updated, removeByQuantityAction);

    expect(removed.items).toHaveLength(0);
  });

  it("REMOVE_FROM_CART removes only the targeted product", () => {
    const state: CartState = {
      isOpen: false,
      items: [
        {
          id: 1,
          productId: 101,
          productName: "MacBook Air",
          price: 899.99,
          quantity: 1,
        },
        {
          id: 2,
          productId: 202,
          productName: "Desk Chair",
          price: 129.99,
          quantity: 2,
        },
      ],
    };

    const action: CartAction = {
      type: "REMOVE_FROM_CART",
      payload: { productId: 101 },
    };

    const next = cartReducer(state, action);

    expect(next.items).toHaveLength(1);
    expect(next.items[0].productId).toBe(202);
    expect(next.items[0].productName).toBe("Desk Chair");
  });
});
