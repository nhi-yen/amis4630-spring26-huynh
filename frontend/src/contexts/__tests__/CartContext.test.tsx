import React from 'react';
import { render, screen, waitFor, renderHook, act } from '@testing-library/react';
import { CartProvider, useCartContext } from '../CartContext';
import * as cartApi from '../../services/cartApi';
import type { CartResponse } from '../../types/cart';

// Mock cartApi module
vi.mock('../../services/cartApi', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
  getCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  clearCart: vi.fn(),
}));

const mockCart: CartResponse = {
  id: 1,
  userId: 'test-user',
  items: [
    {
      id: 1,
      productId: 100,
      productName: 'Widget',
      price: 29.99,
      imageUrl: 'https://example.com/widget.jpg',
      quantity: 2,
      lineTotal: 59.98,
    },
  ],
  totalItems: 2,
  subtotal: 59.98,
  total: 59.98,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockEmptyCart: CartResponse = {
  id: 1,
  userId: 'test-user',
  items: [],
  totalItems: 0,
  subtotal: 0,
  total: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    window.location = { href: '' } as Location;
  });

  describe('CartProvider - Loading cart on mount', () => {
    it('should load cart on mount and dispatch LOAD_CART', async () => {
      vi.mocked(cartApi.getCart).mockResolvedValue(mockCart);

      const TestComponent = () => {
        const { state, loading } = useCartContext();
        return (
          <div>
            {loading && <div>Loading...</div>}
            {state.items.length > 0 && (
              <div>
                <span data-testid="item-count">{state.items.length}</span>
                <span data-testid="first-item-name">{state.items[0].productName}</span>
              </div>
            )}
          </div>
        );
      };

      const { rerender } = render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      expect(screen.queryByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(vi.mocked(cartApi.getCart)).toHaveBeenCalled();
      });

      rerender(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      });
      expect(screen.getByTestId('first-item-name')).toHaveTextContent('Widget');
    });

    it('should handle 401 error and redirect to /login', async () => {
      vi.mocked(cartApi.getCart).mockRejectedValue(
        new cartApi.ApiError('Unauthorized', 401)
      );

      render(
        <CartProvider>
          <div>Test</div>
        </CartProvider>
      );

      await waitFor(() => {
        expect(window.location.href).toBe('/login');
      });
    });

    it('should handle generic error and display error state', async () => {
      vi.mocked(cartApi.getCart).mockRejectedValue(new Error('Network error'));

      const TestComponent = () => {
        const { error } = useCartContext();
        return <div>{error && <span data-testid="error-msg">{error}</span>}</div>;
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error-msg')).toHaveTextContent('Network error');
      });
    });
  });

  describe('useCartContext - addToCart', () => {
    it('should add item to cart and reload cart data', async () => {
      vi.mocked(cartApi.getCart).mockResolvedValue(mockEmptyCart);
      vi.mocked(cartApi.addToCart).mockResolvedValue(undefined);

      const updatedCart: CartResponse = {
        ...mockCart,
        items: [
          {
            id: 1,
            productId: 100,
            productName: 'Widget',
            price: 29.99,
            imageUrl: 'https://example.com/widget.jpg',
            quantity: 1,
            lineTotal: 29.99,
          },
        ],
        totalItems: 1,
        subtotal: 29.99,
        total: 29.99,
      };

      vi.mocked(cartApi.getCart)
        .mockResolvedValueOnce(mockEmptyCart) // initial load
        .mockResolvedValueOnce(updatedCart); // after add

      const TestComponent = () => {
        const { addToCart, state, cartItemCount } = useCartContext();
        return (
          <div>
            <button onClick={() => addToCart(100, 1)}>Add Item</button>
            <span data-testid="item-count">{cartItemCount}</span>
            {state.items.length > 0 && (
              <span data-testid="item-name">{state.items[0].productName}</span>
            )}
          </div>
        );
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(vi.mocked(cartApi.getCart)).toHaveBeenCalledTimes(1);
      });

      const addBtn = screen.getByText('Add Item');
      await act(async () => {
        addBtn.click();
      });

      await waitFor(() => {
        expect(vi.mocked(cartApi.addToCart)).toHaveBeenCalledWith(100, 1);
      });

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      });
    });

    it('should handle 401 error in addToCart and redirect to /login', async () => {
      vi.mocked(cartApi.getCart).mockResolvedValue(mockEmptyCart);
      vi.mocked(cartApi.addToCart).mockRejectedValue(
        new cartApi.ApiError('Unauthorized', 401)
      );

      const TestComponent = () => {
        const { addToCart } = useCartContext();
        return (
          <button onClick={() => addToCart(100, 1)} data-testid="add-btn">
            Add
          </button>
        );
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(vi.mocked(cartApi.getCart)).toHaveBeenCalled();
      });

      const btn = screen.getByTestId('add-btn');
      await act(async () => {
        btn.click();
      });

      await waitFor(() => {
        expect(window.location.href).toBe('/login');
      });
    });
  });

  describe('useCartContext - removeCartItem', () => {
    it('should remove item from cart', async () => {
      vi.mocked(cartApi.getCart)
        .mockResolvedValueOnce(mockCart) // initial
        .mockResolvedValueOnce(mockEmptyCart); // after remove

      vi.mocked(cartApi.removeCartItem).mockResolvedValue(undefined);

      const TestComponent = () => {
        const { removeCartItem, state, cartItemCount } = useCartContext();
        return (
          <div>
            <button onClick={() => removeCartItem(1)}>Remove</button>
            <span data-testid="item-count">{cartItemCount}</span>
          </div>
        );
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });

      const removeBtn = screen.getByText('Remove');
      await act(async () => {
        removeBtn.click();
      });

      await waitFor(() => {
        expect(vi.mocked(cartApi.removeCartItem)).toHaveBeenCalledWith(1);
      });

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      });
    });
  });

  describe('useCartContext - updateCartItem', () => {
    it('should update item quantity', async () => {
      const updatedCart: CartResponse = {
        ...mockCart,
        items: [
          { ...mockCart.items[0], quantity: 5, lineTotal: 149.95 },
        ],
        totalItems: 5,
        subtotal: 149.95,
        total: 149.95,
      };

      vi.mocked(cartApi.getCart)
        .mockResolvedValueOnce(mockCart) // initial
        .mockResolvedValueOnce(updatedCart); // after update

      vi.mocked(cartApi.updateCartItem).mockResolvedValue(undefined);

      const TestComponent = () => {
        const { updateCartItem, cartItemCount } = useCartContext();
        return (
          <div>
            <button onClick={() => updateCartItem(1, 5)}>Update</button>
            <span data-testid="item-count">{cartItemCount}</span>
          </div>
        );
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });

      const updateBtn = screen.getByText('Update');
      await act(async () => {
        updateBtn.click();
      });

      await waitFor(() => {
        expect(vi.mocked(cartApi.updateCartItem)).toHaveBeenCalledWith(1, 5);
      });

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('5');
      });
    });
  });

  describe('useCartContext - clearCart', () => {
    it('should clear all items from cart', async () => {
      vi.mocked(cartApi.getCart)
        .mockResolvedValueOnce(mockCart) // initial
        .mockResolvedValueOnce(mockEmptyCart); // after clear

      vi.mocked(cartApi.clearCart).mockResolvedValue(undefined);

      const TestComponent = () => {
        const { clearCart, cartItemCount } = useCartContext();
        return (
          <div>
            <button onClick={() => clearCart()}>Clear</button>
            <span data-testid="item-count">{cartItemCount}</span>
          </div>
        );
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });

      const clearBtn = screen.getByText('Clear');
      await act(async () => {
        clearBtn.click();
      });

      await waitFor(() => {
        expect(vi.mocked(cartApi.clearCart)).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('0');
      });
    });
  });

  describe('useCartContext - Error handling', () => {
    it('should throw error when used outside CartProvider', () => {
      const TestComponent = () => {
        useCartContext();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useCartContext must be used within CartProvider');

      consoleSpy.mockRestore();
    });

    it('should expose cartItemCount derived from state', async () => {
      vi.mocked(cartApi.getCart).mockResolvedValue(mockCart);

      const TestComponent = () => {
        const { cartItemCount } = useCartContext();
        return <span data-testid="item-count">{cartItemCount}</span>;
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('2');
      });
    });

    it('should expose cartTotal derived from state', async () => {
      vi.mocked(cartApi.getCart).mockResolvedValue(mockCart);

      const TestComponent = () => {
        const { cartTotal } = useCartContext();
        return <span data-testid="total">{cartTotal.toFixed(2)}</span>;
      };

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('total')).toHaveTextContent('59.98');
      });
    });
  });
});
