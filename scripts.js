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
      var meta = document.getElementById("theme-color-meta");
      if (meta) meta.setAttribute("content", next === "light" ? "#ffffff" : "#0d1117");
      try {
        localStorage.setItem("theme", next);
      } catch (e) { /* storage blocked — theme still applies for this page view */ }
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Guided app walkthroughs — Riftbound-tracker-style step tours over
  // screenshots. Clicking a thumbnail opens the tour at that step; the
  // "Take the tour" button starts from the beginning. Without JS the
  // thumbnails still link to the plain images.
  var DEMOS = {
    inbox: {
      ctaLabel: "View source",
      ctaHref: "https://github.com/Haytes/InboxPlease",
      steps: [
        {
          img: "src/images/projects/inbox-01-title.jpg",
          title: "Clock in",
          body: "Six shifts screening the claims inbox at Meridian Benefits Group — 31 emails, every judgment logged. Zero dependencies: no build, no server, no network calls, even the sound effects are synthesized at runtime."
        },
        {
          img: "src/images/projects/inbox-02-intro.jpg",
          title: "Your first shift",
          body: "You are the mail screener. Deliver legitimate mail, report the phish — and remember which one the trust meter punishes more."
        },
        {
          img: "src/images/projects/inbox-03-triage.jpg",
          title: "Deliver or report",
          body: "Read the email, inspect the evidence, then rule. A missed phish costs three times a false alarm; five good calls in a row earn a streak bonus. Fully keyboard-driven — A, P, H, M."
        },
        {
          img: "src/images/projects/inbox-04-headers.jpg",
          title: "Read the full headers",
          body: "The From says payroll@meridianbenefits.com but Reply-To points somewhere else entirely. Full headers surface that mismatch — and from day four, SPF, DKIM, and DMARC chips arrive as further tools."
        },
        {
          img: "src/images/projects/inbox-05-homoglyph.jpg",
          title: "Catch the lookalike",
          body: "The Domain Inspector — unlocked from day five — flags punycode and homoglyph domains that survive a casual glance. This one is one character away from the real thing."
        },
        {
          img: "src/images/projects/inbox-06-incident.jpg",
          title: "When one slips through",
          body: "Deliver a serious phish and the shift stops for an incident report — capped at two a day. The tone stays blame-free on purpose: the lesson is report fast, not feel bad."
        },
        {
          img: "src/images/projects/inbox-07-debrief.jpg",
          title: "The debrief",
          body: "Every shift ends judgment-by-judgment. Each missed red flag is marked by whether you actually examined it — did you open the headers, hover the link, check the attachment — before you ruled?"
        },
        {
          img: "src/images/projects/inbox-08-final.jpg",
          title: "The report card",
          body: "After day six: weighted accuracy with a letter grade, catch rate per attack category, trap-avoidance stats (did you false-alarm the legitimate mail?), and every red flag you missed ranked by frequency."
        },
        {
          img: "src/images/projects/inbox-09-print.jpg",
          title: "File the record",
          body: "A printable training record with signature lines, generated from the run — the compliance paperwork that turns a browser game into training evidence."
        }
      ]
    },
    riftbound: {
      steps: [
        {
          img: "src/images/projects/riftbound-01-tour.jpg",
          title: "A guided tour, no account needed",
          body: "New visitors walk the real app with a sample collector's data — every page one click away, nothing saved. The tour itself is a pure, edge-safe definition shared by the middleware, the overlay, and the tests."
        },
        {
          img: "src/images/projects/riftbound-02-catalog.jpg",
          title: "The full catalog",
          body: "All 1,300 cards across seven sets, searchable and filterable by type, rarity, set, and domain. The ×N badge on each tile shows how many you own — tap a card for full details."
        },
        {
          img: "src/images/projects/riftbound-03-binder.jpg",
          title: "Track the binder",
          body: "Everything you own in one place — quantity and foil counts per card — filterable instantly in your browser. Paste a CSV, JSON, or plaintext list and tiered fuzzy matching imports the whole collection at once."
        },
        {
          img: "src/images/projects/riftbound-04-deckcheck.jpg",
          title: "Can you build it?",
          body: "Every deck is checked against your binder automatically. This one is fully covered — a legal 40-card list with runes, battlefields, legend, and champion all present, no gaps."
        },
        {
          img: "src/images/projects/riftbound-05-finder.jpg",
          title: "Find your next deck",
          body: "Deck Finder recommends decks from your collection by legend and champion archetype, with an honest within-reach affordability read on each one."
        }
      ]
    }
  };

  var dialog = document.getElementById("shot-dialog");

  if (dialog && typeof dialog.showModal === "function") {
    var stageImg = dialog.querySelector(".demo-stage img");
    var stepEl = dialog.querySelector(".demo-step");
    var titleEl = dialog.querySelector(".demo-title");
    var bodyEl = dialog.querySelector(".demo-body");
    var dotsEl = dialog.querySelector(".demo-dots");
    var prevBtn = dialog.querySelector("[data-demo-prev]");
    var nextBtn = dialog.querySelector("[data-demo-next]");
    var ctaLink = dialog.querySelector("[data-demo-cta]");
    var current = null;
    var index = 0;

    function render() {
      var step = current.steps[index];
      stageImg.src = step.img;
      stageImg.alt = step.title + " — screenshot";
      stepEl.textContent = (index + 1) + " / " + current.steps.length;
      titleEl.textContent = step.title;
      bodyEl.textContent = step.body;
      prevBtn.disabled = index === 0;
      var last = index === current.steps.length - 1;
      nextBtn.hidden = last;
      ctaLink.hidden = !last || !current.ctaHref;
      if (current.ctaHref) {
        ctaLink.href = current.ctaHref;
        ctaLink.textContent = (current.ctaLabel || "Learn more") + " ↗";
      }
      Array.prototype.forEach.call(dotsEl.children, function (dot, i) {
        dot.classList.toggle("on", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    function openDemo(key, step) {
      var demo = DEMOS[key];
      if (!demo) return;
      current = demo;
      index = Math.min(Math.max(step - 1, 0), demo.steps.length - 1);

      dotsEl.innerHTML = "";
      demo.steps.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "demo-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Step " + (i + 1));
        dot.addEventListener("click", function () { index = i; render(); });
        dotsEl.appendChild(dot);
      });

      render();
      dialog.showModal();
    }

    prevBtn.addEventListener("click", function () {
      if (index > 0) { index--; render(); }
    });
    nextBtn.addEventListener("click", function () {
      if (current && index < current.steps.length - 1) { index++; render(); }
    });

    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") nextBtn.click();
      if (e.key === "ArrowLeft") prevBtn.click();
    });

    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-demo]"), function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var step = parseInt(el.getAttribute("data-step") || "1", 10);
        openDemo(el.getAttribute("data-demo"), step);
      });
    });
  }

  // Scrollspy: highlight the nav link for the section in view.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var byHash = {};
  navLinks.forEach(function (a) { byHash[a.getAttribute("href").slice(1)] = a; });

  if ("IntersectionObserver" in window && navLinks.length) {
    var setActive = function (id) {
      navLinks.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    Object.keys(byHash).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  // Scroll reveal: fade sections/cards in as they enter the viewport.
  // The CSS gates this behind prefers-reduced-motion, and without JS the
  // .reveal class never exists, so content is never hidden.
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var revealables = document.querySelectorAll(
      ".section-header, .about-photo, .about-text, .timeline > li, .card"
    );
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add("reveal");
      revealer.observe(el);
    });
  }
})();
