import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderApi';
import type { OrderResponse } from '../types/order';
import styles from './OrderHistory.module.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyOrders();
        setOrders(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  if (loading) {
    return <main className={styles.page}><p className={styles.message}>Loading your orders...</p></main>;
  }

  if (error) {
    return <main className={styles.page}><p className={styles.error}>{error}</p></main>;
  }

  if (orders.length === 0) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <h1 className={styles.heading}>My Orders</h1>
          <p className={styles.message}>You have not placed any orders yet.</p>
          <Link to="/" className={styles.link}>
            Browse products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>My Orders</h1>
      <div className={styles.orderList}>
        {orders.map((order) => {
          const createdDate = order.createdDate ?? order.orderDate;

          return (
            <article key={order.orderId} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.orderNumber}>Order #{order.orderId}</p>
                  <p className={styles.confirmation}>Confirmation: {order.confirmationNumber}</p>
                  <p>Created: {createdDate ? new Date(createdDate).toLocaleString() : 'N/A'}</p>
                  <p>Status: {order.status}</p>
                </div>
                <p className={styles.total}>${order.total.toFixed(2)}</p>
              </div>

              <ul className={styles.itemList}>
                {order.items.map((item) => (
                  <li key={`${order.orderId}-${item.productId}`} className={styles.itemRow}>
                    <span>Product #{item.productId}</span>
                    <span>
                      Qty {item.quantity} · ${item.unitPrice.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </main>
  );
}
