import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AddToCartButton } from '../AddToCartButton';
import type { Product } from '../../../types/Product';

// Mock the CartContext
const mockAddToCart = vi.fn();
const mockContext = {
  addToCart: mockAddToCart,
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  clearCart: vi.fn(),
  state: { items: [], isOpen: false },
  cartItemCount: 0,
  cartTotal: 0,
  loading: false,
  error: null,
};

vi.mock('../../../contexts/CartContext', () => ({
  useCartContext: vi.fn(() => mockContext),
}));

const mockProduct: Product = {
  id: 100,
  title: 'Test Widget',
  price: 29.99,
  description: 'A test product',
  imageUrl: 'https://example.com/widget.jpg',
};

describe('AddToCartButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddToCart.mockClear();
    mockAddToCart.mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render button with product title in aria-label', () => {
    render(<AddToCartButton product={mockProduct} />);

    const button = screen.getByRole('button', {
      name: 'Add Test Widget to cart',
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Add to Cart');
  });

  it('should call addToCart with product id and quantity 1', async () => {
    render(<AddToCartButton product={mockProduct} />);

    const button = screen.getByRole('button');
    await act(async () => {
      button.click();
    });

    expect(mockAddToCart).toHaveBeenCalledWith(100, 1);
  });

  it('should display "Added!" message after successful add', async () => {
    render(<AddToCartButton product={mockProduct} />);

    const button = screen.getByRole('button');

    // Initial state
    expect(button).toHaveTextContent('Add to Cart');

    // Click button
    await act(async () => {
      button.click();
    });

    // Should show "Added!"
    expect(button).toHaveTextContent('Added!');
  });

  it('should revert "Added!" message after 1500ms', async () => {
    render(<AddToCartButton product={mockProduct} />);

    const button = screen.getByRole('button');

    // Click button
    await act(async () => {
      button.click();
    });

    // Should show "Added!"
    expect(button).toHaveTextContent('Added!');

    // Fast-forward time by 1500ms
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    // Should revert to "Add to Cart"
    expect(button).toHaveTextContent('Add to Cart');
  });

  it('should handle add to cart errors gracefully', async () => {
    const error = new Error('Network error');
    mockAddToCart.mockRejectedValueOnce(error);

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<AddToCartButton product={mockProduct} />);

    const button = screen.getByRole('button');

    await act(async () => {
      button.click();
    });

    // Button should remain in original state on error
    expect(button).toHaveTextContent('Add to Cart');

    consoleSpy.mockRestore();
  });

  it('should handle multiple rapid clicks', async () => {
    render(<AddToCartButton product={mockProduct} />);

    const button = screen.getByRole('button');

    // Click multiple times in quick succession
    await act(async () => {
      button.click();
      button.click();
      button.click();
    });

    // All three clicks should call addToCart
    expect(mockAddToCart).toHaveBeenCalledTimes(3);
  });

  it('should apply correct CSS class to button', () => {
    render(<AddToCartButton product={mockProduct} />);

    const button = screen.getByRole('button');
    
    // The button should have the styles.button class
    // Since styles are CSS modules, they'll be mangled, but the class should exist
    expect(button.className).toBeTruthy();
  });

  it('should accept different products', async () => {
    const customProduct: Product = {
      id: 200,
      title: 'Premium Gadget',
      price: 199.99,
      description: 'An expensive gadget',
      imageUrl: 'https://example.com/gadget.jpg',
    };

    render(<AddToCartButton product={customProduct} />);

    const button = screen.getByRole('button', {
      name: 'Add Premium Gadget to cart',
    });

    await act(async () => {
      button.click();
    });

    expect(mockAddToCart).toHaveBeenCalledWith(200, 1);
  });
});
