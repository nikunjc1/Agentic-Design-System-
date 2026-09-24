(() => {
  "use strict";

  const COLLAPSE_KEY_PREFIX = "ads:nav-collapsed:";
  const THEME_KEY = "ads:theme";

  // Preferences remain optional when browser storage is unavailable.
  function readPreference(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function writePreference(key, value) { try { localStorage.setItem(key, value); } catch {} }

  // Brand and surface colors can now be set independently per theme
  // (foundations.html), so switching theme live has to re-read and
  // re-apply that theme's saved values - the <head> boot script only runs
  // once, at load, for whichever theme was active then.
  function applySavedColorsForTheme(theme) {
    const root = document.documentElement.style;
    try {
      const saved = JSON.parse(localStorage.getItem("ads:colors") || "null");
      // Older saved state may have no "dark" entry at all (saved before a
      // separate dark override existed, or before it was enabled) - fall back
      // to the light entry rather than silently dropping the brand color in
      // dark theme, matching foundations.js's own always-persist-dark fix.
      const themeColors = (saved && saved[theme]) || (theme === "dark" && saved && saved.light);
      const hex = themeColors && themeColors.primary && themeColors.primary.hex;
      if (hex && /^#[0-9a-f]{6}$/i.test(hex)) {
        const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        const mix = (c, target, amt) => Math.round(c + (target - c) * amt);
        const toHex = (rr, gg, bb) => "#" + [rr, gg, bb].map((v) => { const h = v.toString(16); return h.length === 1 ? "0" + h : h; }).join("");
        root.setProperty("--red-500", hex);
        root.setProperty("--red-600", toHex(mix(r, 0, 0.18), mix(g, 0, 0.18), mix(b, 0, 0.18)));
        root.setProperty("--red-400", toHex(mix(r, 255, 0.25), mix(g, 255, 0.25), mix(b, 255, 0.25)));
        root.setProperty("--red-tint", `rgba(${r},${g},${b},0.08)`);
        root.setProperty("--red-glow", `rgba(${r},${g},${b},0.35)`);
      } else {
        root.removeProperty("--red-500");
        root.removeProperty("--red-600");
        root.removeProperty("--red-400");
        root.removeProperty("--red-tint");
        root.removeProperty("--red-glow");
      }
    } catch {}

    const hexProp = (value, prop) => {
      if (value && /^#[0-9a-f]{6}$/i.test(value)) root.setProperty(prop, value);
      else root.removeProperty(prop);
    };

    try {
      const savedBg = JSON.parse(localStorage.getItem("ads:bg-colors") || "null");
      const bgSet = savedBg && savedBg[theme];
      hexProp(bgSet && bgSet.primary, "--graphite-950");
      hexProp(bgSet && bgSet.secondary, "--graphite-900");
      hexProp(bgSet && bgSet.tertiary, "--graphite-850");
    } catch {}

    try {
      const savedStatus = JSON.parse(localStorage.getItem("ads:status-colors") || "null");
      const statusSet = savedStatus && savedStatus[theme];
      hexProp(statusSet && statusSet.success, "--green-500");
      hexProp(statusSet && statusSet.warning, "--amber-500");
      hexProp(statusSet && statusSet.info, "--blue-500");
      const danger = statusSet && statusSet.danger;
      if (danger && /^#[0-9a-f]{6}$/i.test(danger)) {
        const r = parseInt(danger.slice(1, 3), 16), g = parseInt(danger.slice(3, 5), 16), b = parseInt(danger.slice(5, 7), 16);
        const mix = (c, target, amt) => Math.round(c + (target - c) * amt);
        const toHex = (rr, gg, bb) => "#" + [rr, gg, bb].map((v) => { const h = v.toString(16); return h.length === 1 ? "0" + h : h; }).join("");
        root.setProperty("--danger-500", danger);
        root.setProperty("--danger-600", toHex(mix(r, 0, 0.18), mix(g, 0, 0.18), mix(b, 0, 0.18)));
        root.setProperty("--danger-400", toHex(mix(r, 255, 0.25), mix(g, 255, 0.25), mix(b, 255, 0.25)));
      } else {
        root.removeProperty("--danger-500");
        root.removeProperty("--danger-600");
        root.removeProperty("--danger-400");
      }
    } catch {}

    try {
      const savedNeutral = JSON.parse(localStorage.getItem("ads:neutral-colors") || "null");
      const neutralSet = savedNeutral && savedNeutral[theme];
      hexProp(neutralSet && neutralSet.c800, "--graphite-800");
      hexProp(neutralSet && neutralSet.c700, "--graphite-700");
      hexProp(neutralSet && neutralSet.c600, "--graphite-600");
      hexProp(neutralSet && neutralSet.c500, "--graphite-500");
      hexProp(neutralSet && neutralSet.border, "--control-border");
    } catch {}

    try {
      const savedText = JSON.parse(localStorage.getItem("ads:text-colors") || "null");
      const textSet = savedText && savedText[theme];
      hexProp(textSet && textSet.hi, "--text-hi");
      hexProp(textSet && textSet.mid, "--text-mid");
      hexProp(textSet && textSet.dim, "--text-dim");
    } catch {}
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    applySavedColorsForTheme(theme);
    const toggle = document.getElementById("themeToggle");
    const label = document.getElementById("themeToggleLabel");
    if (toggle) toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    if (label) label.textContent = theme === "light" ? "Light" : "Dark";
  }

  function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      writePreference(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // The <head> boot script only reads localStorage once, at load - it has
  // no way to know the theme changed in a DIFFERENT already-open tab/window
  // of this same site. Without this, switching between several tabs opened
  // before/after a theme change shows some in light and some in dark until
  // each one is manually reloaded. The native "storage" event fires in
  // every OTHER same-origin tab the instant one of them writes to
  // localStorage (never in the tab that made the change), so this brings
  // every open tab back in sync live, no reload required.
  const COLOR_STORAGE_KEYS = ["ads:colors", "ads:bg-colors", "ads:status-colors", "ads:neutral-colors", "ads:text-colors"];
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (e.key === THEME_KEY) {
      applyTheme(e.newValue === "dark" ? "dark" : "light");
      return;
    }
    if (COLOR_STORAGE_KEYS.includes(e.key)) {
      applySavedColorsForTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
    }
  });

  const currentFile = location.pathname.split("/").pop() || "overview.html";

  function markActiveLink() {
    const links = Array.from(document.querySelectorAll(".nav-link"));
    const currentHash = location.hash || "";

    // Prefer an exact file+hash match (e.g. landing on components.html#button
    // from another page); several sidebar links can share the same file, so
    // matching on file alone would light up every sibling at once.
    let matched = currentHash
      ? links.find((link) => {
          const href = link.getAttribute("href") || "";
          const [file, hash] = href.split("#");
          return file === currentFile && `#${hash || ""}` === currentHash;
        })
      : null;

    // No hash in the URL (a bare file load): fall back to the first sidebar
    // link for this file, so exactly one item is active instead of every
    // link that happens to point at the same page.
    if (!matched){
      matched = links.find((link) => {
        const href = link.getAttribute("href") || "";
        return href.split("#")[0] === currentFile;
      });
    }

    if (matched) matched.classList.add("is-active");
    return matched;
  }

  function initCollapsibleGroups(forceExpandGroup) {
    document.querySelectorAll(".nav-group.is-collapsible").forEach((group) => {
      const key = group.dataset.group;
      const toggle = group.querySelector(".as-toggle");
      const items = group.querySelector(".nav-group-items");
      if (!toggle || !key) return;

      if (items && !items.id) items.id = "nav-items-" + key;
      if (items) toggle.setAttribute("aria-controls", items.id);

      const storedCollapsed = readPreference(COLLAPSE_KEY_PREFIX + key) === "1";
      const shouldForceOpen = group === forceExpandGroup;
      const collapsedNow = storedCollapsed && !shouldForceOpen;
      group.classList.toggle("is-collapsed", collapsedNow);
      toggle.setAttribute("aria-expanded", String(!collapsedNow));

      toggle.addEventListener("click", () => {
        const collapsed = group.classList.toggle("is-collapsed");
        toggle.setAttribute("aria-expanded", String(!collapsed));
        writePreference(COLLAPSE_KEY_PREFIX + key, collapsed ? "1" : "0");
      });
    });
  }

  function initSidebarSearch() {
    const input = document.getElementById("globalSearch");
    if (!input) return;

    const allLinks = Array.from(document.querySelectorAll(".nav-link"));
    const allSubLabels = Array.from(document.querySelectorAll(".nav-subgroup-label"));
    const allGroups = Array.from(document.querySelectorAll(".nav-group"));

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      if (!query) {
        allLinks.forEach((l) => l.classList.remove("is-hidden"));
        allSubLabels.forEach((l) => l.classList.remove("is-hidden"));
        allGroups.forEach((g) => g.classList.remove("is-collapsed"));
        // restore persisted collapse state
        allGroups.forEach((g) => {
          const key = g.dataset.group;
          if (!key) return;
          const storedCollapsed = readPreference(COLLAPSE_KEY_PREFIX + key) === "1";
          g.classList.toggle("is-collapsed", storedCollapsed);
          const toggle = g.querySelector(".as-toggle");
          if (toggle) toggle.setAttribute("aria-expanded", String(!storedCollapsed));
        });
        return;
      }

      allSubLabels.forEach((l) => l.classList.add("is-hidden"));

      allLinks.forEach((link) => {
        const matches = link.textContent.trim().toLowerCase().includes(query);
        link.classList.toggle("is-hidden", !matches);
      });

      allGroups.forEach((group) => {
        const hasMatch = group.querySelectorAll(".nav-link:not(.is-hidden)").length > 0;
        if (group.classList.contains("is-collapsible")) {
          group.classList.toggle("is-collapsed", !hasMatch);
          const toggle = group.querySelector(".as-toggle");
          if (toggle) toggle.setAttribute("aria-expanded", String(hasMatch));
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" ) return;
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement?.isContentEditable || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      input.focus();
    });
  }

  // Component Guide (Human View / Machine View) - a delegated toggle
  // shared by every detail page's bottom "Component Guide" section, so no
  // per-page script is needed even though the guide's content differs on
  // every page.
  function initGuideViewToggle() {
    document.querySelectorAll(".component-guide").forEach((guide) => {
      const buttons = Array.from(guide.querySelectorAll(".guide-toggle-btn"));
      const panels = Array.from(guide.querySelectorAll(".guide-view-panel"));
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const view = btn.dataset.view;
          buttons.forEach((b) => {
            const active = b === btn;
            b.classList.toggle("is-active", active);
            b.setAttribute("aria-pressed", active ? "true" : "false");
          });
          panels.forEach((p) => { p.hidden = p.dataset.viewPanel !== view; });
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const activeLink = markActiveLink();
    initCollapsibleGroups(activeLink ? activeLink.closest(".nav-group") : null);
    initSidebarSearch();
    initThemeToggle();
    initGuideViewToggle();

    // A fresh page load always starts the sidebar scrolled to its top,
    // regardless of where the link you just clicked was - on a long list
    // (e.g. Data Display's Timeline, near the bottom) that leaves the
    // page you're now on invisible until you scroll down and find it
    // again by hand, every single time. Bring it into view automatically
    // instead. Runs after initCollapsibleGroups so this measures the
    // sidebar's final layout (once its own group has expanded), not a
    // stale one from before that group opened.
    if (activeLink) {
      requestAnimationFrame(() => {
        activeLink.scrollIntoView({ block: "center", behavior: "auto" });
      });
    }
  });
})();
