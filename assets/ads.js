// Ad/Sponsor rails: keep hidden unless explicitly activated in config.js
(function () {
  var cfg = window.SITE_CONFIG || {};

  var sponsor = document.getElementById("sponsor");
  if (sponsor) {
    if (cfg.SPONSOR_ACTIVE && cfg.SPONSOR_TEXT) {
      sponsor.classList.remove("is-off");
      sponsor.textContent = cfg.SPONSOR_TEXT;
      if (cfg.SPONSOR_HREF) {
        sponsor.style.cursor = "pointer";
        sponsor.onclick = function () { window.location.href = cfg.SPONSOR_HREF; };
      }
    } else {
      sponsor.classList.add("is-off");
    }
  }

  function mountAd(containerId, slotId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    if (!cfg.ADS_ACTIVE || !slotId) {
      el.classList.add("is-off");
      return;
    }
    el.classList.remove("is-off");

    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", cfg.ADSENSE_PUB_ID);
    ins.setAttribute("data-ad-slot", slotId);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    el.appendChild(ins);

    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}

    setTimeout(function () {
      if (!el.querySelector("iframe")) el.classList.add("is-off");
    }, 1500);
  }

  mountAd("adTop", cfg.AD_SLOT_TOP);
  mountAd("adBottom", cfg.AD_SLOT_BOTTOM);

  // Detect if inline AdSense units actually filled — add .active only when ad renders
  document.addEventListener("DOMContentLoaded", function () {
    var units = document.querySelectorAll(".adsense-unit");
    units.forEach(function (unit) {
      var ins = unit.querySelector("ins.adsbygoogle");
      if (!ins) return;
      // Check after a short delay if the ins got dimensions (ad filled)
      setTimeout(function () {
        try {
          var filled = ins.querySelector("iframe");
          if (filled && filled.offsetWidth > 0) {
            unit.classList.add("active");
          }
        } catch (e) {}
      }, 2000);
    });
  });
})();
