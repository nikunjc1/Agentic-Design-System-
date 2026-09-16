(() => {
  "use strict";

  const COLLAPSE_KEY_PREFIX = "ads:nav-collapsed:";
  const THEME_KEY = "ads:theme";

  // Preferences remain optional when browser storage is unavailable.
  function readPreference(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function writePreference(key, value) { try { localStorage.setItem(key, value); } catch {} }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const toggle = document.getElementById("themeToggle");
    const label = document.getElementById("themeToggleLabel");
    if (toggle) toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    if (label) label.textContent = theme === "light" ? "Light" : "Dark";
  }

  function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      writePreference(THEME_KEY, next);
      applyTheme(next);
    });
  }

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

    if (matched){
      matched.classList.add("is-active");
      return matched.closest(".nav-group");
    }
    return null;
  }

  function initCollapsibleGroups(forceExpandGroup) {
    document.querySelectorAll(".nav-group.is-collapsible").forEach((group) => {
      const key = group.dataset.group;
      const toggle = group.querySelector(".as-toggle");
      if (!toggle || !key) return;

      const storedCollapsed = readPreference(COLLAPSE_KEY_PREFIX + key) === "1";
      const shouldForceOpen = group === forceExpandGroup;
      group.classList.toggle("is-collapsed", storedCollapsed && !shouldForceOpen);

      toggle.addEventListener("click", () => {
        const collapsed = group.classList.toggle("is-collapsed");
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

  document.addEventListener("DOMContentLoaded", () => {
    const activeGroup = markActiveLink();
    initCollapsibleGroups(activeGroup);
    initSidebarSearch();
    initThemeToggle();
  });
})();
