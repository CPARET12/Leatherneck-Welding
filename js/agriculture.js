// js/agriculture.js
(function () {
  // Wait until the DOM exists (safe even if you use defer)
  function init() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = lightbox?.querySelector(".lightbox__close");

    // If the page doesn't have a lightbox, do nothing.
    if (!lightbox || !lightboxImg || !closeBtn) return;

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "Project photo";
      lightbox.hidden = false;
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }

    // Bind click handlers to ALL conveyor images on the page
    document.querySelectorAll(".conveyor__img").forEach((img) => {
      img.addEventListener("click", () => openLightbox(img.src, img.alt));
    });

    // Close actions
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeLightbox();
    });

    lightbox.addEventListener("click", (e) => {
      // Only close if the dark backdrop itself was clicked
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
