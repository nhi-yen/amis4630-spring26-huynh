import React from "react";
import { CartBadge } from "../CartBadge/CartBadge";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <span className={styles.icon}>🏈</span>
        <span className={styles.text}>Buckeye Marketplace</span>
      </div>
      <CartBadge />
    </header>
  );
};