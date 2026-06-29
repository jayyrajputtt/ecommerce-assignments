const app = document.getElementById('app');
const cartCount = document.getElementById('cart-count');

function randomPrice() {
  return Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
}

const sampleProducts = [
  {
    id: 1,
    title: 'Classic White Shirt',
    category: 'Clothes',
    brand: 'Northline',
    price: randomPrice(),
    description: 'Soft cotton shirt with a clean fit for everyday wear.',
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    stock: 24,
    rating: 4.5,
  },
  {
    id: 2,
    title: 'Relaxed Denim Jacket',
    category: 'Clothes',
    brand: 'Stonefield',
    price: randomPrice(),
    description: 'A comfortable jacket that layers well for casual days.',
    thumbnail: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    stock: 18,
    rating: 4.3,
  },
  {
    id: 3,
    title: 'Linen Summer Dress',
    category: 'Clothes',
    brand: 'Willow',
    price: randomPrice(),
    description: 'Light and breezy, made for warm weather and easy styling.',
    thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    stock: 15,
    rating: 4.6,
  },
  {
    id: 4,
    title: 'Black Tailored Trousers',
    category: 'Clothes',
    brand: 'Atelier',
    price: randomPrice(),
    description: 'Sharp and simple trousers that work for work or weekends.',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    stock: 20,
    rating: 4.4,
  },
  {
    id: 5,
    title: 'Soft Knit Sweater',
    category: 'Clothes',
    brand: 'Marlow',
    price: randomPrice(),
    description: 'A cozy sweater with a relaxed shape and soft finish.',
    thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    stock: 22,
    rating: 4.7,
  },
  {
    id: 6,
    title: 'Running Sneakers',
    category: 'Shoes',
    brand: 'Tempo',
    price: randomPrice(),
    description: 'Lightweight sneakers made for comfort and all-day movement.',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    stock: 16,
    rating: 4.5,
  },
  {
    id: 7,
    title: 'Leather Loafers',
    category: 'Shoes',
    brand: 'Cedar',
    price: randomPrice(),
    description: 'Polished loafers with a simple look that goes with anything.',
    thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    stock: 12,
    rating: 4.2,
  },
  {
    id: 8,
    title: 'Hiking Boots',
    category: 'Shoes',
    brand: 'Trailbase',
    price: randomPrice(),
    description: 'Sturdy boots built for outdoor walks and weekend plans.',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    stock: 14,
    rating: 4.6,
  },
  {
    id: 9,
    title: 'Casual Slip-Ons',
    category: 'Shoes',
    brand: 'Mira',
    price: randomPrice(),
    description: 'Easy slip-ons that feel relaxed and look polished.',
    thumbnail: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    stock: 19,
    rating: 4.3,
  },
  {
    id: 10,
    title: 'High-Top Trainers',
    category: 'Shoes',
    brand: 'Urban Step',
    price: randomPrice(),
    description: 'A trendy pair of trainers with a solid grip and easy comfort.',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    stock: 17,
    rating: 4.4,
  },
];

const state = {
  products: [],
  cart: [],
  currentProduct: null,
};

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    state.cart = Array.isArray(stored) ? stored : [];
  } catch {
    state.cart = [];
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCartCount();
}

function updateCartCount() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function formatCurrency(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

async function fetchProducts() {
  state.products = sampleProducts;
  return state.products;
}

async function fetchProduct(id) {
  const product = state.products.find((item) => item.id === Number(id));
  if (!product) throw new Error('Unable to load product');
  state.currentProduct = product;
  return product;
}

function route() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return hash.startsWith('/') ? hash : `/${hash}`;
}

function navigate(path) {
  window.location.hash = path;
}

function render() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const currentRoute = route();
  if (currentRoute.startsWith('/product/')) {
    const id = currentRoute.split('/').pop();
    renderProductPage(id);
  } else if (currentRoute === '/cart') {
    renderCartPage();
  } else {
    renderListingPage();
  }
  updateCartCount();
}

function renderListingPage() {
  if (!state.products.length) {
    app.innerHTML = '<div class="empty-state"><h2>Loading products…</h2></div>';
    return;
  }

  const cards = state.products
    .map(
      (product) => `
        <article class="card">
          <img src="${product.thumbnail}" alt="${product.title}" />
          <div class="card-body">
            <div class="card-title">${product.title}</div>
            <div class="meta">${product.category}</div>
            <div class="meta">${product.brand}</div>
            <div class="price-row">
              <span class="price">${formatCurrency(product.price)}</span>
              <button class="button view-details" data-id="${product.id}">View Details</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  app.innerHTML = `
    <section class="hero">
      <h1>Fresh picks for your wardrobe</h1>
      <p>Simple clothes and shoes for everyday style.</p>
      <p class="hero-note">Free delivery on orders above ₹5,000</p>
    </section>
    <section class="grid">${cards}</section>
  `;

  app.querySelectorAll('.view-details').forEach((button) => {
    button.addEventListener('click', () => navigate(`/product/${button.dataset.id}`));
  });
}

async function renderProductPage(id) {
  app.innerHTML = '<div class="empty-state"><h2>Loading product details…</h2></div>';

  let product = state.products.find((item) => item.id === Number(id));
  if (!product) {
    try {
      product = await fetchProduct(id);
    } catch {
      app.innerHTML = '<div class="empty-state"><h2>Product not found</h2></div>';
      return;
    }
  }

  app.innerHTML = `
    <section class="detail-layout">
      <div class="detail-card">
        <img src="${product.thumbnail}" alt="${product.title}" />
      </div>
      <div class="detail-card">
        <span class="badge">${product.category}</span>
        <h1>${product.title}</h1>
        <p>${product.description}</p>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p><strong>Rating:</strong> ${product.rating} / 5</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p class="price-large">${formatCurrency(product.price)}</p>
        <div class="price-row" style="margin-top: 1rem;">
          <button class="button add-to-cart" data-id="${product.id}">Add to Cart</button>
          <button class="secondary-button" onclick="navigate('/')">Back to Store</button>
        </div>
      </div>
    </section>
  `;

  app.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product);
    navigate('/cart');
  });
}

function addToCart(product) {
  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    });
  }
  saveCart();
}

function changeQuantity(id, delta) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== id);
  }
  saveCart();
  renderCartPage();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((entry) => entry.id !== id);
  saveCart();
  renderCartPage();
}

function renderCartPage() {
  if (!state.cart.length) {
    app.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add products from the listing page to see them here.</p>
        <button class="button" onclick="navigate('/')">Continue Shopping</button>
      </div>
    `;
    return;
  }

  const itemsMarkup = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.thumbnail}" alt="${item.title}" />
          <div style="flex: 1;">
            <h3>${item.title}</h3>
            <p>${formatCurrency(item.price)} each</p>
            <div class="qty-controls">
              <button data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-id="${item.id}">+</button>
            </div>
            <p><strong>Subtotal:</strong> ${formatCurrency(item.price * item.quantity)}</p>
          </div>
          <button class="secondary-button" data-action="remove" data-id="${item.id}">Remove</button>
        </div>
      `
    )
    .join('');

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 150;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  app.innerHTML = `
    <section class="cart-layout">
      <div>
        <h2>Your Cart</h2>
        ${itemsMarkup}
      </div>
      <aside class="summary-card">
        <h3>Bill Summary</h3>
        <div class="summary-row"><span>Items</span><span>${state.cart.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
        <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${formatCurrency(shipping)}</span></div>
        <div class="summary-row"><span>Tax</span><span>${formatCurrency(tax)}</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatCurrency(total)}</span></div>
        <p class="mini-note">${subtotal > 5000 ? 'You unlocked free shipping.' : 'Add a little more to get free shipping.'}</p>
        <button class="button" onclick="navigate('/')">Continue Shopping</button>
      </aside>
    </section>
  `;

  app.querySelectorAll('[data-action="increase"]').forEach((button) => {
    button.addEventListener('click', () => changeQuantity(Number(button.dataset.id), 1));
  });
  app.querySelectorAll('[data-action="decrease"]').forEach((button) => {
    button.addEventListener('click', () => changeQuantity(Number(button.dataset.id), -1));
  });
  app.querySelectorAll('[data-action="remove"]').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.id)));
  });
}

async function boot() {
  loadCart();
  updateCartCount();
  window.addEventListener('hashchange', render);
  try {
    await fetchProducts();
  } catch (error) {
    app.innerHTML = `<div class="empty-state"><h2>${error.message}</h2></div>`;
    return;
  }
  render();
}

boot();