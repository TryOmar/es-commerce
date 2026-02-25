/**
 * ES Commerce - Core Application Logic
 * Storage, Auth, Products, Cart, Navigation, Toast, and Form Validation.
 */

/* ============================
   Storage Manager
   ============================ */
class StorageManager {
  /** Retrieves parsed JSON from localStorage by key. */
  static get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  /** Stores a value as JSON in localStorage. */
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /** Removes a key from localStorage. */
  static remove(key) {
    localStorage.removeItem(key);
  }
}

/* ============================
   Auth Manager
   ============================ */
class AuthManager {
  /** Registers a new user. Returns {success, message}. */
  static register(name, email, password) {
    const users = StorageManager.get('es_users') || [];
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    users.push({ name, email, password, createdAt: new Date().toISOString() });
    StorageManager.set('es_users', users);
    return { success: true, message: 'Registration successful' };
  }

  /** Logs in a user. Returns {success, message}. */
  static login(email, password) {
    const users = StorageManager.get('es_users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    StorageManager.set('es_current_user', { name: user.name, email: user.email });
    return { success: true, message: 'Login successful' };
  }

  /** Logs out current user and redirects to login. */
  static logout() {
    StorageManager.remove('es_current_user');
    window.location.href = 'login.html';
  }

  /** Returns current user object or null. */
  static getCurrentUser() {
    return StorageManager.get('es_current_user');
  }

  /** Returns true if a user is logged in. */
  static isLoggedIn() {
    return !!this.getCurrentUser();
  }

  /** Redirects to login if not authenticated. */
  static requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
}

/* ============================
   Product Catalog
   ============================ */
const PRODUCT_CATALOG = [
  { id: 1, name: 'Classic Novel', price: 200, category: 'school', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop', description: 'A timeless literary masterpiece for avid readers.' },
  { id: 2, name: 'Writing Pen Set', price: 100, category: 'school', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop', description: 'Premium ballpoint pen set for smooth writing.' },
  { id: 3, name: 'Notebook Bundle', price: 80, category: 'school', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop', description: 'Pack of 3 ruled notebooks for school or office.' },
  { id: 4, name: 'Cotton T-Shirt', price: 350, category: 'clothes', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', description: 'Comfortable everyday cotton tee in multiple colors.' },
  { id: 5, name: 'Summer Dress', price: 500, category: 'clothes', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=300&fit=crop', description: 'Elegant floral pattern summer dress.' },
  { id: 6, name: 'Denim Jacket', price: 750, category: 'clothes', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop', description: 'Classic denim jacket for all seasons.' },
  { id: 7, name: 'Matte Lipstick', price: 150, category: 'makeup', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop', description: 'Long-lasting matte finish lipstick.' },
  { id: 8, name: 'Foundation Kit', price: 400, category: 'makeup', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', description: 'Full coverage professional foundation.' },
  { id: 9, name: 'Mascara Pro', price: 120, category: 'makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop', description: 'Volumizing waterproof mascara.' },
  { id: 10, name: 'Smartphone Pro', price: 4500, category: 'phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', description: 'Latest flagship smartphone with amazing camera.' },
  { id: 11, name: 'Budget Phone', price: 1200, category: 'phones', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop', description: 'Great value phone with long battery life.' },
  { id: 12, name: 'Phone Case', price: 50, category: 'phones', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop', description: 'Protective silicone phone case.' },
];

/* ============================
   Product Manager
   ============================ */
class ProductManager {
  static getAllProducts() { return PRODUCT_CATALOG; }

  /** Finds a product by its numeric ID. */
  static getProductById(id) {
    return PRODUCT_CATALOG.find(p => p.id === parseInt(id));
  }

  /** Filters products by category. 'all' returns everything. */
  static getProductsByCategory(category) {
    if (!category || category === 'all') return PRODUCT_CATALOG;
    return PRODUCT_CATALOG.filter(p => p.category === category);
  }

  /** Filters and sorts products based on options. */
  static filterProducts({ category = 'all', sortBy = 'default' }) {
    let products = this.getProductsByCategory(category);
    if (sortBy === 'price-low') products = [...products].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') products = [...products].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    return products;
  }

  /** Returns available category slugs. */
  static getCategories() {
    return ['all', 'school', 'clothes', 'makeup', 'phones'];
  }

  /** Maps category slugs to CSS class names. */
  static getCategoryColor(category) {
    const map = { school: 'cat-school', clothes: 'cat-clothes', makeup: 'cat-makeup', phones: 'cat-phones' };
    return map[category] || 'cat-school';
  }
}

/* ============================
   Cart Manager
   ============================ */
class CartManager {
  static getCart() { return StorageManager.get('es_cart') || []; }

  /** Adds a product to cart or increments quantity if exists. */
  static addItem(productId, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    StorageManager.set('es_cart', cart);
    NavBuilder.updateCartBadge();
    return cart;
  }

  /** Removes a product from the cart. */
  static removeItem(productId) {
    const cart = this.getCart().filter(item => item.productId !== productId);
    StorageManager.set('es_cart', cart);
    NavBuilder.updateCartBadge();
    return cart;
  }

  /** Updates quantity; removes item if quantity <= 0. */
  static updateQuantity(productId, quantity) {
    if (quantity <= 0) return this.removeItem(productId);
    const cart = this.getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) item.quantity = quantity;
    StorageManager.set('es_cart', cart);
    NavBuilder.updateCartBadge();
    return cart;
  }

  /** Calculates total price of all items in cart. */
  static getTotal() {
    return this.getCart().reduce((sum, item) => {
      const product = ProductManager.getProductById(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  /** Returns total number of items in cart. */
  static getItemCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  /** Empties the entire cart. */
  static clearCart() {
    StorageManager.remove('es_cart');
    NavBuilder.updateCartBadge();
  }
}

/* ============================
   Navigation Builder
   ============================ */
class NavBuilder {
  /** Renders the shared navigation bar into a container element. */
  static build(containerId = 'main-nav') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = AuthManager.getCurrentUser();
    const cartCount = CartManager.getItemCount();
    const page = window.location.pathname.split('/').pop() || 'index.html';

    container.className = 'main-nav';
    container.innerHTML = `
      <a href="index.html" class="nav-brand">ES Commerce</a>
      <div class="nav-links">
        <a href="index.html" class="${page === 'index.html' ? 'active' : ''}">
          <i class="fa-solid fa-house"></i> Home
        </a>
        <a href="contact.html" class="${page === 'contact.html' ? 'active' : ''}">
          <i class="fa-solid fa-envelope"></i> Contact
        </a>
        <a href="cart.html" class="nav-cart ${page === 'cart.html' ? 'active' : ''}">
          <i class="fa-solid fa-cart-shopping"></i>
          <span class="cart-badge" id="cart-badge" style="${cartCount === 0 ? 'display:none' : ''}">${cartCount}</span>
        </a>
        ${user ? `<span style="color:var(--text-light);font-size:0.9rem"><i class="fa-solid fa-user"></i> ${user.name}</span>` : ''}
        ${user
          ? '<a href="#" id="logout-link"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>'
          : '<a href="login.html"><i class="fa-solid fa-right-to-bracket"></i> Login</a>'}
      </div>`;

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        AuthManager.logout();
      });
    }
  }

  /** Updates the cart badge count without rebuilding the full nav. */
  static updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = CartManager.getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
}

/* ============================
   Toast Notifications
   ============================ */
class Toast {
  /** Displays a temporary notification. Types: 'info', 'success', 'error'. */
  static show(message, type = 'info', duration = 2500) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

/* ============================
   Form Validator
   ============================ */
class FormValidator {
  static validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  static validateRequired(value) { return value && value.trim().length > 0; }
  static validateMinLength(value, min) { return value && value.length >= min; }
  static validateMatch(a, b) { return a === b; }

  /** Marks a form group as having an error with a message. */
  static showError(inputElement, message) {
    const group = inputElement.closest('.form-group');
    if (!group) return;
    group.classList.add('error');
    const errorEl = group.querySelector('.error-text');
    if (errorEl) errorEl.textContent = message;
  }

  /** Clears all error states from a form. */
  static clearErrors(form) {
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
  }
}
