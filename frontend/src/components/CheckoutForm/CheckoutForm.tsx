import React, { useState } from "react";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CheckoutForm.module.css";

interface FormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const states = [
  { value: "OH", label: "Ohio" },
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "PA", label: "Pennsylvania" },
  { value: "GA", label: "Georgia" },
  { value: "NC", label: "North Carolina" },
  { value: "MI", label: "Michigan" },
];

export const CheckoutForm: React.FC = () => {
  const { clearCart, cartItemCount } = useCartContext();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateField = (field: keyof FormData) => {
    const value = formData[field];
    let error = "";
    switch (field) {
      case "fullName":
        if (!value || value.length < 2) {
          error = "Full name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value || !value.includes("@")) {
          error = "Email must be valid";
        }
        break;
      case "address":
        if (!value || value.length < 5) {
          error = "Shipping address must be at least 5 characters";
        }
        break;
      case "city":
        if (!value) {
          error = "City is required";
        }
        break;
      case "state":
        if (!value) {
          error = "State is required";
        }
        break;
      case "zip":
        if (!value || !/^\d{5}$/.test(value)) {
          error = "Zip code must be 5 digits";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => new Set(prev).add(field));
    validateField(field);
  };

  const validateAll = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
      validateField(field);
      if (errors[field]) {
        newErrors[field] = errors[field];
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validateAll();
    if (Object.keys(allErrors).length > 0) {
      setTouched(new Set(Object.keys(formData)));
      setErrors(allErrors);
      return;
    }
    setIsProcessing(true);
    try {
      await clearCart();
      setSuccess(true);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className={styles.form}>
        <div className={styles.success}>Order placed successfully!</div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="fullName" className={styles.label}>
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={() => handleBlur("fullName")}
          className={styles.input}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullNameError" : undefined}
        />
        {touched.has("fullName") && errors.fullName && (
          <span id="fullNameError" className={styles.error} role="alert">
            {errors.fullName}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          className={styles.input}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "emailError" : undefined}
        />
        {touched.has("email") && errors.email && (
          <span id="emailError" className={styles.error} role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="address" className={styles.label}>
          Shipping Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={() => handleBlur("address")}
          className={styles.input}
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? "addressError" : undefined}
        />
        {touched.has("address") && errors.address && (
          <span id="addressError" className={styles.error} role="alert">
            {errors.address}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="city" className={styles.label}>
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          onBlur={() => handleBlur("city")}
          className={styles.input}
          aria-invalid={!!errors.city}
          aria-describedby={errors.city ? "cityError" : undefined}
        />
        {touched.has("city") && errors.city && (
          <span id="cityError" className={styles.error} role="alert">
            {errors.city}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="state" className={styles.label}>
          State
        </label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          onBlur={() => handleBlur("state")}
          className={styles.select}
          aria-invalid={!!errors.state}
          aria-describedby={errors.state ? "stateError" : undefined}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </select>
        {touched.has("state") && errors.state && (
          <span id="stateError" className={styles.error} role="alert">
            {errors.state}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="zip" className={styles.label}>
          Zip Code
        </label>
        <input
          type="text"
          id="zip"
          name="zip"
          value={formData.zip}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 5);
            setFormData((prev) => ({ ...prev, zip: value }));
          }}
          onBlur={() => handleBlur("zip")}
          className={styles.input}
          aria-invalid={!!errors.zip}
          aria-describedby={errors.zip ? "zipError" : undefined}
        />
        {touched.has("zip") && errors.zip && (
          <span id="zipError" className={styles.error} role="alert">
            {errors.zip}
          </span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isProcessing || cartItemCount === 0}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
};