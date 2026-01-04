// partials/header.js

document.addEventListener("DOMContentLoaded", () => {
  const slot = document.getElementById("site-header");
  if (!slot) return;

  fetch("partials/header.html")
    .then(res => res.text())
    .then(html => {
      slot.innerHTML = html;

      setActiveNavLink();
      initMobileHeaderNav();   // ✅ add this
    })
    .catch(err => {
      console.error("Error loading header partial:", err);
    });
});

function setActiveNavLink() {
  const file = window.location.pathname.split("/").pop().toLowerCase();

  let page = "home";
  if (file.includes("residential")) page = "residential";
  else if (file.includes("commercial")) page = "commercial";
  else if (file.includes("gallery")) page = "gallery";
  else if (file.includes("shop")) page = "shop";
  else if (file.includes("about")) page = "about";
  else if (file.includes("services")) page = "services";
  else if (file.includes("agriculture")) page = "agriculture";
  else if (file.includes("fencing")) page = "fencing";

  const links = document.querySelectorAll(".links [data-page-link]");
  links.forEach(link => {
    if (link.dataset.pageLink === page) link.classList.add("active");
  });
}

function initMobileHeaderNav(){
  const nav = document.getElementById("primaryNav");
  const toggle = document.querySelector(".nav-toggle");
  const dropdown = document.querySelector(".dropdown");
  const dropBtn = dropdown ? dropdown.querySelector(".dropbtn") : null;

  if (!nav || !toggle) return;

  const openMenu = () => {
    nav.dataset.open = "true";
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    nav.dataset.open = "false";
    toggle.setAttribute("aria-expanded", "false");
    if (dropdown) dropdown.dataset.open = "false";
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = nav.dataset.open === "true";
    isOpen ? closeMenu() : openMenu();
  });

  // Mobile dropdown: tap Services to open submenu instead of navigating
  if (dropBtn && dropdown){
    dropBtn.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 820px)").matches){
        e.preventDefault();
        e.stopPropagation();
        dropdown.dataset.open = (dropdown.dataset.open === "true") ? "false" : "true";
      }
    });
  }

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (nav.dataset.open !== "true") return;
    const inside = e.target.closest(".navbar");
    if (!inside) closeMenu();
  });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // When resizing back to desktop, reset state
  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 820px)").matches){
      closeMenu();
    }
  });

  // Clicking any normal link closes the menu on mobile
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    // if it's the services "dropbtn" on mobile we don't close (it toggles submenu)
    if (a.classList.contains("dropbtn") && window.matchMedia("(max-width: 820px)").matches) return;

    if (window.matchMedia("(max-width: 820px)").matches){
      closeMenu();
    }
  });
}
