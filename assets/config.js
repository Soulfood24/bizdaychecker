// bizdaychecker.com — site config (rates, thresholds, constants)
window.SITE_CONFIG = {
  siteName: "BizDayChecker.com",
  siteDomain: "bizdaychecker.com",
  siteDescription: "Free business day calculator. Add business days to a date or count business days between two dates. U.S. federal holidays are included automatically.",
  currency: "USD",
  taxAuthority: "IRS",

  // Ad / Sponsor rails
  ADS_ACTIVE: false,
  SPONSOR_ACTIVE: false,
  ADSENSE_PUB_ID: "ca-pub-7744853829365165",
  AD_SLOT_TOP: "",
  AD_SLOT_BOTTOM: "",
  SPONSOR_TEXT: "",
  SPONSOR_HREF: "",

  // Calculator constants
  WEEKEND_DAYS: [0, 6], // Sunday=0, Saturday=6
  DEFAULT_DAYS_TO_ADD: 1,
  MIN_DAYS_TO_ADD: 0,

  // Federal holiday observance rule
  HOLIDAY_OBSERVANCE_RULE: "OPM Federal Holiday Observance: When a fixed-date federal holiday falls on a Saturday, it is observed on the preceding Friday. When it falls on a Sunday, it is observed on the following Monday.",

  // Data source
  DATA_SOURCE: "U.S. Office of Personnel Management (OPM) — Federal Holiday Observance Rules"
};
