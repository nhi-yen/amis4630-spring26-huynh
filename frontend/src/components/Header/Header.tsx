import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { CartBadge } from "../CartBadge/CartBadge";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.title}>
        <span className={styles.icon}>🏈</span>
        <span className={styles.text}>Buckeye Marketplace</span>
      </Link>
      <div className={styles.actions}>
        {isAuthenticated && (
          <Link to="/orders" className={styles.navLink}>
            My Orders
          </Link>
        )}
        {isAuthenticated && isAdmin && (
          <Link to="/admin" className={styles.navLink} data-testid="header-admin-link">
            Admin
          </Link>
        )}
        {!isAuthenticated && (
          <Link to="/login" className={styles.navLink} data-testid="header-login-link">
            Login
          </Link>
        )}
        {isAuthenticated && (
          <button
            type="button"
            onClick={logout}
            className={styles.navLink}
            data-testid="header-logout-button"
            aria-label="Log out"
          >
            Logout
          </button>
        )}
        <CartBadge />
      </div>
    </header>
  );
};