/**
 * AURA STUDIOS - Product Detail Page Interactivity
 * Handles gallery thumbnail switcher, color/size pickers, quantity stepper,
 * and collapsible accordion tabs.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductGallery();
  initColorAndSizePickers();
  initQuantityStepper();
  initAccordions();
});

/* ==========================================================================
   Product Gallery Switcher
   ========================================================================== */
function initProductGallery() {
  const thumbs = document.querySelectorAll('.gallery-thumbs .thumb-item');
  const mainImg = document.getElementById('mainGalleryImage');

  if (!mainImg || thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.dataset.fullImg || thumb.querySelector('img').src;
      mainImg.style.opacity = '0.3';
      setTimeout(() => {
        mainImg.src = newSrc;
        mainImg.style.opacity = '1';
      }, 150);
    });
  });
}

/* ==========================================================================
   Color & Size Selectors
   ========================================================================== */
function initColorAndSizePickers() {
  // Color selection
  const colorSwatches = document.querySelectorAll('.detail-color-options .detail-color-swatch');
  const selectedColorLabel = document.getElementById('selectedColorName');
  const mainImg = document.getElementById('mainGalleryImage');

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const colorName = swatch.dataset.colorName;
      if (selectedColorLabel && colorName) {
        selectedColorLabel.innerText = colorName;
      }

      const swatchImg = swatch.dataset.img;
      if (mainImg && swatchImg) {
        mainImg.src = swatchImg;
      }
    });
  });

  // Size selection
  const sizeBtns = document.querySelectorAll('.detail-size-options .size-btn');
  const selectedSizeLabel = document.getElementById('selectedSizeName');

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (selectedSizeLabel) {
        selectedSizeLabel.innerText = btn.innerText;
      }
    });
  });
}

/* ==========================================================================
   Quantity Stepper
   ========================================================================== */
function initQuantityStepper() {
  const minusBtn = document.getElementById('qtyMinus');
  const plusBtn = document.getElementById('qtyPlus');
  const qtyVal = document.getElementById('qtyVal');

  if (!minusBtn || !plusBtn || !qtyVal) return;

  minusBtn.addEventListener('click', () => {
    let current = parseInt(qtyVal.innerText, 10);
    if (current > 1) {
      qtyVal.innerText = current - 1;
    }
  });

  plusBtn.addEventListener('click', () => {
    let current = parseInt(qtyVal.innerText, 10);
    if (current < 10) {
      qtyVal.innerText = current + 1;
    }
  });

  const buyNowBtn = document.getElementById('btnBuyNow');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const title = document.querySelector('.detail-title')?.innerText || "Heavyweight Oversized Hoodie";
      const size = document.querySelector('.detail-size-options .size-btn.active')?.innerText || "L";
      const color = document.getElementById('selectedColorName')?.innerText || "Charcoal";
      
      const cartDrawer = document.getElementById('cartDrawer');
      const cartBackdrop = document.getElementById('cartBackdrop');
      
      // Add and open checkout
      if (window.addItemToCart) {
        window.addItemToCart({
          id: 1,
          title: title,
          price: 140,
          color: color,
          size: size,
          qty: parseInt(qtyVal.innerText, 10),
          img: document.getElementById('mainGalleryImage')?.src
        });
      }

      if (cartDrawer && cartBackdrop) {
        cartDrawer.classList.add('active');
        cartBackdrop.classList.add('active');
      }

      setTimeout(() => {
        alert(`Proceeding directly to Express Checkout for: ${title} (${color} / ${size})`);
      }, 500);
    });
  }
}

/* ==========================================================================
   Accordion Tabs
   ========================================================================== */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    // Check if initially active
    if (item.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px';
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close other accordions for clean UX
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = '0px';
      });

      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}
