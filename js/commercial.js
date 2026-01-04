// js/commercial.js
(function () {
  function init() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = lightbox?.querySelector(".lightbox__close");
    if (!lightbox || !lightboxImg || !closeBtn) return;

    function open(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "Project photo";
      lightbox.hidden = false;
    }
    function close() {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }

    document.querySelectorAll(".conveyor__img").forEach((img) => {
      img.addEventListener("click", () => open(img.src, img.alt));
    });

    closeBtn.addEventListener("click", (e) => { e.preventDefault(); close(); });
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) close(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
