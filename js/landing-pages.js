// Shared landing page JavaScript
(function () {
  const faqItems = document.querySelectorAll(".lp-faq details");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.removeAttribute("open");
        }
      });
    });
  });
})();