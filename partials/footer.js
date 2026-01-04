// partials/footer.js
async function injectFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;

  const res = await fetch("partials/footer.html", { cache: "no-store" });
  if (!res.ok) return;

  mount.innerHTML = await res.text();

  // set year AFTER footer is injected
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", injectFooter);
