import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { OrderResponse } from '../types/order';
import styles from './OrderConfirmation.module.css';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state as OrderResponse | null;

  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [navigate, order]);

  if (!order) {
    return null;
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.kicker}>Order placed</p>
        <h1 className={styles.heading}>Thanks for your purchase</h1>
        <p className={styles.confirmation}>Confirmation Number: {order.confirmationNumber}</p>
        <p className={styles.total}>Total: ${order.total.toFixed(2)}</p>

        <h2 className={styles.sectionTitle}>Items</h2>
        <ul className={styles.itemList}>
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.quantity}`} className={styles.itemRow}>
              <span>Product #{item.productId}</span>
              <span>
                Qty {item.quantity} · ${item.unitPrice.toFixed(2)} each
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link to="/orders" className={styles.primaryLink}>
            View Order History
          </Link>
          <Link to="/" className={styles.secondaryLink}>
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
