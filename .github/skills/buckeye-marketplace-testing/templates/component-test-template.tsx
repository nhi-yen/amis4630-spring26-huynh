import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CartPage } from '$src/components/CartPage/CartPage';
import { useCartContext } from '$src/contexts/CartContext';

/**
 * Component tests for CartPage using Vitest + React Testing Library.
 * Pattern: Arrange-Act-Assert (AAA)
 * 
 * CRITICAL: 
 * - Always use role-based queries (getByRole, getByLabelText)
 * - Never test implementation details (e.g., useState calls)
 * - Mock API calls (useCartContext)
 * - Test user behavior, not component internals
 */

// Mock the CartContext
vi.mock('$src/contexts/CartContext', () => ({
  useCartContext: vi.fn(),
}));

describe('CartPage', () => {
  const mockUpdateCartItem = vi.fn();
  const mockRemoveCartItem = vi.fn();
  const mockClearCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock: empty cart
    (useCartContext as any).mockReturnValue({
      state: { items: [], isOpen: false },
      cartTotal: 0,
      updateCartItem: mockUpdateCartItem,
      removeCartItem: mockRemoveCartItem,
      clearCart: mockClearCart,
    });
  });

  it('should render empty cart message when items is empty', () => {
    // ARRANGE & ACT
    render(<CartPage />);
    
    // ASSERT
    const emptyMessage = screen.getByText(/your cart is empty/i);
    expect(emptyMessage).toBeInTheDocument();
    
    const browseLink = screen.getByRole('link', { name: /browse products/i });
    expect(browseLink).toHaveAttribute('href', '/');
  });

  it('should render cart items with correct data', () => {
    // ARRANGE
    const mockItems = [
      {
        id: 1,
        productId: 1,
        productName: 'Test Widget',
        price: 29.99,
        quantity: 2,
        imageUrl: 'https://example.com/widget.jpg',
      },
      {
        id: 2,
        productId: 2,
        productName: 'Test Gadget',
        price: 49.99,
        quantity: 1,
        imageUrl: 'https://example.com/gadget.jpg',
      },
    ];

    (useCartContext as any).mockReturnValue({
      state: { items: mockItems, isOpen: false },
      cartTotal: 109.97, // (29.99 * 2) + 49.99
      updateCartItem: mockUpdateCartItem,
      removeCartItem: mockRemoveCartItem,
      clearCart: mockClearCart,
    });

    // ACT
    render(<CartPage />);

    // ASSERT
    expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
    expect(screen.getByText('Test Gadget')).toBeInTheDocument();
    expect(screen.getByText(/total: \$109.97/i)).toBeInTheDocument();
  });

  it('should increase quantity when + button is clicked', async () => {
    // ARRANGE
    const mockItems = [
      {
        id: 1,
        productId: 1,
        productName: 'Widget',
        price: 10.00,
        quantity: 2,
        imageUrl: 'https://example.com/widget.jpg',
      },
    ];

    (useCartContext as any).mockReturnValue({
      state: { items: mockItems, isOpen: false },
      cartTotal: 20.00,
      updateCartItem: mockUpdateCartItem,
      removeCartItem: mockRemoveCartItem,
      clearCart: mockClearCart,
    });

    // ACT
    render(<CartPage />);
    const increaseButton = screen.getByLabelText(/increase quantity of widget/i);
    await userEvent.click(increaseButton);

    // ASSERT
    expect(mockUpdateCartItem).toHaveBeenCalledWith(1, 3); // quantity was 2, now 3
  });

  it('should decrease quantity when - button is clicked', async () => {
    // ARRANGE
    const mockItems = [
      {
        id: 1,
        productId: 1,
        productName: 'Widget',
        price: 10.00,
        quantity: 2,
        imageUrl: 'https://example.com/widget.jpg',
      },
    ];

    (useCartContext as any).mockReturnValue({
      state: { items: mockItems, isOpen: false },
      cartTotal: 20.00,
      updateCartItem: mockUpdateCartItem,
      removeCartItem: mockRemoveCartItem,
      clearCart: mockClearCart,
    });

    // ACT
    render(<CartPage />);
    const decreaseButton = screen.getByLabelText(/decrease quantity of widget/i);
    await userEvent.click(decreaseButton);

    // ASSERT
    expect(mockUpdateCartItem).toHaveBeenCalledWith(1, 1); // quantity was 2, now 1
  });

  it('should disable decrease button when quantity is 1', () => {
    // ARRANGE
    const mockItems = [
      {
        id: 1,
        productId: 1,
        productName: 'Widget',
        price: 10.00,
        quantity: 1, // Quantity at minimum
        imageUrl: 'https://example.com/widget.jpg',
      },
    ];

    (useCartContext as any).mockReturnValue({
      state: { items: mockItems, isOpen: false },
      cartTotal: 10.00,
      updateCartItem: mockUpdateCartItem,
      removeCartItem: mockRemoveCartItem,
      clearCart: mockClearCart,
    });

    // ACT
    render(<CartPage />);
    const decreaseButton = screen.getByLabelText(/decrease quantity of widget/i);

    // ASSERT
    expect(decreaseButton).toBeDisabled();
  });

  it('should remove item when Remove button is clicked', async () => {
    // ARRANGE
    const mockItems = [
      {
        id: 1,
        productId: 1,
        productName: 'Widget',
        price: 10.00,
        quantity: 2,
        imageUrl: 'https://example.com/widget.jpg',
      },
    ];

    (useCartContext as any).mockReturnValue({
      state: { items: mockItems, isOpen: false },
      cartTotal: 20.00,
      updateCartItem: mockUpdateCartItem,
      removeCartItem: mockRemoveCartItem,
      clearCart: mockClearCart,
    });

    // ACT
    render(<CartPage />);
    const removeButton = screen.getByLabelText(/remove widget from cart/i);
    await userEvent.click(removeButton);

    // ASSERT
    expect(mockRemoveCartItem).toHaveBeenCalledWith(1);
  });

  it('should display line total for each item correctly', () => {
    // ARRANGE
    const mockItems = [
      {
        id: 1,
        productId: 1,
        productName: 'Widget',
        price: 29.99,
        quantity: 3,
        imageUrl: 'https://example.com/widget.jpg',
      },
    ];

    (useCartContext as any).mockReturnValue({
      state: { items: mockItems, isOpen: false },
      cartTotal: 89.97, // 29.99 * 3
      updateCartItem: mockUpdateCartItem,
      removeCartItem: mockRemoveCartItem,
      clearCart: mockClearCart,
    });

    // ACT
    render(<CartPage />);

    // ASSERT
    expect(screen.getByText(/line total: \$89.97/i)).toBeInTheDocument();
  });

  it('should render checkout button', () => {
    // ARRANGE
    const mockItems = [
      {
        id: 1,
        productId: 1,
        productName: 'Widget',
        price: 10.00,
        quantity: 1,
        imageUrl: 'https://example.com/widget.jpg',
      },
    ];

    (useCartContext as any).mockReturnValue({
      state: { items: mockItems, isOpen: false },
      cartTotal: 10.00,
      updateCartItem: mockUpdateCartItem,
      removeCartItem: mockRemoveCartItem,
      clearCart: mockClearCart,
    });

    // ACT
    render(<CartPage />);

    // ASSERT
    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    expect(checkoutButton).toBeInTheDocument();
  });
});
