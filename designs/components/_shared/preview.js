(function () {
  function setTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document.querySelectorAll("[data-set-theme]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-set-theme") === theme);
    });
  }

  function setState(state) {
    document.body.setAttribute("data-state", state);
    document.querySelectorAll("[data-set-state]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-set-state") === state);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.body.setAttribute("data-state", "normal");

    document.querySelectorAll("[data-set-theme]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTheme(btn.getAttribute("data-set-theme"));
      });
    });

    document.querySelectorAll("[data-set-state]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setState(btn.getAttribute("data-set-state"));
      });
    });

    var navToggle = document.querySelector("[data-toggle-nav]");
    var nav = document.querySelector(".tl-nav");
    if (navToggle && nav) {
      navToggle.addEventListener("click", function () {
        nav.classList.toggle("collapsed");
      });
    }

    var themeBtn = document.querySelector("[data-header-theme]");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var isDark = document.documentElement.getAttribute("data-theme") === "dark";
        setTheme(isDark ? "light" : "dark");
      });
    }

    // Lab tabs switching
    document.querySelectorAll("[data-tab-target]").forEach(function (tabBtn) {
      tabBtn.addEventListener("click", function () {
        var group = tabBtn.getAttribute("data-tab-group") || "default";
        var target = tabBtn.getAttribute("data-tab-target");
        document.querySelectorAll('[data-tab-group="' + group + '"]').forEach(function (b) {
          b.classList.toggle("active", b === tabBtn);
        });
        document.querySelectorAll('[data-tab-pane-group="' + group + '"]').forEach(function (pane) {
          pane.style.display = pane.getAttribute("data-tab-pane") === target ? "flex" : "none";
        });
      });
    });

    // Mode toggle Junior / Senior preview
    document.querySelectorAll("[data-set-mode]").forEach(function (modeBtn) {
      modeBtn.addEventListener("click", function () {
        var mode = modeBtn.getAttribute("data-set-mode");
        document.querySelectorAll("[data-set-mode]").forEach(function (b) {
          b.classList.remove("active-junior", "active-senior");
          if (b.getAttribute("data-set-mode") === mode) {
            b.classList.add(mode === "junior" ? "active-junior" : "active-senior");
          }
        });
        document.querySelectorAll("[data-mode-only]").forEach(function (el) {
          el.style.display = el.getAttribute("data-mode-only") === mode ? "" : "none";
        });
      });
    });
  });
})();
