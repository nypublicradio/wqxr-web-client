// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/* eslint-env node */
require('dotenv').config();

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Pull baseUrl from the .env file (if baseUrl isn't configured), with a
  // fallback:
  config.baseUrl =
    config.baseUrl || process.env.WQXR_URL || 'http://localhost:4200';

  // Drop all environment variables into Cypress config.env
  Object.keys(process.env).forEach(envkey => {
    if (envkey.indexOf('PROD') < 0 || envkey.indexOf('PROD')) {
      config.env[envkey] = process.env[envkey];
    }
  });

  return config;
};
