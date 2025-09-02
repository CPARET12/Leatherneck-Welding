// Tabs filtering
const tabs = document.querySelectorAll('.tab');
const items = document.querySelectorAll('.g-item');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');

    const cat = tab.dataset.cat;
    items.forEach(it => {
      const match = (cat === 'all') || (it.dataset.cat === cat);
      it.style.display = match ? '' : 'none';
    });
  });
});

// Floating details panel logic
const panel = document.getElementById('detailsPanel');
const dpInner   = panel.querySelector('.dp-inner');
const dpTitle   = document.getElementById('dpTitle');
const dpLoc     = document.getElementById('dpLocation');
const dpSize    = document.getElementById('dpSize');
const dpNotes   = document.getElementById('dpNotes');

// helper to place the panel near a rect, preferring right side
function positionPanelNear(rect) {
  const gap = 12;
  const preferredLeft = rect.right + gap;
  const top = rect.top + window.scrollY + rect.height/2;

  const innerWidth = dpInner.getBoundingClientRect().width;
  let left = preferredLeft;

  // If not enough space to the right, place to the left
  if (preferredLeft + innerWidth > window.scrollX + window.innerWidth - 8) {
    left = rect.left + window.scrollX - innerWidth - gap;
  }
  // Clamp within viewport
  left = Math.max(8, Math.min(left, window.scrollX + window.innerWidth - innerWidth - 8));

  dpInner.style.position = 'absolute';
  dpInner.style.left = `${left}px`;
  dpInner.style.top  = `${top}px`;
  dpInner.style.transform = 'translateY(-50%)';
}

document.querySelectorAll('.g-details').forEach(btn => {
  const show = () => {
    dpTitle.textContent = btn.dataset.title || 'Project';
    dpLoc.textContent   = btn.dataset.location || '—';
    dpSize.textContent  = btn.dataset.size || '—';
    dpNotes.textContent = btn.dataset.notes || '';

    panel.setAttribute('aria-hidden', 'false');
    panel.dataset.show = 'true';

    const rect = btn.getBoundingClientRect();
    positionPanelNear(rect);
  };
  const hide = () => {
    panel.dataset.show = 'false';
    panel.setAttribute('aria-hidden', 'true');
  };

  // Hover shows; moving mouse away hides after short delay
  let hideTimer;
  btn.addEventListener('mouseenter', () => {
    clearTimeout(hideTimer);
    show();
  });
  btn.addEventListener('mouseleave', () => {
    hideTimer = setTimeout(() => hide(), 160);
  });

  // Keep open if user moves onto the panel
  dpInner.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  dpInner.addEventListener('mouseleave', () => hide());

  // Also show on focus (keyboard access)
  btn.addEventListener('focus', show);
  btn.addEventListener('blur', () => hide());
});

// Close panel on Esc
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    panel.dataset.show = 'false';
    panel.setAttribute('aria-hidden', 'true');
  }
});
