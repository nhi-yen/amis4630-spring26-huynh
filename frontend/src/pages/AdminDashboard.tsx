import { Link } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  return (
    <main className={styles.page} data-testid="admin-dashboard-page">
      <h1>Admin Dashboard</h1>
      <div className={styles.links}>
        <Link to="/admin/products" className={styles.adminLink} data-testid="admin-nav-products">Manage Products</Link>
        <Link to="/admin/orders" className={styles.adminLink} data-testid="admin-nav-orders">Manage Orders</Link>
      </div>
    </main>
  );
}
