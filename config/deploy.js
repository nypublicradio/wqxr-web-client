/* eslint-env node */
var VALID_DEPLOY_TARGETS = [
  'demo',
  'production'
];

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: 'production'
    },

    gzip: {
      filePattern: '**/*.{js,css,ico,map,xml,txt,svg,eot,ttf,woff,woff2}'
    },

    pipeline: {},

    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION
    },

    's3-index': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_DEFAULT_REGION,
      allowOverwrite: true,
    },

    'fastboot-app-server-aws': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION,
    },

    'json-config': {
      jsonBlueprint(context, pluginHelper) {
        var jsonBlueprint = pluginHelper.readConfigDefault('jsonBlueprint');
        jsonBlueprint.script.includeContent = true;
        return jsonBlueprint;
      }
    }
  };

  if (!VALID_DEPLOY_TARGETS.includes(deployTarget) && !deployTarget.startsWith('qa')) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }

  if (deployTarget.startsWith('qa:')) {
    ENV.pipeline.disabled = {
      'fastboot-app-server': true,
      'fastboot-app-server-aws': true,
    };
    ENV['s3-index'].prefix = deployTarget.replace('qa:', '');
  }

  if (deployTarget === 'production') {
    // remove JS sourcemaps from production
    // ENV.s3.filePattern = '**/*.{js,css,png,gif,ico,jpg,xml,txt,svg,swf,eot,ttf,woff,woff2}';
  }

  return ENV;
};
