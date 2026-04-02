import React, { useState } from "react";
import { useCartContext } from "../../contexts/CartContext";
import type { Product } from "../../types/Product";
import styles from "./AddToCartButton.module.css";

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addToCart } = useCartContext();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = async () => {
    try {
      await addToCart(product.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      aria-label={`Add ${product.title} to cart`}
    >
      {justAdded ? "Added!" : "Add to Cart"}
    </button>
  );
};