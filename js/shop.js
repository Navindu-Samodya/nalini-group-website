/* =============================================
   NALINI GROUP — SHOP JAVASCRIPT
   Handles: product data, grid, filters, search, modal
   Depends on: main.js (must be loaded first)
   ============================================= */

// ---- Product cache — populated at runtime by loadShopFromAPI() ----
const PRODUCTS = {};

// ---- Shop State ----

let currentShop  = '';
let activeFilter = 'All';
let searchQuery  = '';
let openProduct  = null; // product shown in modal

// ---- Detect which shop page we're on ----

function detectShop() {
  const page = window.location.pathname.split('/').pop();
  if (page === 'studio.html')   return 'studio';
  if (page === 'eshop.html')    return 'eshop';
  if (page === 'bookshop.html') return 'bookshop';
  return '';
}

// ---- Build star string from numeric rating ----

function stars(rating) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

// ---- Render the product grid ----

function renderProducts() {
  const list = PRODUCTS[currentShop] || [];
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  // Apply category filter and search
  const visible = list.filter(p => {
    const catMatch    = activeFilter === 'All' || p.category === activeFilter;
    const searchMatch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery);
    return catMatch && searchMatch;
  });

  // Update results count label
  const countEl = document.getElementById('resultsCount');
  if (countEl) countEl.textContent = visible.length + (visible.length === 1 ? ' product' : ' products');

  // Empty state
  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No products found</p>
        <small>Try a different search term or filter</small>
      </div>`;
    return;
  }

  // Render cards
  grid.innerHTML = visible.map(p => `
    <div class="product-card" onclick="showModal(${p.id})">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/placeholder/400/400'">
        <span class="product-badge">${p.category}</span>
        <div class="product-overlay">
          <button class="quick-view-btn">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-cat">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${stars(p.rating)}</span>
          <span class="count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <span class="product-price"><span class="cur">LKR</span>&nbsp;${p.price.toLocaleString()}</span>
          <button class="add-btn" id="btn-${p.id}"
                  onclick="handleAdd(event, ${p.id})" title="Add to cart">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- Add-to-cart from grid (with button feedback) ----

function handleAdd(event, productId) {
  event.stopPropagation(); // Don't open the modal

  const product = PRODUCTS[currentShop].find(p => p.id === productId);
  if (!product) return;

  addToCart(product); // defined in main.js

  // Show tick on the button briefly
  const btn = document.getElementById('btn-' + productId);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="fas fa-plus"></i>';
    }, 1500);
  }
}

// ---- Product Modal ----

function showModal(productId) {
  const product = PRODUCTS[currentShop].find(p => p.id === productId);
  if (!product) return;
  openProduct = product;

  document.getElementById('modalImg').src         = product.image;
  document.getElementById('modalImg').alt         = product.name;
  document.getElementById('modalCat').textContent = product.category;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalRating').innerHTML =
    `<span>${stars(product.rating)}</span> <span class="r-count">${product.rating} (${product.reviews} reviews)</span>`;
  document.getElementById('modalPrice').textContent = 'LKR ' + product.price.toLocaleString();
  document.getElementById('modalDesc').textContent  = product.description;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  openProduct = null;
}

// ---- Category Filters ----

function buildFilters() {
  const list       = PRODUCTS[currentShop] || [];
  const categories = ['All', ...new Set(list.map(p => p.category))];
  const container  = document.getElementById('filterBtns');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === 'All' ? 'active' : ''}"
            onclick="setFilter('${cat}')">${cat}</button>
  `).join('');
}

function setFilter(category) {
  activeFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === category);
  });
  renderProducts();
}

// ---- Initialise the shop ----

function initShop() {
  currentShop = detectShop();
  if (!currentShop) return;

  // Wire up all event listeners first — they don't depend on product data
  document.getElementById('searchInput')?.addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });
  document.getElementById('modalClose')?.addEventListener('click', hideModal);
  document.getElementById('modalOverlay')?.addEventListener('click', e => {
    if (e.target.id === 'modalOverlay') hideModal();
  });
  document.getElementById('modalAddBtn')?.addEventListener('click', () => {
    if (openProduct) { addToCart(openProduct); hideModal(); }
  });

  loadShopFromAPI(currentShop);
}

// ---- Fetch shop products from the backend API ----

function loadShopFromAPI(shop) {
  const grid = document.getElementById('productGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="shop-loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading products…</p>
      </div>`;
  }

  fetch('/api/products?shop=' + shop)
    .then(res => {
      if (!res.ok) throw new Error('Server responded with ' + res.status);
      return res.json();
    })
    .then(data => {
      PRODUCTS[shop] = data.products;
      buildFilters();
      renderProducts();
    })
    .catch(() => {
      if (!grid) return;
      grid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-exclamation-circle"></i>
          <p>Could not load products</p>
          <small>Please check your connection and refresh the page</small>
        </div>`;
    });
}

document.addEventListener('DOMContentLoaded', initShop);
