(() => {
  "use strict";

  const COLLAPSE_KEY_PREFIX = "ads:nav-collapsed:";
  const THEME_KEY = "ads:theme";
  const DENSITY_KEY = "ads:density";
  const DIRECTION_KEY = "ads:direction";
  // Coalesce rapid property edits before rebuilding a potentially large state matrix.
  const renderTimers = new WeakMap();
  window.ADS_scheduleRender = function(render) {
    clearTimeout(renderTimers.get(render));
    renderTimers.set(render, setTimeout(() => { renderTimers.delete(render); render(); }, 80));
  };

  // Preferences remain optional when browser storage is unavailable.
  function readPreference(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function writePreference(key, value) { try { localStorage.setItem(key, value); } catch {} }

  // Foundation audit X06 - every Foundation editor (Colors, Spacing, Radius,
  // Grid & Layout, Borders, Shadows, Icons, Typography) used to call
  // localStorage.setItem/JSON.parse directly, each editor silently defaulting
  // on its own if a read came back corrupt and simply throwing, uncaught, if
  // a write failed (quota exceeded, storage unavailable in private browsing,
  // etc.) - after the on-screen selection had already visually changed. One
  // shared, fail-safe path for every Foundation write/read, so a storage
  // failure always surfaces instead of silently looking like success, and an
  // old, valid value is never overwritten by a write that didn't actually
  // complete (the browser itself already leaves the prior value in place
  // when setItem throws - this only makes that failure visible instead of
  // silent). See the "Foundation editor state model" section on
  // accessibility.html for the full recovery matrix this implements.
  let storageNoticeEl = null;
  let storageNoticeTimer = null;
  function showStorageNotice(message) {
    if (!storageNoticeEl) {
      storageNoticeEl = document.createElement("div");
      storageNoticeEl.className = "ads-storage-notice";
      storageNoticeEl.setAttribute("role", "status");
      storageNoticeEl.setAttribute("aria-live", "polite");
      (document.body || document.documentElement).appendChild(storageNoticeEl);
    }
    storageNoticeEl.textContent = message;
    storageNoticeEl.classList.add("is-visible");
    clearTimeout(storageNoticeTimer);
    storageNoticeTimer = setTimeout(() => storageNoticeEl.classList.remove("is-visible"), 6000);
  }
  window.ADSStorage = {
    // Returns true/false instead of throwing, so a caller's own visual
    // selection and its persisted state never silently disagree.
    safeSet(key, value) {
      if (!window.ADSFoundationModel.validRecord(key, value)) {
        this.lastWriteSucceeded = false;
        showStorageNotice('Complete the invalid settings before saving. Your previous saved values are still active.');
        return false;
      }
      try {
        localStorage.setItem(key, JSON.stringify(value));
        this.lastWriteSucceeded = true;
        window.dispatchEvent(new CustomEvent('ads:foundation-change', { detail:{key,value} }));
        return true;
      } catch (e) {
        console.warn(`ADS storage: write to "${key}" failed - the previous saved value, if any, is unchanged.`, e);
        showStorageNotice("Your last change couldn't be saved (storage is full or unavailable) - it's still shown here, but may not persist. Try freeing up space or a different browser.");
        this.lastWriteSucceeded = false;
        window.dispatchEvent(new CustomEvent('ads:foundation-change', { detail:{key,value,unsaved:true} }));
        return false;
      }
    },
    safeRemove(key) {
      try {
        localStorage.removeItem(key);
        this.lastWriteSucceeded = true;
        window.dispatchEvent(new CustomEvent('ads:foundation-change', {detail:{key,removed:true}}));
        return true;
      } catch {
        this.lastWriteSucceeded = false;
        showStorageNotice("Reset couldn't be saved. Your previous settings are still active.");
        return false;
      }
    },
    // Returns the parsed value, or null for "nothing saved" AND for "storage
    // unavailable"/"corrupt JSON" alike - callers already treat null as
    // "use the documented default," so a corrupt record degrades the same
    // way a missing one always did, it just no longer does so silently.
    safeGet(key) {
      let raw;
      try { raw = localStorage.getItem(key); }
      catch (e) {
        console.warn(`ADS storage: read of "${key}" failed - showing this section's default instead.`, e);
        showStorageNotice("Saved settings couldn't be read from storage right now - showing this section's defaults instead.");
        return null;
      }
      if (raw === null || raw === undefined) return null;
      try {
        const value = JSON.parse(raw);
        if (!window.ADSFoundationModel.validRecord(key, value)) throw new Error('Invalid saved settings');
        return value;
      }
      catch (e) {
        console.warn(`ADS storage: value for "${key}" was corrupt JSON - reset to default instead of guessed at.`, e);
        showStorageNotice("A saved value looked corrupted, so it was reset to its default instead of being guessed at.");
        return null;
      }
    },
  };

  // Brand and surface colors can now be set independently per theme
  // (foundations.html), so switching theme live has to re-read and
  // re-apply that theme's saved values - the <head> boot script only runs
  // once, at load, for whichever theme was active then.
  function applySavedColorsForTheme() {
    window.ADSFoundation.apply();
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

  window.ADS_applySavedRadius = () => window.ADSFoundation.apply();
  window.ADS_applySavedTypographyFont = () => window.ADSFoundation.apply();
  function applySavedRadius() { window.ADSFoundation.apply(); }
  function applySavedTypographyFont() { window.ADSFoundation.apply(); }

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

  // Sitewide density, same pattern as theme: one attribute on <html>, read
  // once at boot (theme-init.js) to avoid a flash of the wrong density,
  // then live-toggleable and synced across tabs the same way theme is.
  function applyDensity(density) {
    document.documentElement.setAttribute("data-density", density);
    const toggle = document.getElementById("densityToggle");
    const label = document.getElementById("densityToggleLabel");
    if (toggle) toggle.setAttribute("aria-pressed", density === "compact" ? "true" : "false");
    if (label) label.textContent = density === "compact" ? "Compact" : "Comfortable";
  }
  window.ADS_applyDensity = applyDensity;

  function initDensityToggle() {
    const toggle = document.getElementById("densityToggle");
    applyDensity(document.documentElement.getAttribute("data-density") || "comfortable");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-density") === "compact" ? "compact" : "comfortable";
      const next = current === "compact" ? "comfortable" : "compact";
      writePreference(DENSITY_KEY, next);
      applyDensity(next);
    });
  }

  // Direction, same pattern again: an attribute already native to <html>
  // (dir), read once at boot to avoid a flash of the wrong direction,
  // then live-toggleable and synced across tabs like theme/density.
  function applyDirection(direction) {
    document.documentElement.setAttribute("dir", direction);
    const toggle = document.getElementById("directionToggle");
    const label = document.getElementById("directionToggleLabel");
    if (toggle) toggle.setAttribute("aria-pressed", direction === "rtl" ? "true" : "false");
    if (label) label.textContent = direction === "rtl" ? "Right-to-left" : "Left-to-right";
  }
  window.ADS_applyDirection = applyDirection;

  function initDirectionToggle() {
    const toggle = document.getElementById("directionToggle");
    applyDirection(document.documentElement.getAttribute("dir") || "ltr");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("dir") === "rtl" ? "rtl" : "ltr";
      const next = current === "rtl" ? "ltr" : "rtl";
      writePreference(DIRECTION_KEY, next);
      applyDirection(next);
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
  const COLOR_STORAGE_KEYS = ["ads:colors", "ads:bg-colors", "ads:status-colors", "ads:neutral-colors"];
  // Foundation audit C07 - "ads:text-colors" was a saved record from a Text
  // Colors editor section that was removed from foundations.html (Typography's
  // per-level colors are the one place for text color now - see
  // FOUNDATION_TOKEN_MAP in experience.js). Nothing writes this key anymore,
  // but shell.js kept silently reading and applying it on every boot for
  // anyone who'd saved one before it was removed - invisible customization,
  // with no UI left to see, edit or reset it, and excluded from the
  // Foundation export map entirely. Retired: stop applying it, and clear any
  // pre-existing record so it doesn't linger as dead, inexplicable state.
  try { localStorage.removeItem("ads:text-colors"); } catch {}
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (e.key === THEME_KEY) {
      applyTheme(e.newValue === "dark" ? "dark" : "light");
      return;
    }
    if (e.key === DENSITY_KEY) {
      applyDensity(e.newValue === "compact" ? "compact" : "comfortable");
      return;
    }
    if (e.key === DIRECTION_KEY) {
      applyDirection(e.newValue === "rtl" ? "rtl" : "ltr");
      return;
    }
    if (COLOR_STORAGE_KEYS.includes(e.key)) {
      applySavedColorsForTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
      return;
    }
    if (e.key === "ads:radius") {
      applySavedRadius();
      return;
    }
    if (e.key === "ads:typography") {
      applySavedTypographyFont();
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
    initDensityToggle();
    initDirectionToggle();
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
