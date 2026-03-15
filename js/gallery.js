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


// ===============================
// More Images Modal
// ===============================
const modal = document.getElementById('galleryModal');
const modalGrid = document.getElementById('galleryModalGrid');
const modalTitle = document.getElementById('galleryModalTitle');
const modalCloseBtn = document.getElementById('galleryModalClose');

const projectImages = {
  "barndo-open-span": {
    title: "Barndominium – More Images",
    images: [
      "folder.images/residential4.png",
      "folder.images/residential5.png"
    ]
  },
  "steel-shop-40x60": {
    title: "Steel Shop – More Images",
    images: [
      "folder.images/commercial3.jpg",
      "folder.images/commercial4.png"
    ]
  },

  "ranch-fence-pipe-cable": {
  title: "Ranch Fence – More Images",
  images: [
    "folder.images/agriculture7.JPG",
    "folder.images/agriculture8.JPG",
    "folder.images/agriculture9.JPG",
    "folder.images/agriculture12.JPG"

  ]
},

  "custom-deck-railing": {
    title: "Custom Deck Railing – More Images",
    images: [
      "folder.images/fencing18.JPG",
    "folder.images/fencing3.JPG",
    "folder.images/fencing5.JPG",
    "folder.images/fencing9.JPG",
    "folder.images/fencing10.JPG",
    "folder.images/fencing11.JPG",
    "folder.images/fencing15.JPG",
    "folder.images/fencing19.png",
    "folder.images/fencing20.JPG",
    "folder.images/fencing21.JPG"
      ]
  },
  "gate-fabrication-repair": {
    title: "Gate Fabrication & Repair – More Images",
    images: [
      "folder.images/gate2.png",
      "folder.images/gate3.png",
      "folder.images/gate4.jpg",
      "folder.images/gate5.png",
      "folder.images/gate8.png",
      "folder.images/gate9.png",
      "folder.images/gate10.png",
      "folder.images/gate11.png",
      "folder.images/gate12.png",
      "folder.images/gate13.png",
      "folder.images/gate14.jpg",
      "folder.images/gate15.png",
      "folder.images/gate16.jpg",
      "folder.images/gate17.png",
      "folder.images/gate18.jpg",
      "folder.images/gate19.png"
    ]
  }
};

function openGalleryModal(projectKey) {
  const project = projectImages[projectKey];
  if (!project) return;

  modalTitle.textContent = project.title;
  modalGrid.innerHTML = project.images.map((src, index) => `
    <div class="gallery-modal__item">
      <img src="${src}" alt="${project.title} image ${index + 1}">
    </div>
  `).join('');

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.g-more').forEach(btn => {
  btn.addEventListener('click', () => {
    openGalleryModal(btn.dataset.project);
  });
});

modalCloseBtn.addEventListener('click', closeGalleryModal);

modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close-modal')) {
    closeGalleryModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeGalleryModal();
  }
});