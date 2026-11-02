/**
 * AURA STUDIOS - Master Interactive JavaScript
 * Handles Slide-out Cart Drawer, Quick View Modal, Search Overlay,
 * Toast Notifications, Mobile Menu, and Wishlist toggles.
 */

// Initial Cart State
let cart = [
  {
    id: 1,
    title: "Heavyweight Oversized Hoodie",
    color: "Charcoal",
    size: "L",
    price: 140,
    qty: 1,
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Structured Minimalist Blazer",
    color: "Black",
    size: "M",
    price: 210,
    qty: 1,
    img: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=600&auto=format&fit=crop"
  }
];

const FREE_SHIPPING_THRESHOLD = 300;

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCartDrawer();
  initSearchOverlay();
  initMobileNav();
  initQuickViewModal();
  initSizeGuideModal();
  initWishlist();
  initProductSwatches();
  updateCartUI();
});

/* ==========================================================================
   Header Scroll & Active Navigation
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   Slide-out Cart Drawer System
   ========================================================================== */
function initCartDrawer() {
  const cartTriggers = document.querySelectorAll('.cart-trigger-btn, .cart-icon-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const closeBtn = document.getElementById('cartCloseBtn');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');

  if (!cartDrawer || !cartBackdrop) return;

  function openCart() {
    cartDrawer.classList.add('active');
    cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  // Bind add-to-cart global clicks
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-to-cart, .btn-quick-add');
    if (addBtn) {
      e.preventDefault();
      const productCard = addBtn.closest('[data-product-id]') || document.querySelector('.product-detail-layout');
      
      let itemToAdd;
      if (productCard) {
        const id = productCard.dataset.productId || Date.now();
        const title = productCard.dataset.productTitle || productCard.querySelector('.detail-title, .product-title')?.innerText || "Luxury Item";
        const price = parseFloat(productCard.dataset.productPrice || 140);
        const img = productCard.dataset.productImg || productCard.querySelector('img')?.src;
        const color = productCard.querySelector('.picker-selected-label')?.innerText || "Default";
        const size = productCard.querySelector('.size-btn.active, .size-pill-btn.active')?.innerText || "M";
        const qty = parseInt(productCard.querySelector('.qty-value')?.innerText || 1, 10);

        itemToAdd = { id, title, price, img, color, size, qty };
      } else {
        itemToAdd = {
          id: Date.now(),
          title: "Heavyweight Oversized Hoodie",
          price: 140,
          color: "Charcoal",
          size: "L",
          qty: 1,
          img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
        };
      }

      addItemToCart(itemToAdd);
      showToast(`Added "${itemToAdd.title}" to cart`);
      openCart();
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your bag is currently empty.');
        return;
      }
      showToast('Proceeding to encrypted luxury checkout...', 'lock');
      setTimeout(() => {
        alert('Demo Notice: This is a static client presentation preview. Order placement simulated successfully!');
      }, 700);
    });
  }
}

function addItemToCart(newItem) {
  const existing = cart.find(item => item.id == newItem.id && item.size === newItem.size && item.color === newItem.color);
  if (existing) {
    existing.qty += (newItem.qty || 1);
  } else {
    cart.push({ ...newItem, qty: newItem.qty || 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById('cartItemsList');
  const countBadges = document.querySelectorAll('.cart-count-badge');
  const drawerCount = document.getElementById('drawerItemCount');
  const subtotalEl = document.getElementById('cartSubtotalAmount');
  const progressFill = document.getElementById('shippingProgressFill');
  const shippingText = document.getElementById('shippingProgressText');
  const emptyState = document.getElementById('cartEmptyState');
  const drawerFooter = document.getElementById('cartDrawerFooter');

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update badge counters
  countBadges.forEach(badge => badge.innerText = totalCount);
  if (drawerCount) drawerCount.innerText = `(${totalCount})`;
  if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;

  // Shipping progress calculation
  if (progressFill && shippingText) {
    const diff = FREE_SHIPPING_THRESHOLD - subtotal;
    const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    progressFill.style.width = `${pct}%`;

    if (diff <= 0) {
      shippingText.innerHTML = `<span>Unlocked!</span> You qualify for Free Worldwide Express Shipping!`;
    } else {
      shippingText.innerHTML = `Add <span>$${diff.toFixed(2)}</span> more for Free Express Shipping!`;
    }
  }

  // Render items
  if (container) {
    if (cart.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      if (drawerFooter) drawerFooter.style.display = 'none';
    } else {
      container.style.display = 'flex';
      if (emptyState) emptyState.style.display = 'none';
      if (drawerFooter) drawerFooter.style.display = 'block';

      container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
          <img src="${item.img}" alt="${item.title}" class="cart-item-thumb">
          <div class="cart-item-details">
            <div class="cart-item-header">
              <span class="cart-item-name">${item.title}</span>
              <button class="cart-item-remove" onclick="removeCartItem(${index})" title="Remove item">&times;</button>
            </div>
            <div class="cart-item-meta">${item.color} / ${item.size}</div>
            <div class="cart-item-bottom">
              <div class="cart-stepper">
                <button class="cart-stepper-btn" onclick="updateItemQty(${index}, -1)">-</button>
                <span class="cart-stepper-val">${item.qty}</span>
                <button class="cart-stepper-btn" onclick="updateItemQty(${index}, 1)">+</button>
              </div>
              <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

window.updateItemQty = function(index, change) {
  if (!cart[index]) return;
  cart[index].qty += change;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
};

window.removeCartItem = function(index) {
  if (!cart[index]) return;
  const removed = cart.splice(index, 1);
  updateCartUI();
  if (removed[0]) {
    showToast(`Removed "${removed[0].title}" from cart`);
  }
};

/* ==========================================================================
   Search Overlay
   ========================================================================== */
function initSearchOverlay() {
  const trigger = document.querySelector('.search-trigger-btn');
  const overlay = document.getElementById('searchOverlay');
  const closeBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('searchInput');

  if (!overlay) return;

  function openSearch() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 150);
  }

  function closeSearch() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (trigger) trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openSearch();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeSearch();
    }
  });

  // Handle trending search tags click
  document.querySelectorAll('.search-tag-item').forEach(tag => {
    tag.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = tag.innerText;
        window.location.href = `shop.html?search=${encodeURIComponent(tag.innerText)}`;
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        window.location.href = `shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }
}

/* ==========================================================================
   Mobile Nav Drawer
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!toggle || !drawer) return;

  function openMenu() {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
}

/* ==========================================================================
   Quick View Modal
   ========================================================================== */
function initQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  const closeBtn = document.getElementById('quickViewClose');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Delegate Quick View triggers
  document.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('.btn-quick-view');
    if (qvBtn) {
      e.preventDefault();
      const card = qvBtn.closest('.product-card');
      if (!card) return;

      const title = card.querySelector('.product-title a')?.innerText || "Minimalist Item";
      const price = card.querySelector('.product-price')?.innerText || "$140.00";
      const oldPrice = card.querySelector('.product-price-old')?.innerText || "";
      const img = card.querySelector('.product-img-primary')?.src || "";
      const category = card.querySelector('.product-category-meta')?.innerText || "Studio Essentials";

      // Populate Quick View
      const qvImg = document.getElementById('qvModalImage');
      const qvTitle = document.getElementById('qvModalTitle');
      const qvPrice = document.getElementById('qvModalPrice');
      const qvOldPrice = document.getElementById('qvModalOldPrice');
      const qvCat = document.getElementById('qvModalCategory');
      const qvLink = document.getElementById('qvModalProductLink');

      if (qvImg) qvImg.src = img;
      if (qvTitle) qvTitle.innerText = title;
      if (qvPrice) qvPrice.innerText = price;
      if (qvOldPrice) qvOldPrice.innerText = oldPrice;
      if (qvCat) qvCat.innerText = category;
      if (qvLink) qvLink.href = 'product-detail.html';

      // Set dataset for adding to cart
      const modalBox = modal.querySelector('.quick-view-modal');
      if (modalBox) {
        modalBox.dataset.productTitle = title;
        modalBox.dataset.productPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 140;
        modalBox.dataset.productImg = img;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Size buttons inside quick view
  const qvSizes = modal.querySelectorAll('.size-btn');
  qvSizes.forEach(btn => {
    btn.addEventListener('click', () => {
      qvSizes.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* ==========================================================================
   Size Guide Modal
   ========================================================================== */
function initSizeGuideModal() {
  const triggers = document.querySelectorAll('.size-guide-trigger');
  const modal = document.getElementById('sizeGuideModal');
  const closeBtn = document.getElementById('sizeGuideClose');

  if (!modal) return;

  function openGuide() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGuide() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggers.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    openGuide();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeGuide);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGuide();
  });
}

/* ==========================================================================
   Wishlist Toggle
   ========================================================================== */
function initWishlist() {
  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      wishBtn.classList.toggle('active');
      const isLoved = wishBtn.classList.contains('active');
      const card = wishBtn.closest('.product-card');
      const title = card ? card.querySelector('.product-title')?.innerText : "Item";
      
      showToast(isLoved ? `Saved "${title}" to your wishlist.` : `Removed "${title}" from wishlist.`, 'heart');
    }
  });
}

/* ==========================================================================
   Product Color Swatches Active State
   ========================================================================== */
function initProductSwatches() {
  document.addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch-dot');
    if (swatch) {
      const parent = swatch.closest('.product-swatches');
      if (parent) {
        parent.querySelectorAll('.swatch-dot').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        // Optional: change image if swatch has data-img
        const newImg = swatch.dataset.img;
        const card = swatch.closest('.product-card');
        if (newImg && card) {
          const primaryImg = card.querySelector('.product-img-primary');
          if (primaryImg) primaryImg.src = newImg;
        }
      }
    }
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'check') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconSvg = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;
  
  if (type === 'heart') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>`;
  } else if (type === 'lock') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 3200);
}
