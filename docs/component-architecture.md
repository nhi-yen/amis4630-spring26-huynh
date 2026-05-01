# Component Architecture (Atomic Design)

This component hierarchy applies **Atomic Design** to Buckeye Marketplace's full feature set: product catalog, authentication, cart, checkout, orders, and admin operations.

## Core Atoms (Building Blocks)

- **Button** (primary, secondary, danger variants)
- **Input** (text, email, password, number)
- **Label** (form label with optional required marker)
- **Select/Dropdown** (for category/status filtering)
- **Text** (heading, body, caption typography)
- **Badge/Tag** (condition label, category tag, role indicator)
- **Icon** (cart, menu, search, close)
- **Image** (product image with fallback)
- **Card Container** (product card, order card)
- **Avatar** (user profile picture or initials)

## Molecules (Simple Component Groups)

- **Search Bar** (Input + Icon button)
- **Filter Group** (Label + Select/Checkbox)
- **Form Input Group** (Label + Input + Error message)
- **Cart Item Row** (Image + Title + Quantity control + Remove button)
- **Order Item Row** (Product + Quantity + Price + Status)
- **Price Display** (Current price + Original price if on sale)
- **Condition Badge** (Tag displaying "Like New", "Good", etc.)
- **Seller Info Row** (Avatar + Seller name + Status badge)
- **Header Navigation** (Logo + Nav links + Cart icon + User menu)

## Organisms (Complex Component Groups)

- **Product Card** (Image + Title + Condition badge + Price + Seller info + Add to cart button)
- **Product Grid** (Collection of product cards with responsive layout)
- **Cart Summary** (Item count + Total price + Checkout button)
- **Cart Item List** (Multiple cart item rows + quantity controls + remove buttons)
- **Checkout Form** (Shipping address fields + Submit button)
- **Order Confirmation Card** (Order ID + Status + Items + Total + Timeline)
- **Order History List** (Multiple order cards with status indicators)
- **Admin Product Table** (Product rows with edit/delete actions)
- **Admin Order Table** (Order rows with status update dropdown)
- **Login Form** (Email input + Password input + Submit button + Register link)
- **Registration Form** (Email input + Password input + Confirm password + Submit button)

## Templates (Page-Level Layouts)

- **Public Template** (No header/cart, minimal layout for login/register)
- **App Shell Template** (Header + Navigation + Cart sidebar + Main content area)
- **Admin Template** (Header + Sidebar navigation + Admin-specific content area)
- **Product Catalog Template** (Catalog header + Filter sidebar + Product grid)
- **Product Detail Template** (Product image + Details + Seller info + Add to cart button)
- **Cart/Checkout Template** (Cart summary + Items list + Checkout form)
- **Orders Template** (Order history list with filters)

## Pages (React Router Routes)

### Public Pages
- **ProductList** (`/`) – Product grid with optional filtering
- **ProductDetail** (`/products/:id`) – Single product with details
- **Login** (`/login`) – Email + password form + register link
- **Register** (`/register`) – Email + password form + login link

### Authenticated Pages (User Role)
- **CartPage** (`/cart`) – Cart items + checkout button
- **Checkout** (`/checkout`) – Shipping address form + place order button
- **OrderConfirmation** (`/order-confirmation/:id`) – Confirmation details + order ID
- **OrderHistory** (`/orders`) – List of user's orders with status

### Admin Pages (Admin Role)
- **AdminDashboard** (`/admin`) – Admin hub with nav to products/orders
- **AdminProductsPage** (`/admin/products`) – Product table + create/edit/delete actions
- **AdminOrdersPage** (`/admin/orders`) – Order table + status update dropdown

## State Management

### Context + useReducer (Complex State)
- **CartContext**: Global cart state (items, loading, error); useReducer handles ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
- **AuthContext**: Global auth state (user, token, loading, error); useReducer handles LOGIN_SUCCESS, LOGOUT, RESTORE_SESSION

### useState (Simple State)
- **ProductList**: loading, error (local)
- **Login/Register forms**: email, password, error (form-level)
- **Admin tables**: sort direction, filter values (local)

## Styling Approach

- **CSS Modules**: Each component folder contains `ComponentName.module.css`
- **No global CSS**: All styles scoped to components
- **No inline styles**: All styles in .module.css files
- **Responsive design**: CSS grid/flexbox for mobile/tablet/desktop
- **Accessibility**: aria-labels on buttons, semantic HTML, color contrast compliance
