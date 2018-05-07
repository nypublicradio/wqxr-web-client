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

    // This project's in-repo addon configuration confuses Mirage and makes it
    // think we are distributing this project as an addon. Because of this it assumes
    // we're using Mirage to develop our addon tests using /tests/dummy/mirage as our
    // mirage folder. This config overrides the mirage folder to use the correct location
    // for developing an Ember application.
    'ember-cli-mirage': { directory: defaults.project.root + '/mirage' },
    'mirage-support': {
      includeAll: true
    },
     useWaypoints: true
  });

  try {
    fs.accessSync('vendor/modernizr/modernizr-build.js');
    app.import('vendor/modernizr/modernizr-build.js');
  } catch(e) {
    console.log('there was a problem importing the modernizr build. please run grunt modernizr:dist first.');
  }

  app.import('vendor/polyfills/url.js');
  app.import('bower_components/normalize.css/normalize.css');
  // All legacy JS modules that are directly called from this ember
  // app should be imported into the app's own build here. Notice that
  // these are symlinked to their original locations in the puppy
  // source.

  return app.toTree();
};
