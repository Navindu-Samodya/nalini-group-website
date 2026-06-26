/* =============================================
   NALINI GROUP — SHARED JAVASCRIPT
   Handles: navigation, cart sidebar, toast
   ============================================= */

// ---- Cart: Read / Write from localStorage ----

function getCart() {
  return JSON.parse(localStorage.getItem('naliniCart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('naliniCart', JSON.stringify(cart));
}

// ---- Cart: Add / Remove / Adjust ----

function addToCart(product) {
  const cart  = getCart();
  const found = cart.find(item => item.id === product.id);

  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price,
                image: product.image, quantity: 1 });
  }

  saveCart(cart);
  refreshCartUI();
  showToast(product.name + ' added to cart');
  bumpCartIcon();
}

function removeFromCart(id) {
  saveCart(getCart().filter(item => item.id !== id));
  refreshCartUI();
}

function changeQty(id, newQty) {
  if (newQty < 1) { removeFromCart(id); return; }
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.quantity = newQty;
  saveCart(cart);
  refreshCartUI();
}

function clearCart() {
  saveCart([]);
  refreshCartUI();
}

// ---- Cart: Calculations ----

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function money(amount) {
  return '₦' + amount.toLocaleString();
}

// ---- Cart: Update the whole UI ----

function refreshCartUI() {
  const cart  = getCart();
  const count = cartCount();

  // Badge on cart icon
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }

  // Items count in sidebar header
  const hcount = document.querySelector('.hcount');
  if (hcount) hcount.textContent = count + (count === 1 ? ' item' : ' items');

  // Cart total
  const amtEl = document.querySelector('.amt');
  if (amtEl) amtEl.textContent = money(cartTotal());

  // Render cart items list
  renderCartList(cart);
}

function renderCartList(cart) {
  const container = document.getElementById('cartItems');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Your cart is empty</p>
        <small>Browse our shops and add items</small>
      </div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img"
           src="${item.image}"
           alt="${item.name}"
           onerror="this.src='https://picsum.photos/seed/default/80/80'">
      <div class="cart-item-info">
        <p class="ci-name">${item.name}</p>
        <p class="ci-price">${money(item.price)}</p>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.quantity - 1})">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button class="rm-btn" onclick="removeFromCart(${item.id})" title="Remove item">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');
}

// ---- Cart Sidebar: Open / Close ----

function openCart() {
  document.querySelector('.cart-overlay').classList.add('open');
  document.querySelector('.cart-sidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
  refreshCartUI();
}

function closeCart() {
  document.querySelector('.cart-overlay').classList.remove('open');
  document.querySelector('.cart-sidebar').classList.remove('open');
  document.body.style.overflow = '';
}

// ---- Toast Notification ----

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- Cart Icon Animation ----

function bumpCartIcon() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.classList.remove('bump');
  void badge.offsetWidth; // force reflow so animation restarts
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);
}

// ---- Navigation ----

const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Highlight the current page in the nav
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentFile) link.classList.add('active');
  if (!currentFile && link.getAttribute('href') === 'index.html') link.classList.add('active');
});

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 8);
});

// ---- Scroll-fade animations (for home page cards) ----

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// ---- Wire up Cart button & sidebar controls ----

document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
document.querySelector('.close-cart')?.addEventListener('click', closeCart);

document.querySelector('.clear-btn')?.addEventListener('click', () => {
  if (confirm('Remove all items from your cart?')) clearCart();
});

document.querySelector('.checkout-btn')?.addEventListener('click', () => {
  showToast('Checkout portal coming soon!');
});

// Close modal/cart with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    document.getElementById('modalOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ---- Init ----
refreshCartUI();
