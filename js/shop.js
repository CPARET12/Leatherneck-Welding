// Shop Page Script

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".shop-tab");
  const products = document.querySelectorAll(".product");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Reset active state
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
});
