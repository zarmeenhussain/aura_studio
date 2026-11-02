/**
 * AURA STUDIOS - Lookbook Editorial Script
 * Handles capsule filter tabs, interactive hotspots, and mobile touch events.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLookbookCapsules();
  initHotspots();
});

function initLookbookCapsules() {
  const filterBtns = document.querySelectorAll('.capsule-filter-btn');
  const lookbookItems = document.querySelectorAll('.lookbook-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.capsule;

      lookbookItems.forEach(item => {
        if (filter === 'all' || item.dataset.capsule === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initHotspots() {
  const pins = document.querySelectorAll('.hotspot-pin');

  pins.forEach(pin => {
    // Mobile tap support: click to toggle active popover
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const popover = pin.querySelector('.hotspot-popover');
      if (popover) {
        const isCurrentOpen = popover.classList.contains('active');
        document.querySelectorAll('.hotspot-popover').forEach(p => p.classList.remove('active'));
        if (!isCurrentOpen) {
          popover.classList.add('active');
        }
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.hotspot-popover').forEach(p => p.classList.remove('active'));
  });
}
