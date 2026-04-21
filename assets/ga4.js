// bizdaychecker.com — GA4 loader
(function () {
  var id = window.SITE_CONFIG && window.SITE_CONFIG.GA4_MEASUREMENT_ID;
  if (!id || id === "G-XXXXXXXXXX") return; // skip if placeholder
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", id);
})();
