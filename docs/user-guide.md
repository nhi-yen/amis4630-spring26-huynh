# Buckeye Marketplace — User Guide

Welcome to Buckeye Marketplace! This guide walks you through the key features of the application with real screenshots.

---

## 1. Browsing Products

When you first visit the marketplace, you'll see the **Product Catalog homepage**.

![Homepage with product list](../docs/screenshots/user-flow-01-homepage.png)

**What you can do:**
- Scroll through all available products
- Click on any product card to view details
- See product price, condition, and seller information at a glance

### Viewing Product Details

Click on a product to see the full details page.

![Product details and API response](../docs/screenshots/user-flow-02-api-products.png)

**What you can do:**
- Read the full product description
- View all product specifications
- See the current price
- **Add to Cart** button appears at the bottom

---

## 2. Creating an Account & Logging In

### Registering for an Account

Click the **Register** link in the header. You'll see the registration form:

![Registration form](../docs/screenshots/01-register.png)

**To register:**
1. Enter your email address
2. Create a password (must be at least 8 characters, include 1 uppercase letter, 1 number, 1 special character)
3. Click **Register**
4. You'll be automatically logged in and redirected to the home page

### Logging In

If you already have an account, click the **Login** link.

![Login form](../docs/screenshots/02-login.png)

**To log in:**
1. Enter your email address
2. Enter your password
3. Click **Login**
4. You'll be redirected to the home page with your cart ready to use

**Test Account (for demo purposes):**
- Email: `testing@test.com`
- Password: `Testing1!`

---

## 3. Adding Items to Your Cart

### Adding from Product List

After browsing, click the **Add to Cart** button on any product card:

![Product with add to cart button](../docs/screenshots/user-flow-03-cart.png)

The button will show **"Added!"** briefly to confirm.

### Viewing Your Cart

Click the **Cart** link in the header (the header shows your cart item count in a badge).

![Cart page with items](../docs/screenshots/04-cart.png)

**In your cart, you can:**
- See all items you've added
- Adjust quantity for each item using + and - buttons
- See the subtotal and total price
- **Remove** individual items
- **Clear Cart** to remove all items at once

---

## 4. Checking Out & Placing an Order

When you're ready to purchase, click **Proceed to Checkout**.

![Checkout form](../docs/screenshots/user-flow-04-checkout-filled.png)

**Fill in your shipping address:**
1. Full Name
2. Street Address
3. City
4. State
5. ZIP Code

Once submitted, the button shows **"Processing..."** while your order is created.

### Order Confirmation

After successful checkout, you'll see a confirmation page:

![Order confirmation](../docs/screenshots/05-order-confirmation.png)

Your order has been placed! The page shows:
- Order confirmation message
- Your order ID
- Items ordered
- Total price paid
- Shipping address

---

## 5. Viewing Order History

Click **Orders** in the header to see all your past orders.

![Order history page](../docs/screenshots/user-flow-06-order-history.png)

**For each order, you can see:**
- Order ID
- Order date
- Items in the order (with quantities)
- Total price
- Current order status (Pending, Processing, Shipped, Delivered, Cancelled)

---

## 6. Browser & Device Compatibility

Buckeye Marketplace works on:

**Desktop Browsers:**
- Chrome/Chromium
- Firefox
- Safari/WebKit

**Mobile Devices:**
- iPhone, iPad, Android tablets

![Mobile homepage on iPhone 13](../docs/screenshots/mobile-authenticated-home-iphone13.png)

The interface automatically adapts to different screen sizes.

---

## 7. Admin Features (Admin Users Only)

If you log in with an admin account, additional menu items appear.

### Managing Products

![Admin products page](../docs/screenshots/user-flow-07-admin-products.png)

Admin users can:
- View all products in the system
- Create new products
- Edit product details (name, price, description, condition)
- Delete products

### Managing Orders

![Admin orders page](../docs/screenshots/user-flow-08-admin-orders.png)

Admin users can:
- View all customer orders
- Update order status (Pending → Processing → Shipped → Delivered)
- Track customer shipping addresses

**Admin Test Account (for demo):**
- Email: `admin@buckeye.local`
- Password: `Admin@1234!`

---

## 8. Troubleshooting

### "Can't add to cart"
- Make sure you're logged in (you'll see your email in the header)
- Check that the product hasn't been removed by an admin

### "Product not showing in my order"
- Orders capture product snapshots at checkout time
- If an admin changes product details later, your order history shows what you originally ordered

### "Can't log in"
- Verify your password matches (passwords are case-sensitive)
- Check that your email is correct
- Try resetting your password if you forgot it

### "Cart is empty after login"
- Carts are user-specific; make sure you're logged in as the correct user
- Check that your browser allows cookies and localStorage

---

## 9. Questions?

For technical support or issues, contact the development team.

Enjoy shopping at Buckeye Marketplace!
