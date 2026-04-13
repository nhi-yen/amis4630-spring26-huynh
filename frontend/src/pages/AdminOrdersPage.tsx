import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { type AdminOrder, getAdminOrders, updateAdminOrderStatus } from "../services/adminApi";
import styles from "./AdminOrdersPage.module.css";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      void loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  async function onStatusChange(orderId: number, status: string) {
    setError(null);
    try {
      await updateAdminOrderStatus(orderId, { status });
      await loadOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update order status.");
    }
  }

  if (!isAdmin) {
    return (
      <main className={styles.page} data-testid="admin-orders-page">
        <h1>Admin Orders</h1>
        <p className={styles.error} data-testid="admin-orders-forbidden">
          Forbidden: admin access required.
        </p>
      </main>
    );
  }

  return (
    <main className={styles.page} data-testid="admin-orders-page">
      <h1>Admin Orders</h1>

      {error && (
        <p className={styles.error} role="alert" data-testid="admin-orders-error">
          {error}
        </p>
      )}

      {loading ? (
        <p data-testid="admin-orders-loading">Loading...</p>
      ) : (
        <div className={styles.list} data-testid="admin-orders-list">
          {orders.map((o) => (
            <article key={o.id} className={styles.card} data-testid={`admin-order-card-${o.id}`}>
              <header className={styles.cardHeader}>
                <div>
                  <p>Order #{o.id}</p>
                  <p>Confirmation: {o.confirmationNumber}</p>
                  <p>Created: {new Date(o.createdDate).toLocaleString()}</p>
                  <p>Total: ${o.total.toFixed(2)}</p>
                </div>
                <div>
                  <label htmlFor={`status-${o.id}`}>Status</label>
                  <select
                    id={`status-${o.id}`}
                    value={o.status}
                    onChange={(e) => void onStatusChange(o.id, e.target.value)}
                    data-testid={`admin-order-status-${o.id}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </header>

              <ul>
                {o.items.map((item, index) => (
                  <li
                    key={`${o.id}-${item.productId}-${index}`}
                    data-testid={`admin-order-item-${o.id}-${item.productId}-${index}`}
                  >
                    Product #{item.productId} | Qty {item.quantity} | Unit ${item.unitPrice.toFixed(2)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
