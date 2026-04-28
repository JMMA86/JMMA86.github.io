(function () {
  var PAGES = [
    { href: "index.html", label: "Portada" },
    { href: "01_final_modelo.html", label: "Modelo Final" },
    { href: "02_final_roc.html", label: "ROC Curve" },
    { href: "03_final_shap.html", label: "SHAP Values" },
    { href: "04_final_metricas.html", label: "Métricas Detalladas" },
    { href: "05_final_conclusiones.html", label: "Conclusiones" },
    { href: "06_final_gracias.html", label: "Gracias" }
  ];

  var isNavigating = false;

  function setupPageEntryTransition() {
    var direction = sessionStorage.getItem("slideTransitionDirection");
    if (!direction) {
      return;
    }

    var enterClass = direction === "back" ? "from-back" : "from-forward";
    document.body.classList.add("page-enter", enterClass);

    requestAnimationFrame(function () {
      document.body.classList.add("enter-active");
    });

    setTimeout(function () {
      document.body.classList.remove("page-enter", "from-back", "from-forward", "enter-active");
      sessionStorage.removeItem("slideTransitionDirection");
    }, 280);
  }

  function createZoomOverlay() {
    var overlay = document.createElement("div");
    overlay.className = "image-zoom-overlay";
    overlay.innerHTML =
      '<div class="image-zoom-container"><img class="image-zoom-img" alt="zoom" /></div>';
    overlay.addEventListener("click", function () {
      overlay.classList.remove("open");
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function setupImageZoom() {
    var overlay = createZoomOverlay();
    var zoomImg = overlay.querySelector(".image-zoom-img");

    document.querySelectorAll(".image-card img").forEach(function (img) {
      img.classList.add("zoomable");
      img.addEventListener("click", function (event) {
        event.stopPropagation();
        zoomImg.src = img.src;
        zoomImg.alt = img.alt || "zoom";
        overlay.classList.add("open");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("open")) {
        overlay.classList.remove("open");
      }
    });

    return overlay;
  }

  function getCurrentPageIndex() {
    var filename = window.location.pathname.split("/").pop() || "index.html";
    var idx = PAGES.findIndex(function (p) {
      return p.href === filename;
    });
    return idx >= 0 ? idx : 0;
  }

  function goToPage(index) {
    if (isNavigating || index < 0 || index >= PAGES.length) {
      return;
    }

    var currentIndex = getCurrentPageIndex();
    if (index === currentIndex) {
      return;
    }

    isNavigating = true;
    var direction = index > currentIndex ? "forward" : "back";
    sessionStorage.setItem("slideTransitionDirection", direction);
    window.location.href = PAGES[index].href;
  }

  function buildDots(current) {
    var nav = document.getElementById("navigation");
    if (!nav) {
      return;
    }

    PAGES.forEach(function (page, index) {
      var dot = document.createElement("button");
      dot.className = "nav-dot" + (index === current ? " active" : "");
      dot.title = page.label;
      dot.setAttribute("aria-label", page.label);
      dot.addEventListener("click", function () {
        goToPage(index);
      });
      nav.appendChild(dot);
    });
  }

  function syncPageNumber(index) {
    var pageNumber = document.querySelector(".page-number");
    if (!pageNumber) {
      return;
    }
    pageNumber.textContent = String(index + 1);
  }

  function canScrollDown(slide) {
    return slide.scrollTop + slide.clientHeight < slide.scrollHeight - 5;
  }

  function canScrollUp(slide) {
    return slide.scrollTop > 0;
  }

  function scrollOnePage(slide, direction) {
    slide.scrollBy({
      top: direction > 0 ? slide.clientHeight : -slide.clientHeight,
      behavior: "smooth",
    });
  }

  function setupNavigation() {
    setupPageEntryTransition();

    var current = getCurrentPageIndex();
    var slide = document.querySelector(".slide");
    var zoomOverlay = setupImageZoom();

    syncPageNumber(current);
    buildDots(current);

    document.addEventListener("keydown", function (e) {
      if (!slide) {
        return;
      }

      if (zoomOverlay.classList.contains("open")) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (canScrollDown(slide)) {
          scrollOnePage(slide, 1);
        } else {
          goToPage(current + 1);
        }
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (canScrollUp(slide)) {
          scrollOnePage(slide, -1);
        } else {
          goToPage(current - 1);
        }
      }
    });

    document.addEventListener(
      "wheel",
      function (e) {
        if (!slide) {
          return;
        }

        if (zoomOverlay.classList.contains("open")) {
          return;
        }

        e.preventDefault();

        if (e.deltaY > 0) {
          if (canScrollDown(slide)) {
            scrollOnePage(slide, 1);
          } else {
            goToPage(current + 1);
          }
        }

        if (e.deltaY < 0) {
          if (canScrollUp(slide)) {
            scrollOnePage(slide, -1);
          } else {
            goToPage(current - 1);
          }
        }
      },
      { passive: false }
    );
  }

  setupNavigation();
})();
