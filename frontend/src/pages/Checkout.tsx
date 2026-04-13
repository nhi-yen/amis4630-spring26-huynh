import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { placeOrder } from '../services/orderApi';
import styles from './Checkout.module.css';

type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

const formFieldNames: (keyof CheckoutForm)[] = [
  'firstName',
  'lastName',
  'email',
  'address',
  'city',
  'state',
  'zip',
];

export default function Checkout() {
  const navigate = useNavigate();
  const { state, cartTotal, clearCart } = useCartContext();
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items } = state;

  const validateField = (field: keyof CheckoutForm, value: string): string => {
    const trimmed = value.trim();

    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!trimmed) return 'This field is required.';
        if (trimmed.length < 2) return 'Must be at least 2 characters.';
        return '';
      case 'email':
        if (!trimmed) return 'Email is required.';
        if (!trimmed.includes('@')) return 'Please enter a valid email address.';
        return '';
      case 'address':
        if (!trimmed) return 'Address is required.';
        if (trimmed.length < 5) return 'Address must be at least 5 characters.';
        return '';
      case 'city':
        if (!trimmed) return 'City is required.';
        return '';
      case 'state':
        if (!trimmed) return 'State is required.';
        return '';
      case 'zip':
        if (!trimmed) return 'ZIP code is required.';
        if (!/^\d{5}$/.test(trimmed)) return 'ZIP code must be exactly 5 digits.';
        return '';
      default:
        return '';
    }
  };

  const validateAll = (values: CheckoutForm): CheckoutErrors => {
    const nextErrors: CheckoutErrors = {};
    formFieldNames.forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        nextErrors[field] = error;
      }
    });
    return nextErrors;
  };

  const handleChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof CheckoutForm) => {
    setTouched((prev) => {
      const next = new Set(prev);
      next.add(field);
      return next;
    });

    const error = validateField(field, form[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validateAll(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setTouched(new Set(formFieldNames));
      return;
    }

    const formattedShippingAddress = `${form.firstName.trim()} ${form.lastName.trim()}\n${form.email.trim()}\n${form.address.trim()}\n${form.city.trim()}, ${form.state.trim()} ${form.zip.trim()}`;

    setIsSubmitting(true);
    try {
      const order = await placeOrder(formattedShippingAddress);
      await clearCart();
      navigate(`/order-confirmation/${order.orderId}`, { state: order });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h1 className={styles.heading}>Checkout</h1>
        <p className={styles.message}>Your cart is empty.</p>
        <Link to="/cart" className={styles.link}>
          Return to cart
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.summaryCard}>
        <h1 className={styles.heading}>Checkout</h1>
        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item.id} className={styles.itemRow}>
              <div>
                <p className={styles.itemName}>{item.productName}</p>
                <p className={styles.itemMeta}>Quantity: {item.quantity}</p>
              </div>
              <p className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <div className={styles.totalRow}>
          <span>Total</span>
          <strong>${cartTotal.toFixed(2)}</strong>
        </div>
      </section>

      <section className={styles.formCard}>
        <h2 className={styles.sectionTitle}>Shipping Address</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor="firstName" className={styles.label}>
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className={`${styles.input} ${touched.has('firstName') && errors.firstName ? styles.invalid : ''}`}
              value={form.firstName}
              onChange={(event) => handleChange('firstName', event.target.value)}
              onBlur={() => handleBlur('firstName')}
              aria-invalid={touched.has('firstName') && errors.firstName ? 'true' : 'false'}
              aria-describedby={touched.has('firstName') && errors.firstName ? 'firstNameError' : undefined}
            />
            {touched.has('firstName') && errors.firstName && (
              <p id="firstNameError" className={styles.error} role="alert">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className={`${styles.input} ${touched.has('lastName') && errors.lastName ? styles.invalid : ''}`}
              value={form.lastName}
              onChange={(event) => handleChange('lastName', event.target.value)}
              onBlur={() => handleBlur('lastName')}
              aria-invalid={touched.has('lastName') && errors.lastName ? 'true' : 'false'}
              aria-describedby={touched.has('lastName') && errors.lastName ? 'lastNameError' : undefined}
            />
            {touched.has('lastName') && errors.lastName && (
              <p id="lastNameError" className={styles.error} role="alert">
                {errors.lastName}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${touched.has('email') && errors.email ? styles.invalid : ''}`}
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              onBlur={() => handleBlur('email')}
              aria-invalid={touched.has('email') && errors.email ? 'true' : 'false'}
              aria-describedby={touched.has('email') && errors.email ? 'emailError' : undefined}
            />
            {touched.has('email') && errors.email && (
              <p id="emailError" className={styles.error} role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="address" className={styles.label}>
              Address
            </label>
            <input
              id="address"
              type="text"
              className={`${styles.input} ${touched.has('address') && errors.address ? styles.invalid : ''}`}
              value={form.address}
              onChange={(event) => handleChange('address', event.target.value)}
              onBlur={() => handleBlur('address')}
              aria-invalid={touched.has('address') && errors.address ? 'true' : 'false'}
              aria-describedby={touched.has('address') && errors.address ? 'addressError' : undefined}
            />
            {touched.has('address') && errors.address && (
              <p id="addressError" className={styles.error} role="alert">
                {errors.address}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="city" className={styles.label}>
              City
            </label>
            <input
              id="city"
              type="text"
              className={`${styles.input} ${touched.has('city') && errors.city ? styles.invalid : ''}`}
              value={form.city}
              onChange={(event) => handleChange('city', event.target.value)}
              onBlur={() => handleBlur('city')}
              aria-invalid={touched.has('city') && errors.city ? 'true' : 'false'}
              aria-describedby={touched.has('city') && errors.city ? 'cityError' : undefined}
            />
            {touched.has('city') && errors.city && (
              <p id="cityError" className={styles.error} role="alert">
                {errors.city}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="state" className={styles.label}>
              State
            </label>
            <select
              id="state"
              className={`${styles.select} ${touched.has('state') && errors.state ? styles.invalid : ''}`}
              value={form.state}
              onChange={(event) => handleChange('state', event.target.value)}
              onBlur={() => handleBlur('state')}
              aria-invalid={touched.has('state') && errors.state ? 'true' : 'false'}
              aria-describedby={touched.has('state') && errors.state ? 'stateError' : undefined}
            >
              <option value="">Select state</option>
              <option value="OH">OH</option>
              <option value="CA">CA</option>
              <option value="NY">NY</option>
              <option value="TX">TX</option>
              <option value="FL">FL</option>
            </select>
            {touched.has('state') && errors.state && (
              <p id="stateError" className={styles.error} role="alert">
                {errors.state}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="zip" className={styles.label}>
              ZIP
            </label>
            <input
              id="zip"
              type="text"
              className={`${styles.input} ${touched.has('zip') && errors.zip ? styles.invalid : ''}`}
              value={form.zip}
              onChange={(event) => handleChange('zip', event.target.value)}
              onBlur={() => handleBlur('zip')}
              aria-invalid={touched.has('zip') && errors.zip ? 'true' : 'false'}
              aria-describedby={touched.has('zip') && errors.zip ? 'zipError' : undefined}
              inputMode="numeric"
              maxLength={5}
            />
            {touched.has('zip') && errors.zip && (
              <p id="zipError" className={styles.error} role="alert">
                {errors.zip}
              </p>
            )}
          </div>

          {submitError && (
            <p className={styles.error} role="alert">
              {submitError}
            </p>
          )}
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
            aria-label="Place your order"
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </section>
    </main>
  );
}
