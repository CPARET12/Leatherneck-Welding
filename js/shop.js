// Shop Page Script — Tabs + Cart + Add-on Modal

document.addEventListener("DOMContentLoaded", () => {
  /* ================= Tabs (existing behavior) ================= */
  const tabs = document.querySelectorAll(".shop-tab");
  const products = document.querySelectorAll(".product");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      const cat = tab.dataset.cat;
      products.forEach(prod => {
        if (cat === "all" || prod.dataset.cat === cat) {
          prod.style.display = "flex";
        } else {
          prod.style.display = "none";
        }
      });
    });
  });

  /* ================= Cart / Modal Setup ================= */
  const buyButtons   = document.querySelectorAll(".js-buy");
  const cartToggle   = document.getElementById("cartToggle");
  const cartPanel    = document.getElementById("cartPanel");
  const cartItemsEl  = document.getElementById("cartItems");
  const cartCountEl  = document.getElementById("cartCount");
  const cartTotalEl  = document.getElementById("cartTotal");
  const cartCheckout = document.getElementById("cartCheckout");

  const addonModal   = document.getElementById("addonModal");
  const addonClose   = document.getElementById("addonClose");
  const addonTitle   = document.getElementById("addonTitle");
  const addonList    = document.getElementById("addonList");
  const addonAddBtn  = document.getElementById("addonAddToCart");

  // In-memory cart
  const cart = [];
  let activeProduct = null;

  // Simple money formatter
  const fmt = (n) => "$" + n.toFixed(2);

  // Define add-ons per product ID
  const ADDONS = {
    "ranch-gate-12": [
      { id: "elec-lock",  name: "Electronic Lock",          price: 350 },
      { id: "post-light", name: "Electronic Post Lighting", price: 220 },
      { id: "auto-open",  name: "Automatic Opener/Closer",  price: 950 }
    ]
    // you can add more products with add-ons here later
  };

  /* ================= Cart Helpers ================= */

  function renderCart() {
    // Clear list
    cartItemsEl.innerHTML = "";

    if (!cart.length) {
      cartItemsEl.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
      cartCountEl.textContent = "0";
      cartTotalEl.textContent = "$0.00";
      cartCheckout.classList.add("is-disabled");
      cartCheckout.setAttribute("aria-disabled", "true");
      return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item, index) => {
      totalItems += item.qty;
      totalPrice += item.unitPrice * item.qty;

      const li = document.createElement("li");
      li.className = "cart-item";

      const addonsText = item.addons.length
        ? " + " + item.addons.map(a => a.name).join(", ")
        : "";

      li.innerHTML = `
        <div class="cart-item-main">
          <div class="cart-item-name">${item.qty} × ${item.name}${addonsText}</div>
          <div class="cart-item-price">${fmt(item.unitPrice * item.qty)}</div>
        </div>
        <div class="cart-item-controls">
          <button type="button" data-idx="${index}" data-act="dec">−</button>
          <button type="button" data-idx="${index}" data-act="inc">+</button>
          <button type="button" data-idx="${index}" data-act="remove">Remove</button>
        </div>
      `;

      cartItemsEl.appendChild(li);
    });

    cartCountEl.textContent = String(totalItems);
    cartTotalEl.textContent = fmt(totalPrice);

    // Put a simple summary into the contact link query string
    const summary = cart
      .map(item => {
        const addons = item.addons.length
          ? " (" + item.addons.map(a => a.name).join(", ") + ")"
          : "";
        return `${item.qty} x ${item.name}${addons} - ${fmt(item.unitPrice * item.qty)}`;
      })
      .join(" | ");

    const url = "contact.html?cart=" + encodeURIComponent(summary);
    cartCheckout.href = url;
    cartCheckout.classList.remove("is-disabled");
    cartCheckout.removeAttribute("aria-disabled");
  }

  function addToCart(product, addons) {
    const addonsKey = addons.map(a => a.id).sort().join(",");
    const key = product.id + "|" + addonsKey;

    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice   = product.price + addonsTotal;

    const existing = cart.find(item => item.key === key);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        key,
        id: product.id,
        name: product.name,
        basePrice: product.price,
        addons,
        unitPrice,
        qty: 1
      });
    }

    renderCart();
  }

  /* ================= Add-on Modal Helpers ================= */

  function openAddonModal(product) {
    activeProduct = product;

    addonTitle.textContent = `Customize ${product.name}`;
    addonList.innerHTML = "";

    const options = ADDONS[product.id] || [];
    if (!options.length) {
      // No options defined (fallback)
      addonList.innerHTML = `<p>No upgrades are available for this item.</p>`;
    } else {
      options.forEach(opt => {
        const wrapper = document.createElement("label");
        wrapper.className = "addon-option";

        wrapper.innerHTML = `
          <input type="checkbox" name="addon" value="${opt.id}">
          <span class="addon-label">
            ${opt.name}
            <span class="addon-price">${fmt(opt.price)}</span>
          </span>
        `;
        addonList.appendChild(wrapper);
      });
    }

    addonModal.classList.add("is-visible");
    addonModal.setAttribute("aria-hidden", "false");
  }

  function closeAddonModal() {
    addonModal.classList.remove("is-visible");
    addonModal.setAttribute("aria-hidden", "true");
    activeProduct = null;
  }

  /* ================= Event Wiring ================= */

  // Buy buttons
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product");
      if (!card) return;

      const product = {
        id:   card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price || "0")
      };

      const hasAddons = card.dataset.hasAddons === "true";

      if (hasAddons && ADDONS[product.id]) {
        openAddonModal(product);
      } else {
        addToCart(product, []);
      }
    });
  });

  // Cart toggle
  if (cartToggle && cartPanel) {
    cartToggle.addEventListener("click", () => {
      cartPanel.classList.toggle("is-open");
    });
  }

  // Cart item controls (inc/dec/remove)
  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;

    const idx = parseInt(btn.dataset.idx, 10);
    const act = btn.dataset.act;
    const item = cart[idx];
    if (!item) return;

    if (act === "inc") {
      item.qty += 1;
    } else if (act === "dec") {
      item.qty = Math.max(1, item.qty - 1);
    } else if (act === "remove") {
      cart.splice(idx, 1);
    }

    renderCart();
  });

  // Add-on modal
  if (addonClose) {
    addonClose.addEventListener("click", closeAddonModal);
  }

  addonModal.addEventListener("click", (e) => {
    if (e.target === addonModal) {
      closeAddonModal();
    }
  });

  if (addonAddBtn) {
    addonAddBtn.addEventListener("click", () => {
      if (!activeProduct) return;

      const options = ADDONS[activeProduct.id] || [];
      const checkedIds = Array.from(
        addonList.querySelectorAll('input[name="addon"]:checked')
      ).map(i => i.value);

      const chosenAddons = options.filter(opt => checkedIds.includes(opt.id));
      addToCart(activeProduct, chosenAddons);
      closeAddonModal();
    });
  }
});
