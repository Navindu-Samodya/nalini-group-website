/* =============================================
   NALINI GROUP — SHOP JAVASCRIPT
   Handles: product data, grid, filters, search, modal
   Depends on: main.js (must be loaded first)
   ============================================= */

// ---- Product Catalog ----
// Each product: id, name, price (LKR), category, rating, reviews, description, image

const PRODUCTS = {

  studio: [
    { id:101, name:'Professional Portrait Session', price:25000, category:'Sessions',
      rating:4.9, reviews:42,
      description:'A 2-hour professional portrait session with our expert photographers. Includes 10 edited digital images delivered within 48 hours in a private online gallery.',
      image:'https://picsum.photos/seed/studio-portrait/400/400' },

    { id:102, name:'Corporate Photography Package', price:50000, category:'Sessions',
      rating:4.8, reviews:28,
      description:'Complete corporate photography package including team headshots, office environment shots, and product images. Up to 4 hours of shooting time.',
      image:'https://picsum.photos/seed/studio-corporate/400/400' },

    { id:103, name:'Wedding Photography — Full Day', price:150000, category:'Packages',
      rating:5.0, reviews:15,
      description:'Full wedding day coverage from preparation to reception. Two photographers, 300+ edited photos, and a luxury photo album included.',
      image:'https://picsum.photos/seed/studio-wedding/400/400' },

    { id:104, name:'Passport Photographs (6 pcs)', price:2000, category:'Prints',
      rating:4.7, reviews:120,
      description:'Standard passport-size photographs — 6 high-quality copies ready within 30 minutes. Meets all official Sri Lankan and international requirements.',
      image:'https://picsum.photos/seed/studio-passport/400/400' },

    { id:105, name:'Canvas Print 20×24 inch', price:12000, category:'Prints',
      rating:4.6, reviews:55,
      description:'Gallery-quality canvas print of your favourite photo. Stretched on a solid wood frame and ready to hang. Vivid, fade-resistant archival inks.',
      image:'https://picsum.photos/seed/studio-canvas/400/400' },

    { id:106, name:'Framed Photo Print A3', price:7500, category:'Prints',
      rating:4.5, reviews:38,
      description:'Premium A3 photo print in an elegant hardwood frame with anti-glare glass. Perfect for home decor or a heartfelt gift.',
      image:'https://picsum.photos/seed/studio-frame/400/400' },

    { id:107, name:'Baby & Family Photography', price:35000, category:'Sessions',
      rating:4.9, reviews:22,
      description:'Capture precious family moments in our warm, child-friendly studio. 3-hour session with themed props. 50 edited digital images delivered.',
      image:'https://picsum.photos/seed/studio-family/400/400' },

    { id:108, name:'Premium Photo Album (30 pages)', price:20000, category:'Packages',
      rating:4.8, reviews:30,
      description:'Lay-flat premium photo album, 30 double-page spreads with professional layout design. Hardcover, matte or gloss finish available.',
      image:'https://picsum.photos/seed/studio-album/400/400' },
  ],

  eshop: [
    { id:201, name:'Wireless Bluetooth Earbuds', price:15000, category:'Electronics',
      rating:4.7, reviews:89,
      description:'True wireless earbuds with active noise cancellation. 8-hour playback + 24h charging case. IPX5 water-resistant. Compatible with all Bluetooth devices.',
      image:'https://picsum.photos/seed/eshop-earbuds/400/400' },

    { id:202, name:'Premium Laptop Bag 15.6"', price:12000, category:'Bags',
      rating:4.6, reviews:64,
      description:'Water-resistant polyester laptop bag with padded laptop sleeve, multiple organiser pockets, and ergonomic shoulder strap. Fits laptops up to 15.6 inches.',
      image:'https://picsum.photos/seed/eshop-laptopbag/400/400' },

    { id:203, name:'Smart Watch Pro', price:35000, category:'Electronics',
      rating:4.8, reviews:47,
      description:'Full-featured smartwatch with heart rate, SpO2, sleep tracking, GPS, and 7-day battery. Water-resistant to 50m. Works with Android and iOS.',
      image:'https://picsum.photos/seed/eshop-watch/400/400' },

    { id:204, name:'USB-C Hub 7-in-1', price:18000, category:'Electronics',
      rating:4.5, reviews:55,
      description:'Expand your laptop connectivity: HDMI 4K, 3× USB-A, SD & microSD card slots, and USB-C Power Delivery. Plug-and-play, no drivers needed.',
      image:'https://picsum.photos/seed/eshop-usbhub/400/400' },

    { id:205, name:'Power Bank 20,000mAh', price:22000, category:'Electronics',
      rating:4.7, reviews:103,
      description:'High-capacity power bank with 22.5W fast charging. Charges 3 devices simultaneously via USB-A × 2 and USB-C. LED power indicator.',
      image:'https://picsum.photos/seed/eshop-powerbank/400/400' },

    { id:206, name:'Ergonomic Office Chair', price:55000, category:'Office',
      rating:4.6, reviews:28,
      description:'Breathable mesh back with lumbar support, adjustable armrests, seat height, and tilt tension. Built for all-day comfort. Max load: 120kg.',
      image:'https://picsum.photos/seed/eshop-chair/400/400' },

    { id:207, name:'LED Desk Lamp', price:8500, category:'Office',
      rating:4.5, reviews:76,
      description:'Adjustable colour temperature (warm to cool) and 5 brightness levels. Built-in USB-A charging port. Flicker-free, eye-care technology.',
      image:'https://picsum.photos/seed/eshop-lamp/400/400' },

    { id:208, name:'Premium Travel Backpack', price:28000, category:'Bags',
      rating:4.7, reviews:42,
      description:'Durable 30L backpack with dedicated laptop compartment, hidden anti-theft pocket, USB charging port pass-through, and rain cover included.',
      image:'https://picsum.photos/seed/eshop-backpack/400/400' },
  ],

  bookshop: [
    { id:301, name:'Things Fall Apart', price:3500, category:'Fiction',
      rating:4.9, reviews:200,
      description:"Chinua Achebe's timeless masterpiece. Explores the life of Okonkwo and the devastating impact of British colonialism on traditional Igbo society. A cornerstone of African literature.",
      image:'https://picsum.photos/seed/book-thingsfall/400/400' },

    { id:302, name:'Purple Hibiscus', price:4000, category:'Fiction',
      rating:4.8, reviews:150,
      description:"Chimamanda Ngozi Adichie's debut novel about family, freedom, and faith in post-colonial Nigeria. A story of beauty, courage, and the quest for independence.",
      image:'https://picsum.photos/seed/book-hibiscus/400/400' },

    { id:303, name:'Half of a Yellow Sun', price:4500, category:'Fiction',
      rating:4.9, reviews:135,
      description:'Set against the backdrop of the Nigerian Civil War, Adichie traces five lives through one of Africa\'s most turbulent and heartbreaking periods.',
      image:'https://picsum.photos/seed/book-yellowsun/400/400' },

    { id:304, name:'Rich Dad Poor Dad', price:4500, category:'Non-Fiction',
      rating:4.7, reviews:320,
      description:"Robert Kiyosaki's classic guide to financial literacy, the mindset behind wealth-building, and why the school system fails to teach money management.",
      image:'https://picsum.photos/seed/book-richdad/400/400' },

    { id:305, name:'The 48 Laws of Power', price:5500, category:'Non-Fiction',
      rating:4.6, reviews:280,
      description:"Robert Greene's definitive guide to power dynamics, influence, and social strategy. Illustrated with historical examples. Essential reading for ambitious individuals.",
      image:'https://picsum.photos/seed/book-48laws/400/400' },

    { id:306, name:"O/L Mathematics Past Papers", price:2500, category:'Academic',
      rating:4.8, reviews:450,
      description:"Comprehensive G.C.E. Ordinary Level Mathematics past papers with fully worked solutions from 2010–2024. The #1 exam prep resource for O/L candidates across Sri Lanka.",
      image:'https://picsum.photos/seed/book-waec/400/400' },

    { id:307, name:"A/L Combined Maths Study Guide", price:3000, category:'Academic',
      rating:4.7, reviews:380,
      description:"All-topic G.C.E. Advanced Level Combined Mathematics guide with thousands of practice questions, timed mock tests, and detailed answer explanations for Sri Lankan A/L students.",
      image:'https://picsum.photos/seed/book-jamb/400/400' },

    { id:308, name:"My First ABC — Children's Book", price:1800, category:"Children's",
      rating:4.9, reviews:95,
      description:'Beautifully illustrated full-colour alphabet book for children aged 3–6. Large, friendly print with fun activities on every page. A perfect first book.',
      image:'https://picsum.photos/seed/book-abc/400/400' },
  ],

};

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

  // Book Shop loads from the API; Studio and E-Shop use local data as before
  if (currentShop === 'bookshop') {
    loadBookshopFromAPI();
  } else {
    buildFilters();
    renderProducts();
  }
}

// ---- Fetch Book Shop products from the backend API ----

function loadBookshopFromAPI() {
  const grid = document.getElementById('productGrid');
  if (grid) {
    grid.innerHTML = `
      <div class="shop-loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading books…</p>
      </div>`;
  }

  fetch('/api/products?shop=bookshop')
    .then(res => {
      if (!res.ok) throw new Error('Server responded with ' + res.status);
      return res.json();
    })
    .then(data => {
      PRODUCTS.bookshop = data.products;
      buildFilters();
      renderProducts();
    })
    .catch(() => {
      if (!grid) return;
      grid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-exclamation-circle"></i>
          <p>Could not load books</p>
          <small>Please check your connection and refresh the page</small>
        </div>`;
    });
}

document.addEventListener('DOMContentLoaded', initShop);
