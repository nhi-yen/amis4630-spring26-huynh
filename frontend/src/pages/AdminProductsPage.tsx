import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  type AdminProduct,
  type ProductCreateRequest,
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from "../services/adminApi";
import styles from "./AdminProductsPage.module.css";

const emptyForm: ProductCreateRequest = {
  title: "",
  description: "",
  price: "",
  category: "",
  sellerName: "",
  imageUrl: "",
  condition: "",
};

const categoryOptions = [
  "Electronics",
  "Furniture",
  "Textbooks",
  "Clothing",
  "School Supplies",
  "Dorm & Apartment",
  "Sports & Outdoors",
  "Accessories",
  "Miscellaneous",
  "Other",
];

const conditionOptions = ["New", "Like New", "Excellent", "Very Good", "Good", "Fair", "Poor"];

export default function AdminProductsPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState<ProductCreateRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      void loadProducts();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  function onChange<K extends keyof ProductCreateRequest>(key: K, value: ProductCreateRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(product: AdminProduct) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      sellerName: product.sellerName,
      imageUrl: product.imageUrl,
      condition: product.condition,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingId === null) {
        await createAdminProduct(form);
      } else {
        await updateAdminProduct(editingId, form);
      }
      cancelEdit();
      await loadProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: number) {
    setError(null);
    try {
      await deleteAdminProduct(id);
      await loadProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete product.");
    }
  }

  if (!isAdmin) {
    return (
      <main className={styles.page} data-testid="admin-products-page">
        <h1>Admin Products</h1>
        <p className={styles.error} data-testid="admin-products-forbidden">
          Forbidden: admin access required.
        </p>
      </main>
    );
  }

  return (
    <main className={styles.page} data-testid="admin-products-page">
      <h1>Admin Products</h1>

      {error && (
        <p className={styles.error} role="alert" data-testid="admin-products-error">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className={styles.form} data-testid="admin-product-form">
        <input
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Title"
          aria-label="Product title"
          data-testid="admin-product-title"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Description"
          aria-label="Product description"
          data-testid="admin-product-description"
          required
        />
<input
  type="text"
  inputMode="decimal"
  className={styles.priceInput}
  value={form.price}
  onChange={(e) => {
    const val = e.target.value;

    // Allow: "", "10", "10.", "10.5", "10.50"
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      onChange("price", val);
    }
  }}
  placeholder="Price"
  aria-label="Product price"
  data-testid="admin-product-price"
  required
/>
        <select
          value={form.category}
          onChange={(e) => onChange("category", e.target.value)}
          aria-label="Product category"
          data-testid="admin-product-category"
          required
        >
          <option value="" disabled>
            Category
          </option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          value={form.sellerName}
          onChange={(e) => onChange("sellerName", e.target.value)}
          placeholder="Seller Name"
          aria-label="Seller name"
          data-testid="admin-product-sellerName"
          required
        />
        <input
          value={form.imageUrl}
          onChange={(e) => onChange("imageUrl", e.target.value)}
          placeholder="Image URL"
          aria-label="Product image URL"
          data-testid="admin-product-imageUrl"
          required
        />
        <select
          value={form.condition}
          onChange={(e) => onChange("condition", e.target.value)}
          aria-label="Product condition"
          data-testid="admin-product-condition"
          required
        >
          <option value="" disabled>
            Condition
          </option>
          {conditionOptions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>

        <div className={styles.actions}>
          <button type="submit" disabled={submitting} data-testid="admin-product-save">
            {editingId === null ? "Create Product" : "Update Product"}
          </button>
          {editingId !== null && (
            <button type="button" onClick={cancelEdit} data-testid="admin-product-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p data-testid="admin-products-loading">Loading...</p>
      ) : (
        <table className={styles.table} data-testid="admin-products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} data-testid={`admin-product-row-${p.id}`}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.category}</td>
                <td>{p.condition}</td>
                <td className={styles.rowActions}>
                  <button onClick={() => startEdit(p)} data-testid={`admin-product-edit-${p.id}`}>
                    Edit
                  </button>
                  <button onClick={() => void onDelete(p.id)} data-testid={`admin-product-delete-${p.id}`}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
