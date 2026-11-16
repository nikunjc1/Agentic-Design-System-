/* Retain old links while keeping one home for each guide. */
(() => {
 if(window.ADSNavigation?.redirecting)return;
 const destinations={'patterns.html':'overview.html','templates.html':'overview.html','figma-export.html':'md-export.html?format=figma','values.html':'principles.html#design-values','ai-generator.html':'md-export.html#ai-handoff','settings.html':'overview.html#preferences'};
 const destination=destinations[location.pathname.split('/').pop()];
 if(!destination)return;
 if(window.ADSNavigation)window.ADSNavigation.replace(destination);
 else location.replace(destination);
})();
