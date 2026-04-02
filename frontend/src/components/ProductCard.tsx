import React from "react";
import { Link } from "react-router-dom";
import { AddToCartButton } from "./AddToCartButton/AddToCartButton";
import type { Product } from "../types/Product";
import { useCartContext } from "../contexts/CartContext";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { error } = useCartContext();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "16px",
        background: "white",
        maxWidth: "250px",
        width: "100%",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
      }}
    >
      {/* Product link section */}
      <Link
        to={`/products/${product.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        />

        <h2
          style={{
            margin: "0 0 6px 0",
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "1.2",
          }}
        >
          {product.title}
        </h2>

        <p style={{ margin: "0 0 6px 0", color: "#666", fontSize: "14px" }}>
          {product.category}
        </p>

        <span
          style={{
            display: "inline-block",
            padding: "4px 8px",
            background: "#f3f3f3",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#444",
            marginBottom: "8px",
          }}
        >
          {product.condition}
        </span>

        <p
          style={{
            margin: "8px 0 4px 0",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          ${product.price.toFixed(2)}
        </p>

        <p style={{ margin: 0, color: "#777", fontSize: "13px" }}>
          Sold by: {product.sellerName}
        </p>
      </Link>

      {/* Add to Cart button OUTSIDE the Link */}
      <div style={{ marginTop: "12px" }}>
        <AddToCartButton product={product} />
      </div>

      {/* Error message displayed here */}
      {error && (
        <p style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
