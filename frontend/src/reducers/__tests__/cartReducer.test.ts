import { cartReducer, initialCartState } from '../cartReducer';
import type { CartState, CartAction } from '../../types/cart';

describe('cartReducer', () => {
  describe('LOAD_CART', () => {
    it('should load cart items from API response', () => {
      const state = initialCartState;
      const action: CartAction = {
        type: 'LOAD_CART',
        payload: {
          items: [
            {
              id: 1,
              productId: 100,
              productName: 'Widget',
              price: 29.99,
              imageUrl: 'https://example.com/widget.jpg',
              quantity: 2,
            },
          ],
        },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(1);
      expect(next.items[0].productName).toBe('Widget');
      expect(next.items[0].quantity).toBe(2);
      expect(next.items[0].price).toBe(29.99);
    });

    it('should handle empty cart', () => {
      const state = initialCartState;
      const action: CartAction = {
        type: 'LOAD_CART',
        payload: {
          items: [],
        },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(0);
    });

    it('should preserve isOpen state when loading', () => {
      const state: CartState = {
        items: [],
        isOpen: true,
      };
      const action: CartAction = {
        type: 'LOAD_CART',
        payload: {
          items: [
            {
              id: 1,
              productId: 100,
              productName: 'Widget',
              price: 29.99,
              quantity: 1,
            },
          ],
        },
      };

      const next = cartReducer(state, action);

      expect(next.isOpen).toBe(true);
      expect(next.items).toHaveLength(1);
    });
  });

  describe('ADD_TO_CART', () => {
    it('should add new item to empty cart', () => {
      const state = initialCartState;
      const action: CartAction = {
        type: 'ADD_TO_CART',
        payload: {
          id: 100,
          name: 'Widget',
          price: 29.99,
          imageUrl: 'https://example.com/widget.jpg',
        },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(1);
      expect(next.items[0].productName).toBe('Widget');
      expect(next.items[0].quantity).toBe(1);
      expect(next.items[0].price).toBe(29.99);
    });

    it('should increment quantity when adding duplicate product', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            imageUrl: 'https://example.com/widget.jpg',
            quantity: 2,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'ADD_TO_CART',
        payload: {
          id: 100,
          name: 'Widget',
          price: 29.99,
          imageUrl: 'https://example.com/widget.jpg',
        },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(1);
      expect(next.items[0].quantity).toBe(3);
    });

    it('should add different product to cart with existing item', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 1,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'ADD_TO_CART',
        payload: {
          id: 200,
          name: 'Gadget',
          price: 19.99,
          imageUrl: 'https://example.com/gadget.jpg',
        },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(2);
      expect(next.items[1].productName).toBe('Gadget');
      expect(next.items[1].quantity).toBe(1);
    });
  });

  describe('REMOVE_FROM_CART', () => {
    it('should remove item from cart by productId', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 2,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'REMOVE_FROM_CART',
        payload: { productId: 100 },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(0);
    });

    it('should remove only specified item when multiple exist', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 1,
          },
          {
            id: 2,
            productId: 200,
            productName: 'Gadget',
            price: 19.99,
            quantity: 2,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'REMOVE_FROM_CART',
        payload: { productId: 100 },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(1);
      expect(next.items[0].productName).toBe('Gadget');
    });

    it('should handle removing non-existent item (no-op)', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 1,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'REMOVE_FROM_CART',
        payload: { productId: 999 },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(1);
    });
  });

  describe('UPDATE_QUANTITY', () => {
    it('should update item quantity', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 2,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 100, quantity: 5 },
      };

      const next = cartReducer(state, action);

      expect(next.items[0].quantity).toBe(5);
    });

    it('should update quantity for specific item in multi-item cart', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 1,
          },
          {
            id: 2,
            productId: 200,
            productName: 'Gadget',
            price: 19.99,
            quantity: 2,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 200, quantity: 4 },
      };

      const next = cartReducer(state, action);

      expect(next.items[0].quantity).toBe(1); // unchanged
      expect(next.items[1].quantity).toBe(4);
    });

    it('should handle quantity update to minimum (1)', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 10,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 100, quantity: 1 },
      };

      const next = cartReducer(state, action);

      expect(next.items[0].quantity).toBe(1);
    });

    it('should remove item when quantity is set to 0', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 5,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 100, quantity: 0 },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(0);
    });

    it('should remove item when quantity is set to negative', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 5,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 100, quantity: -1 },
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(0);
    });
  });

  describe('CLEAR_CART', () => {
    it('should clear all items from cart', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 2,
          },
          {
            id: 2,
            productId: 200,
            productName: 'Gadget',
            price: 19.99,
            quantity: 1,
          },
        ],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'CLEAR_CART',
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(0);
      expect(next.isOpen).toBe(false); // isOpen should remain unchanged
    });

    it('should handle clearing already empty cart', () => {
      const state = initialCartState;
      const action: CartAction = {
        type: 'CLEAR_CART',
      };

      const next = cartReducer(state, action);

      expect(next.items).toHaveLength(0);
    });
  });

  describe('TOGGLE_CART', () => {
    it('should toggle cart visibility from false to true', () => {
      const state: CartState = {
        items: [],
        isOpen: false,
      };

      const action: CartAction = {
        type: 'TOGGLE_CART',
      };

      const next = cartReducer(state, action);

      expect(next.isOpen).toBe(true);
      expect(next.items).toEqual(state.items); // items unchanged
    });

    it('should toggle cart visibility from true to false', () => {
      const state: CartState = {
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            quantity: 1,
          },
        ],
        isOpen: true,
      };

      const action: CartAction = {
        type: 'TOGGLE_CART',
      };

      const next = cartReducer(state, action);

      expect(next.isOpen).toBe(false);
      expect(next.items).toEqual(state.items); // items unchanged
    });
  });
});

