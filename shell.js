(() => {
  "use strict";

  const COLLAPSE_KEY_PREFIX = "ads:nav-collapsed:";
  const THEME_KEY = "ads:theme";
  // Coalesce rapid property edits before rebuilding a potentially large state matrix.
  const renderTimers = new WeakMap();
  window.ADS_scheduleRender = function(render) {
    clearTimeout(renderTimers.get(render));
    renderTimers.set(render, setTimeout(() => { renderTimers.delete(render); render(); }, 80));
  };

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

    updateBrandColorDotTitle();
  }

  // The topbar swatch's own background already tracks the active brand
  // color correctly (it's just var(--red-500), which the block above keeps
  // current) - the actual gap was that nothing ever showed WHICH color that
  // is, only a generic "Active brand color" tooltip with no value in it.
  // Exposed on window so foundations.js's own Save action (which applies
  // the new brand color to the current page immediately, no reload
  // required) can refresh this same tooltip right away too.
  function updateBrandColorDotTitle() {
    const dot = document.getElementById("brandColorDot");
    if (!dot) return;
    const hex = getComputedStyle(document.documentElement).getPropertyValue("--red-500").trim();
    dot.title = hex ? `Active brand color: ${hex.toUpperCase()}` : "Active brand color";
  }
  window.ADS_updateBrandColorDotTitle = updateBrandColorDotTitle;

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
    links.forEach(link => { link.classList.remove('is-active'); link.removeAttribute('aria-current'); });
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

    // Every one of a component's own type/detail pages (table-default.html,
    // button-primary.html, select-dropdown.html, ...) is reached by a
    // dynamic window.location.href navigation, not a sidebar <a href> - the
    // sidebar only ever links to the listing page (table.html,
    // components.html#button). So on all 69 of those pages, neither check
    // above ever matches anything, and the sidebar was left with no active
    // item at all - never highlighted, never scrolled into view. Every one
    // of those pages already carries a "Back to X types" link whose href is
    // exactly its own listing page (verified: all 69 point at a real
    // sidebar link) - reuse that instead of re-deriving the listing
    // filename from this page's own name, which would mean guessing where
    // the component name ends and the type key begins (both can contain
    // hyphens, e.g. "date-picker-default").
    if (!matched){
      const backLink = document.querySelector(".back-link");
      const backHref = backLink ? backLink.getAttribute("href") || "" : "";
      if (backHref){
        const [backFile, backHash] = backHref.split("#");
        matched = links.find((link) => {
          const href = link.getAttribute("href") || "";
          const [file, hash] = href.split("#");
          return file === backFile && (hash || "") === (backHash || "");
        });
      }
    }

    if (matched) { matched.classList.add("is-active"); matched.setAttribute('aria-current', 'page'); }
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

  // Mobile drawer - the sidebar itself is unchanged (still the same search,
  // collapsible groups, active-link scroll as desktop); this only adds a
  // way to open/close it below 900px, where shell.css now slides it in as
  // an overlay instead of hiding it outright. Injected at runtime instead
  // of duplicating a hamburger button into all 157 pages' own topbar
  // markup - .sidebar-menu-toggle is display:none above 900px anyway.
  function initSidebarDrawer() {
    const sidebar = document.querySelector(".app-sidebar");
    const topbarRight = document.querySelector(".topbar-right");
    if (!sidebar || !topbarRight) return;

    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-drawer-backdrop";
    document.body.appendChild(backdrop);

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "sidebar-menu-toggle";
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-expanded", "false");
    sidebar.id ||= 'site-navigation';
    toggle.setAttribute('aria-controls', sidebar.id);
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    topbarRight.insertAdjacentElement("beforebegin", toggle);

    const narrow = matchMedia('(max-width: 900px)');
    const main = document.querySelector('.app-main');
    const brand = document.querySelector('.brand');
    let previousOverflow = '';
    function syncClosedState() { sidebar.inert = narrow.matches && !sidebar.classList.contains('is-open'); }
    syncClosedState();

    function openDrawer(){
      previousOverflow = document.body.style.overflow;
      sidebar.classList.add("is-open");
      backdrop.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute('aria-label', 'Close navigation menu');
      sidebar.inert = false;
      if (main) main.inert = true;
      if (brand) brand.inert = true;
      topbarRight.inert = true;
      document.body.style.overflow = 'hidden';
      sidebar.querySelector('input, a, button')?.focus();
    }
    function closeDrawer(){
      sidebar.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute('aria-label', 'Open navigation menu');
      if (main) main.inert = false;
      if (brand) brand.inert = false;
      topbarRight.inert = false;
      document.body.style.overflow = previousOverflow;
      syncClosedState();
      if (narrow.matches) toggle.focus();
    }

    toggle.addEventListener("click", () => {
      if (sidebar.classList.contains("is-open")) closeDrawer(); else openDrawer();
    });
    backdrop.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("is-open")) closeDrawer();
      if (e.key === 'Tab' && sidebar.classList.contains('is-open')) {
        const items = [toggle, ...sidebar.querySelectorAll('input, a[href], button')].filter(n => n.getClientRects().length && !n.disabled);
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    narrow.addEventListener('change', () => { if (!narrow.matches && sidebar.classList.contains('is-open')) closeDrawer(); syncClosedState(); });
    // Closing on nav so picking a page doesn't leave the drawer sitting
    // open over the new page underneath it.
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest(".nav-link")) closeDrawer();
    });
  }

  function initSidebarSearch() {
    const input = document.getElementById("globalSearch");
    if (!input) return;

    const allLinks = Array.from(document.querySelectorAll(".nav-link"));
    const allSubLabels = Array.from(document.querySelectorAll(".nav-subgroup-label"));
    const allGroups = Array.from(document.querySelectorAll(".nav-group"));

    // A query matching nothing used to just leave every group empty with no
    // explanation - the sidebar went blank under the top-level headers with
    // no indication of why, or that the search itself was the cause. Built
    // once, hidden by default, and toggled instead of rebuilt per keystroke.
    const nav = document.querySelector(".sidebar-nav");
    const emptyState = document.createElement("p");
    emptyState.className = "sidebar-search-empty";
    emptyState.hidden = true;
    if (nav) nav.appendChild(emptyState);

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      if (!query) {
        allLinks.forEach((l) => l.classList.remove("is-hidden"));
        allSubLabels.forEach((l) => l.classList.remove("is-hidden"));
        allGroups.forEach((g) => g.classList.remove("is-collapsed"));
        emptyState.hidden = true;
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

      const anyMatch = allLinks.some((l) => !l.classList.contains("is-hidden"));
      emptyState.hidden = anyMatch;
      if (!anyMatch) emptyState.textContent = `No results for "${input.value.trim()}"`;
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" ) return;
      const tag = document.activeElement && document.activeElement.tagName;
      // "dialog[open]" alone missed the welcome modal (overview.html), which
      // is a plain div toggled via a "hidden" attribute on its overlay, not
      // a native <dialog> - this global shortcut kept stealing focus out of
      // that modal's own trap while it was open. The site's other
      // role="dialog" elements (Modal/Drawer/Tour's Do/Don't illustrations)
      // are static, always-visible demo markup, not real toggleable
      // overlays, so they're deliberately not matched here.
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement?.isContentEditable || document.querySelector("dialog[open]") || document.querySelector('[data-role="welcome-overlay"]:not([hidden])')) return;
      e.preventDefault();
      if (document.querySelector('.app-sidebar')?.inert) document.querySelector('.sidebar-menu-toggle')?.click();
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
    initSidebarDrawer();
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
  window.addEventListener('hashchange', markActiveLink);
})();
