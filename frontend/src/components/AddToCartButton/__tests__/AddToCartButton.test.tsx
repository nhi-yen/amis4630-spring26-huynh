import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { AddToCartButton } from "../AddToCartButton";
import type { Product } from "../../../types/Product";

const mockAddToCart = vi.fn();

vi.mock("../../../contexts/CartContext", () => ({
  useCartContext: () => ({
    state: { items: [], isOpen: false },
    cartItemCount: 0,
    cartTotal: 0,
    loading: false,
    error: null,
    addToCart: mockAddToCart,
    updateCartItem: vi.fn(),
    removeCartItem: vi.fn(),
    clearCart: vi.fn(),
  }),
}));

const product: Product = {
  id: 42,
  title: "Test Product",
  description: "Test Description",
  price: 29.99,
  category: "Electronics",
  sellerName: "Test Seller",
  postedDate: "2026-04-12T00:00:00Z",
  imageUrl: "https://example.com/test.jpg",
  condition: "Good",
};

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddToCart.mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("clicking triggers addToCart from context", async () => {
    render(<AddToCartButton product={product} />);

    const button = screen.getByRole("button", { name: /add test product to cart/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(42, 1);
  });

  it("shows transient loading/feedback state after successful add", async () => {
    render(<AddToCartButton product={product} />);

    const button = screen.getByRole("button", { name: /add test product to cart/i });
    expect(button).toHaveTextContent("Add to Cart");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveTextContent("Added!");

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(button).toHaveTextContent("Add to Cart");
  });

  it("handles error state when addToCart fails", async () => {
    const error = new Error("Failed to add");
    mockAddToCart.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<AddToCartButton product={product} />);
    const button = screen.getByRole("button", { name: /add test product to cart/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(button).toHaveTextContent("Add to Cart");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
