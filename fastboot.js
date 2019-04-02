/* eslint-env node */

const fastboot = require('nypr-fastboot');

require('dotenv').config();

const server = fastboot({
  bucket: process.env.AWS_BUCKET,
  env: process.env.ENV,
  fastbootConfig: {resilient: true},
  healthCheckerUA: 'ELB-HealthChecker',
  manifestKey: process.env.FASTBOOT_MANIFEST,
  sentryDSN: process.env.SENTRY_DSN,
  serviceName: process.env.SERVICE_NAME
});

server.start();
