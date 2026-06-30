/* =============================================
   NALINI GROUP — ADMIN JS
   Order list, detail view, status update
   ============================================= */

const VALID_STATUSES = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];

let currentOrderId = null;

// ---- Utility ----

function money(amount) {
  return 'LKR ' + Number(amount).toLocaleString();
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })
       + ' ' + d.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' });
}

function statusBadge(status) {
  return `<span class="sbadge sbadge-${escHtml(status)}">${escHtml(status)}</span>`;
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- Load & render orders ----

async function loadOrders() {
  const elLoading = document.getElementById('stateLoading');
  const elEmpty   = document.getElementById('stateEmpty');
  const elTable   = document.getElementById('tableWrap');
  const elBody    = document.getElementById('ordersBody');
  const elChips   = document.getElementById('statChips');
  const elBanner  = document.getElementById('pageBanner');

  elLoading.style.display = 'block';
  elEmpty.style.display   = 'none';
  elTable.style.display   = 'none';
  elBanner.className      = 'page-banner';
  elBanner.textContent    = '';

  try {
    const res  = await fetch('/api/orders');
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load orders');

    const orders = data.orders;

    renderStatChips(orders, elChips);

    if (orders.length === 0) {
      elEmpty.style.display = 'block';
    } else {
      elBody.innerHTML      = orders.map(renderRow).join('');
      elTable.style.display = 'block';
    }

  } catch (err) {
    elBanner.className   = 'page-banner error';
    elBanner.textContent = 'Could not load orders: ' + err.message;
  } finally {
    elLoading.style.display = 'none';
  }
}

function renderStatChips(orders, container) {
  const counts = {};
  VALID_STATUSES.forEach(s => { counts[s] = 0; });
  orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });

  const icons = {
    pending:    'fa-clock',
    confirmed:  'fa-check',
    processing: 'fa-cog',
    completed:  'fa-check-double',
    cancelled:  'fa-times-circle',
  };

  container.innerHTML = `
    <div class="stat-chip"><i class="fas fa-list-alt"></i> Total <strong>${orders.length}</strong></div>
    ${VALID_STATUSES.map(s => `
      <div class="stat-chip">
        <i class="fas ${icons[s]}"></i>
        ${s.charAt(0).toUpperCase() + s.slice(1)} <strong>${counts[s]}</strong>
      </div>
    `).join('')}
  `;
}

function renderRow(order) {
  return `
    <tr>
      <td><span class="td-order-num">${escHtml(order.order_number)}</span></td>
      <td><div class="td-name">${escHtml(order.customer_name)}</div></td>
      <td>${escHtml(order.customer_phone || '—')}</td>
      <td>${escHtml(order.customer_email)}</td>
      <td class="td-total">${money(order.total_lkr)}</td>
      <td>${statusBadge(order.status)}</td>
      <td class="td-date">${formatDate(order.created_at)}</td>
      <td>
        <button class="view-btn" data-id="${order.id}">
          <i class="fas fa-eye"></i> View
        </button>
      </td>
    </tr>
  `;
}

// ---- Open detail modal ----

async function openDetail(orderId) {
  currentOrderId = orderId;

  const overlay  = document.getElementById('adminOverlay');
  const elNum    = document.getElementById('modalOrderNum');
  const elBody   = document.getElementById('modalBody');

  elNum.textContent = '';
  elBody.innerHTML  = `
    <div class="modal-state loading">
      <i class="fas fa-spinner fa-spin"></i>
      Loading order&hellip;
    </div>`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    const res  = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load order');

    renderDetail(data.order);
  } catch (err) {
    elNum.textContent = 'Error';
    elBody.innerHTML  = `
      <div class="modal-state error">
        <i class="fas fa-exclamation-triangle"></i>
        ${escHtml(err.message)}
      </div>`;
  }
}

function renderDetail(order) {
  document.getElementById('modalOrderNum').textContent = order.order_number;

  const statusOpts = VALID_STATUSES.map(s =>
    `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
  ).join('');

  const itemRows = order.items.map(item => `
    <tr>
      <td>
        <div class="item-name">${escHtml(item.product_name)}</div>
        <span class="shop-tag">${escHtml(item.shop)}</span>
      </td>
      <td class="td-num">${item.quantity}</td>
      <td class="td-num">${money(item.unit_price)}</td>
      <td class="td-num">${money(item.line_total)}</td>
    </tr>
  `).join('');

  document.getElementById('modalBody').innerHTML = `

    <!-- Status update -->
    <div class="status-update-row">
      <label for="statusSelect">Status</label>
      ${statusBadge(order.status)}
      <select class="status-select" id="statusSelect">${statusOpts}</select>
      <button class="status-update-btn" id="statusUpdateBtn">Update</button>
      <span class="status-update-msg" id="statusMsg"></span>
    </div>

    <!-- Customer -->
    <div class="detail-section">
      <p class="detail-section-label"><i class="fas fa-user"></i> Customer</p>
      <div class="cust-grid">
        <div class="cust-field">
          <label>Name</label>
          <span>${escHtml(order.customer_name)}</span>
        </div>
        <div class="cust-field">
          <label>Email</label>
          <span>${escHtml(order.customer_email)}</span>
        </div>
        <div class="cust-field">
          <label>Phone</label>
          <span>${escHtml(order.customer_phone || '—')}</span>
        </div>
        <div class="cust-field" style="grid-column:1/-1">
          <label>Address</label>
          <span>${escHtml(order.customer_address || '—')}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="detail-section">
      <p class="detail-section-label"><i class="fas fa-sticky-note"></i> Notes</p>
      ${order.notes
        ? `<div class="notes-box">${escHtml(order.notes)}</div>`
        : `<p class="no-notes">No notes provided.</p>`}
    </div>

    <!-- Items -->
    <div class="detail-section">
      <p class="detail-section-label"><i class="fas fa-shopping-bag"></i> Items</p>
      <div class="items-table-wrap">
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align:right">Qty</th>
              <th style="text-align:right">Unit Price</th>
              <th style="text-align:right">Line Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>
      <div class="items-total-row">
        <span class="lbl">Order Total</span>
        <span class="amt">${money(order.total_lkr)}</span>
      </div>
    </div>

  `;
}

// ---- Update status ----

async function updateStatus() {
  if (!currentOrderId) return;

  const select = document.getElementById('statusSelect');
  const btn    = document.getElementById('statusUpdateBtn');
  const msg    = document.getElementById('statusMsg');
  const status = select.value;

  btn.disabled    = true;
  msg.className   = 'status-update-msg';
  msg.textContent = 'Saving…';

  try {
    const res  = await fetch(`/api/orders/${currentOrderId}/status`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Update failed');

    msg.className   = 'status-update-msg ok';
    msg.textContent = 'Status updated.';

    // Refresh badge inside modal
    const modalBadge = document.querySelector('.status-update-row .sbadge');
    if (modalBadge) {
      modalBadge.className   = `sbadge sbadge-${status}`;
      modalBadge.textContent = status;
    }

    // Refresh badge in the table row (no full reload needed)
    const rowBtn = document.querySelector(`#ordersBody .view-btn[data-id="${currentOrderId}"]`);
    const rowBadge = rowBtn?.closest('tr')?.querySelector('.sbadge');
    if (rowBadge) {
      rowBadge.className   = `sbadge sbadge-${status}`;
      rowBadge.textContent = status;
    }

  } catch (err) {
    msg.className   = 'status-update-msg err';
    msg.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
}

// ---- Close modal ----

function closeModal() {
  document.getElementById('adminOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentOrderId = null;
}

// ---- Event delegation ----

// View button in orders table
document.getElementById('ordersBody').addEventListener('click', e => {
  const btn = e.target.closest('.view-btn');
  if (btn) openDetail(Number(btn.dataset.id));
});

// Update status button inside modal (rendered dynamically)
document.getElementById('adminModal').addEventListener('click', e => {
  if (e.target.closest('#statusUpdateBtn')) updateStatus();
});

// Close modal
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
document.getElementById('adminOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('adminOverlay')) closeModal();
});

// Refresh
document.getElementById('refreshBtn').addEventListener('click', loadOrders);

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ---- Init ----
loadOrders();
