/**
 * AURA STUDIOS - Shop / Catalog Filtering & Sorting Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initShopFilters();
});

function initShopFilters() {
  const productCards = Array.from(document.querySelectorAll('.products-grid .product-card'));
  const categoryCheckboxes = document.querySelectorAll('.filter-category-checkbox');
  const sizePills = document.querySelectorAll('.size-filter-grid .size-pill-btn');
  const colorDots = document.querySelectorAll('.color-filter-list .color-filter-dot');
  const sortSelect = document.getElementById('shopSortSelect');
  const productCountDisplay = document.getElementById('shopProductCount');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const mobileFilterToggle = document.getElementById('mobileFilterToggle');
  const filterSidebar = document.querySelector('.filter-sidebar');

  // Check URL search parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    const pageTitle = document.querySelector('.page-banner .section-title');
    if (pageTitle) pageTitle.innerText = `Search: "${searchQuery}"`;
  }

  function applyFilters() {
    // Selected categories
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    // Selected size
    const activeSizeBtn = document.querySelector('.size-filter-grid .size-pill-btn.active');
    const selectedSize = activeSizeBtn ? activeSizeBtn.dataset.size : null;

    // Selected color
    const activeColorDot = document.querySelector('.color-filter-list .color-filter-dot.active');
    const selectedColor = activeColorDot ? activeColorDot.dataset.color.toLowerCase() : null;

    let visibleCount = 0;

    productCards.forEach(card => {
      const cardCat = (card.dataset.category || '').toLowerCase();
      const cardSizes = (card.dataset.sizes || '').split(',');
      const cardColors = (card.dataset.colors || '').toLowerCase();
      const cardTitle = (card.dataset.productTitle || card.querySelector('.product-title')?.innerText || '').toLowerCase();

      let matchCategory = selectedCategories.length === 0 || selectedCategories.includes(cardCat);
      let matchSize = !selectedSize || cardSizes.includes(selectedSize);
      let matchColor = !selectedColor || cardColors.includes(selectedColor);
      let matchSearch = !searchQuery || cardTitle.includes(searchQuery.toLowerCase());

      if (matchCategory && matchSize && matchColor && matchSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (productCountDisplay) {
      productCountDisplay.innerText = `${visibleCount} Product${visibleCount === 1 ? '' : 's'}`;
    }

    applySorting();
  }

  function applySorting() {
    if (!sortSelect) return;
    const sortVal = sortSelect.value;
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const visibleCards = productCards.filter(c => c.style.display !== 'none');

    visibleCards.sort((a, b) => {
      const priceA = parseFloat(a.dataset.productPrice || 0);
      const priceB = parseFloat(b.dataset.productPrice || 0);
      const dateA = parseInt(a.dataset.dateAdded || 0, 10);
      const dateB = parseInt(b.dataset.dateAdded || 0, 10);

      if (sortVal === 'price-low') {
        return priceA - priceB;
      } else if (sortVal === 'price-high') {
        return priceB - priceA;
      } else if (sortVal === 'newest') {
        return dateB - dateA;
      }
      return 0; // featured default order
    });

    visibleCards.forEach(card => grid.appendChild(card));
  }

  // Bind category checkboxes
  categoryCheckboxes.forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  // Bind size filter pills
  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.classList.contains('active')) {
        pill.classList.remove('active');
      } else {
        sizePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }
      applyFilters();
    });
  });

  // Bind color filter dots
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      if (dot.classList.contains('active')) {
        dot.classList.remove('active');
      } else {
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      }
      applyFilters();
    });
  });

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', applySorting);
  }

  // Clear filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      categoryCheckboxes.forEach(cb => cb.checked = false);
      sizePills.forEach(p => p.classList.remove('active'));
      colorDots.forEach(d => d.classList.remove('active'));
      if (sortSelect) sortSelect.value = 'featured';
      if (searchQuery) {
        window.location.href = 'shop.html';
      } else {
        applyFilters();
      }
    });
  }

  // Mobile filter collapse toggle
  if (mobileFilterToggle && filterSidebar) {
    mobileFilterToggle.addEventListener('click', () => {
      const isVisible = filterSidebar.style.display === 'flex';
      filterSidebar.style.display = isVisible ? 'none' : 'flex';
    });
  }

  // Initial filter run
  applyFilters();
}
