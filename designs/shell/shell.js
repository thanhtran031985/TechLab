/* TechLab Shared Shell JS — Quản lý Mode Junior/Senior, 3 Tabs, Progress 0/30, Cheat Sheet Modal & 5-Hop Animation */
(function () {
  var STORAGE_KEY = "techlab_darkstudio_progress_v1";
  var MODE_KEY = "techlab_darkstudio_mode_v1";
  var TOTAL_CHALLENGES = 30;

  window.TechLab = {
    mode: "junior",
    getPassed: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      } catch (e) {
        return [];
      }
    },
    markChallengePassed: function (challengeId) {
      var list = this.getPassed();
      if (list.indexOf(challengeId) === -1) {
        list.push(challengeId);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
      }
      this.renderProgress();
    },
    renderProgress: function () {
      var list = this.getPassed();
      var countEl = document.getElementById("tl-progress-count");
      var fillEl = document.getElementById("tl-progress-fill");
      if (countEl) countEl.textContent = list.length + "/" + TOTAL_CHALLENGES;
      if (fillEl) fillEl.style.width = Math.min(100, Math.round((list.length / TOTAL_CHALLENGES) * 100)) + "%";

      var pageChallenges = document.querySelectorAll("[data-challenge-id]");
      var pageDone = 0;
      pageChallenges.forEach(function (card) {
        var cid = card.getAttribute("data-challenge-id");
        var isDone = list.indexOf(cid) !== -1;
        card.classList.toggle("passed", isDone);
        var badge = card.querySelector("[data-challenge-status]");
        if (badge) {
          badge.className = isDone ? "chip chip-senior" : "chip chip-info";
          badge.textContent = isDone ? "Đạt" : "Chưa đạt";
        }
        if (isDone) pageDone++;
      });
      var tabBadge = document.getElementById("tl-tab-challenge-count");
      if (tabBadge && pageChallenges.length > 0) {
        tabBadge.textContent = pageDone + "/" + pageChallenges.length;
      }
    },
    setMode: function (mode) {
      this.mode = mode === "senior" ? "senior" : "junior";
      try { localStorage.setItem(MODE_KEY, this.mode); } catch (e) {}
      var btnJ = document.getElementById("btn-mode-junior");
      var btnS = document.getElementById("btn-mode-senior");
      if (btnJ) btnJ.className = "mode-btn" + (this.mode === "junior" ? " active-junior" : "");
      if (btnS) btnS.className = "mode-btn" + (this.mode === "senior" ? " active-senior" : "");
      document.querySelectorAll("[data-mode-badge]").forEach(function (el) {
        if (window.TechLab.mode === "junior") {
          el.className = "chip chip-junior";
          el.textContent = "Junior (First-Try)";
        } else {
          el.className = "chip chip-senior";
          el.textContent = "Senior (Chuẩn Hệ Thống)";
        }
      });
      if (typeof window.onModeChange === "function") {
        window.onModeChange(this.mode);
      }
    },
    switchTab: function (tabName) {
      document.querySelectorAll(".wb-tab").forEach(function (btn) {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
      });
      document.querySelectorAll(".wb-pane").forEach(function (pane) {
        pane.classList.toggle("active", pane.getAttribute("data-pane") === tabName);
      });
    },
    animateHops: function (isErrorAtStep) {
      var nodes = document.querySelectorAll("#tl-hops .hop-node");
      nodes.forEach(function (n) { n.classList.remove("lit", "err"); });
      nodes.forEach(function (n, idx) {
        setTimeout(function () {
          if (isErrorAtStep && idx + 1 === isErrorAtStep) {
            n.classList.add("err");
          } else if (!isErrorAtStep || idx + 1 < isErrorAtStep) {
            n.classList.add("lit");
          }
        }, idx * 110);
      });
    },
    updateInspector: function (opts) {
      var reqEl = document.getElementById("tl-raw-req");
      var resEl = document.getElementById("tl-raw-res");
      var anaEl = document.getElementById("tl-analysis");
      if (reqEl && opts.req) reqEl.textContent = opts.req;
      if (resEl && opts.res) resEl.textContent = opts.res;
      if (anaEl && opts.analysis) {
        anaEl.className = "analysis-box " + (opts.tone || "ok");
        anaEl.textContent = opts.analysis;
      }
      this.animateHops(opts.errorHop || 0);
      if (opts.openInspector !== false) {
        this.switchTab("inspector");
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var savedMode = "junior";
    try { savedMode = localStorage.getItem(MODE_KEY) || "junior"; } catch (e) {}
    window.TechLab.setMode(savedMode);
    window.TechLab.renderProgress();

    var btnJ = document.getElementById("btn-mode-junior");
    var btnS = document.getElementById("btn-mode-senior");
    if (btnJ) btnJ.addEventListener("click", function () { window.TechLab.setMode("junior"); });
    if (btnS) btnS.addEventListener("click", function () { window.TechLab.setMode("senior"); });

    document.querySelectorAll(".wb-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.TechLab.switchTab(btn.getAttribute("data-tab"));
      });
    });

    // Cheat Sheet Modal
    var csOpen = document.getElementById("btn-open-cheatsheet");
    var csClose = document.getElementById("btn-close-cheatsheet");
    var csModal = document.getElementById("tl-cheatsheet-modal");
    if (csOpen && csModal) csOpen.addEventListener("click", function () { csModal.classList.add("open"); });
    if (csClose && csModal) csClose.addEventListener("click", function () { csModal.classList.remove("open"); });
    if (csModal) {
      csModal.addEventListener("click", function (e) { if (e.target === csModal) csModal.classList.remove("open"); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") csModal.classList.remove("open"); });
    }

    // URL Anatomy Pills
    document.querySelectorAll(".url-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        document.querySelectorAll(".url-pill").forEach(function (p) { p.classList.remove("selected"); });
        pill.classList.add("selected");
        var out = document.getElementById("url-anatomy-explain");
        if (out) {
          out.innerHTML = "<strong>" + pill.getAttribute("data-label") + ":</strong> " + pill.getAttribute("data-desc");
        }
        if (typeof window.onUrlPartClicked === "function") {
          window.onUrlPartClicked(pill.getAttribute("data-part"));
        }
      });
    });
  });
})();
