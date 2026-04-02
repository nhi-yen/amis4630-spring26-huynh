import React from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CartBadge.module.css";

export const CartBadge: React.FC = () => {
  const { cartItemCount } = useCartContext();

  return (
    <Link
      to="/cart"
      className={styles.cartButton}
      aria-label={`Shopping cart with ${cartItemCount} items`}
    >
      🛒
      {cartItemCount > 0 && (
        <span className={styles.badge}>{cartItemCount}</span>
      )}
    </Link>
  );
};;