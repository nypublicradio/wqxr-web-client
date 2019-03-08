'use strict';
var fs = require('fs');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const env = EmberApp.env();

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      enabled: env === 'production',
      prepend: process.env.FINGERPRINT_PREPEND_URL
    },
    sourcemaps: {
      enabled: true,
    },
    storeConfigInMeta: env !== 'development',
    'mirage-support': {
      includeAll: true
    },
    useWaypoints: true,
    'ember-cli-babel': { includePolyfill: true },
  });

  try {
    fs.accessSync('vendor/modernizr/modernizr-build.js');
    app.import('vendor/modernizr/modernizr-build.js', {
      using: [{transformation: 'fastbootShim'}],
    });
  } catch(e) {
    console.log('there was a problem importing the modernizr build. please run grunt modernizr:dist first.');
  }

  app.import('vendor/polyfills/url.js');
  app.import('node_modules/normalize.css/normalize.css');
  app.import('node_modules/jquery-migrate/dist/jquery-migrate.min.js', {
    using: [{transformation: 'fastbootShim'}],
  });
  // All legacy JS modules that are directly called from this ember
  // app should be imported into the app's own build here. Notice that
  // these are symlinked to their original locations in the puppy
  // source.

  return app.toTree();
};
