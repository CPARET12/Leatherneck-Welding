// js/fencing.js
(function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = lightbox?.querySelector(".lightbox__close");

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

  // IMPORTANT: bind directly to conveyor images
  document.querySelectorAll(".conveyor__img").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
})();
