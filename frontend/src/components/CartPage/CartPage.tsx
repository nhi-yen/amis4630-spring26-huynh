import React from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CartPage.module.css";

export const CartPage: React.FC = () => {
  const { state, cartTotal, updateCartItem, removeCartItem } = useCartContext();
  const { items } = state;

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.message}>Your cart is empty</p>
        <Link to="/" className={styles.link}>Browse products</Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h1>Shopping Cart</h1>
      {items.map((item) => (
        <div key={item.id} className={styles.cartItem}>
          <img
            src={item.imageUrl}
            alt={item.productName}
            className={styles.image}
          />
          <div className={styles.details}>
            <h3>{item.productName}</h3>
            <p>${item.price.toFixed(2)}</p>
            <div className={styles.quantity}>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await updateCartItem(item.id, Math.max(1, item.quantity - 1));
                  } catch (error) {
                    console.error(error);
                  }
                }}
                disabled={item.quantity === 1}
                aria-label={`Decrease quantity of ${item.productName}`}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await updateCartItem(item.id, Math.min(99, item.quantity + 1));
                  } catch (error) {
                    console.error(error);
                  }
                }}
                aria-label={`Increase quantity of ${item.productName}`}
              >
                +
              </button>
            </div>
            <p>Line total: ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await removeCartItem(item.id);
              } catch (error) {
                console.error(error);
              }
            }}
            aria-label={`Remove ${item.productName} from cart`}
            className={styles.remove}
          >
            Remove
          </button>
        </div>
      ))}
      <div className={styles.total}>
        <h2>Total: ${cartTotal.toFixed(2)}</h2>
        <Link to="/checkout" className={styles.checkout}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};