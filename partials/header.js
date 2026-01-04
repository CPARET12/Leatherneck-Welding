// partials/header.js

document.addEventListener("DOMContentLoaded", () => {
  const slot = document.getElementById("site-header");
  if (!slot) return;

  // Load the shared header HTML
  fetch("partials/header.html")
    .then(res => res.text())
    .then(html => {
      slot.innerHTML = html;
      setActiveNavLink();
    })
    .catch(err => {
      console.error("Error loading header partial:", err);
    });
});

function setActiveNavLink() {
  // e.g. "index.html", "commercial.html", etc.
  const file = window.location.pathname.split("/").pop().toLowerCase();

  let page = "home";
  if (file.includes("residential")) page = "residential";
  else if (file.includes("commercial")) page = "commercial";
  else if (file.includes("gallery")) page = "gallery";
  else if (file.includes("shop")) page = "shop";
  else if (file.includes("about")) page = "about";
  else if (file.includes("services")) page = "services";

  const links = document.querySelectorAll(".links [data-page-link]");
  links.forEach(link => {
    if (link.dataset.pageLink === page) {
      link.classList.add("active");
    }
  });
}
