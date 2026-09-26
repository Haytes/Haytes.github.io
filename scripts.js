// Theme toggle: default follows the OS preference; an explicit choice is
// stored in localStorage and applied pre-paint by the inline head script.
(function () {
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");

  function explicitTheme() {
    return root.dataset.theme === "light" || root.dataset.theme === "dark"
      ? root.dataset.theme
      : null;
  }

  function osTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  if (button) {
    button.setAttribute("aria-pressed", explicitTheme() !== null ? "true" : "false");

    button.addEventListener("click", function () {
      var current = explicitTheme() || osTheme();
      var next = current === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      button.setAttribute("aria-pressed", "true");
      try {
        localStorage.setItem("theme", next);
      } catch (e) { /* storage blocked — theme still applies for this page view */ }
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
