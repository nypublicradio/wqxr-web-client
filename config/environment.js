'use strict';

module.exports = function(environment) {

  function usingProxy() {
    return !!process.argv.filter(function (arg) {
      return arg.indexOf('--proxy') === 0;
    }).length;
  }

  const ALIEN_DOM_ROOT = environment === 'test' ? '#ember-testing' : 'body';

  let ENV = {
    modulePrefix: 'wqxr-web-client',
    environment,
    rootURL: '/',
    locationType: 'trailing-history',
    historySupportMiddleware: true,
    emberHifi: {
      connections: [{
        name: 'NativeAudio'
      }],
    },
    'ember-cli-mirage': {
      autostart: true // https://github.com/samselikoff/ember-cli-mirage/blob/master/CHANGELOG.md#how-it-works-in-different-types-of-tests
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    // required for what's on widget compat
    exportApplicationGlobal: true,
    QP_WHITELIST: ['q', 'scheduleStation', 'next', 'n'], // see puppy/settings/base_settings.py

    flashMessageDefaults: {
      preventDuplicates: true,
      timeout: 10000
    },
    queueAudioBumperURL: 'http://audio.wnyc.org/streambumper/streambumper000008_audio_queue.mp3',
    siteSlug: 'wqxr',
    siteName: 'WQXR',
    siteId: 2,
    clientSlug: 'wqxr_web',
    googleAPIv3Key: process.env.GOOGLE_API_V3_KEY,
    showsDiscoverStation: "wqxr",
    showsAPIKey: "symphony",
    moreShowsDiscoverStation: "archived-shows",
    moreShowsAPIKey: "mammoth",
    webRoot: process.env.WQXR_URL,
    wQXRLegacy: process.env.WQXR_LEGACY,
    adminRoot: process.env.ADMIN_ROOT,
    authAPI: process.env.AUTH_SERVICE,
    membershipAPI: process.env.MEMBERSHIP_SERVICE,
    etagAPI: process.env.ETAG_API,
    publisherAPI: process.env.PUBLISHER_API,
    platformEventsAPI: process.env.PLATFORM_EVENTS_SERVICE,
    pledgeDomain: process.env.PLEDGE_DOMAIN,
    wnycDonateURL: 'https://pledge3.wqxr.org/epledge/main?ref=button-donate-header',
    contentSecurityPolicy: {
      'connect-src': "'self' *.wnyc.net:* ws://*.wnyc.net:*",
      'style-src': "'self' 'unsafe-inline' *.wnyc.net:* *.wnyc.org cloud.typography.com fonts.googleapis.com www.google.com platform.twitter.com",
      'img-src': "'self' data: *",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' data: *",
      'object-src': "'self' *.wnyc.net:* *.wnyc.org *.moatads.com *.googlesyndication.com",
      'font-src': "'self' data: fonts.gstatic.com",
      'frame-src': "'self' *"
    },
    torii: {
      providers: {
        'facebook-connect': {
          appId: process.env.FB_APP || '1583385451706458',
          scope: 'user_friends,email',
          version: 'v2.9'
        }
      }
    },
    hotjar: {
      id: 467005,
      enabled: environment === 'production',
      forceSSL: true
    },
    alienDom: {
      toRemove: `${ALIEN_DOM_ROOT} > :not(.ember-view):not(#fb-root), ${ALIEN_DOM_ROOT} > head > link[rel=stylesheet]:not([href*=assets])`
    },
    fastboot: {
      hostWhitelist: process.env.HOST_WHITELIST ? process.env.HOST_WHITELIST.split(',') : []
    },
    googleTagManager: process.env.GOOGLE_TAG_MANAGER_ID || 'GTM-MZ2S75K',
    googleOptimize: process.env.GOOGLE_OPTIMIZE_ID,
    googleAnalytics: process.env.GOOGLE_ANALYTICS,
    googleAdManagerAdspot: process.env.GOOGLE_AD_MANAGER_ADSPOT

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    // ENV.LOG_LEGACY_LOADER = true;

    var mirageEnabled = !usingProxy();
    ENV['ember-cli-mirage'] = {
      // Mirage should be doing this automatically, but
      // it consideres the http-proxies we have in server/proxies
      // as a "proxy". We only want mirage to be disabled if we've
      // passed in --proxy to the command line
      enabled: mirageEnabled
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    ENV.queueAudioBumperURL = 'http://audio-bumper.com/thucyides.mp3';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.publisherAPI = 'http://example.com/api';
    ENV.adminRoot = 'http://admin.example.com';
    ENV.etagAPI = 'http://example.com/api/v1/browser_id/';
    ENV.webRoot = 'http://example.com';
    ENV.wQXRLegacy = 'http://example.com';
    ENV.authAPI = 'http://example.com';
    ENV.membershipAPI = 'http://example.com';
    ENV.platformEventsAPI = 'http://example.com';
    ENV.APP.autoboot = false;
    ENV.fastboot.hostWhitelist = ['/.*/'];

  }

  if (environment === 'production') {

  }

  return ENV;
};
