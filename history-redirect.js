/* Backward-compatible in-app History links now open the unified project hub. */
(() => {
 if(window.ADSNavigation?.redirecting)return;
 if(window.ADSNavigation)window.ADSNavigation.replace('overview.html#projects');
 else location.replace('overview.html#projects');
})();
