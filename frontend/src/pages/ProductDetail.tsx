import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Product } from "../types/Product";
import styles from "./ProductDetail.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/" className={styles.backLink}>← Back to Products</Link>

      <h1>{product.title}</h1>

      <img
        src={product.imageUrl}
        alt={product.title}
        width={300}
        style={{ borderRadius: "8px", marginBottom: "20px" }}
      />

      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Condition:</strong> {product.condition}</p>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
      <p><strong>Seller:</strong> {product.sellerName}</p>
      <p>
        <strong>Posted:</strong>{" "}
        {new Date(product.postedDate).toLocaleDateString()}
      </p>
      <p><strong>Description:</strong> {product.description}</p>
    </div>
  );
}
