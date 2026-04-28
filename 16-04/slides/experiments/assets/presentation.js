(function () {
  var PAGES = [
    { href: "index.html", label: "Portada" },
    { href: "pre_03_objetivos.html", label: "Objetivos" },
    { href: "trans_01_desarrollo.html", label: "Desarrollo" },
    { href: "pre_04_dataset.html", label: "Dataset" },
    { href: "pre_05_metodologia.html", label: "Metodologia" },
    { href: "exp_01_enfoque.html", label: "Baseline" },
    { href: "01_exp1_baseline.html", label: "Exp1" },
    { href: "02_exp2_aggregated.html", label: "Exp2" },
    { href: "03_exp3_categorical.html", label: "Exp3" },
    { href: "04_exp4_pruning.html", label: "Exp4" },
    { href: "04b_exp4_pruning_comparativa.html", label: "Exp4 comp" },
    { href: "exp_05_enfoque.html", label: "Hyperparameter search" },
    { href: "05a_exp5_todos_modelos.html", label: "Exp5 ranking" },
    { href: "05_exp5_duelo.html", label: "Exp5 duelo" },
    { href: "06_exp5_xgb_a.html", label: "ROC individual" },
    { href: "07_exp5_xgb_b.html", label: "ROC-AUC boxplot" },
    { href: "08_exp5_xgb_c.html", label: "Prec-NPV" },
    { href: "09_exp5_tree_a.html", label: "F1-F2" },
    { href: "10_exp5_tree_b.html", label: "Kappa" },
    { href: "11_exp5_tree_c.html", label: "Confusion" },
    { href: "12_tree_final.html", label: "Arbol final" },
    { href: "trans_02_avances.html", label: "Avances" },
    { href: "12_avances.html", label: "Avances" },
    { href: "trans_03_cierre.html", label: "Cierre" },
    { href: "post_01_conclusiones.html", label: "Conclusiones" },
    { href: "post_02_trabajo_futuro.html", label: "Futuro" },
    { href: "post_03_gracias.html", label: "Gracias" },
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
