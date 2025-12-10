// Global app configuration
window.APP_CONFIG = {
  // When true, frontend fakes success flows without server calls
  demoMode: false
};

// Allow easy overrides without code changes
(function () {
  try {
    var params = new URLSearchParams(window.location.search || '');
    if (params.get('demo') === '1') window.APP_CONFIG.demoMode = true;
    if (params.get('demo') === '0') window.APP_CONFIG.demoMode = false;

    var saved = localStorage.getItem('app_demo_mode');
    if (saved === '1') window.APP_CONFIG.demoMode = true;
    if (saved === '0') window.APP_CONFIG.demoMode = false;

    window.setDemoMode = function (on) {
      var v = !!on;
      window.APP_CONFIG.demoMode = v;
      localStorage.setItem('app_demo_mode', v ? '1' : '0');
      try { console.log('Demo mode set to', v); } catch (_) {}
    };
  } catch (e) {}
})();
