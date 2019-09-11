import config from '../config/environment';
import { run } from '@ember/runloop';
import Component from '@ember/component';
import { get } from '@ember/object';


// this function pushes an event to the data layer that triggers the google
// optimize change list to run. It is called within every component's didRender
// hook in order to render the optimize changes in the initial paint of the Component,
// rather than in a seperate paint, which would create a confusing repaint that is visible to the user.
// This is necessary for any ember app not on fastboot, as apps not on fastboot render some parts
// of pages when asynchronous data calls have completed. For apps on fastboot, see the
// wnyc-studios-web-client implementation for a reference on implementing optimize.
function optimize(context) {
  const dataLayer = get(context, 'dataLayer');
  if (dataLayer) {
    dataLayer.push({'event': 'optimize.activate'});
  }
}


export function initialize(appInstance) {
  appInstance.inject('component', 'dataLayer', 'service:nypr-metrics/data-layer');

  Component.reopen({
    didRender() {
      run.throttle(Component, optimize, this, 100);
      return this._super(...arguments);
    },
  });

  if (typeof window !== 'undefined' && typeof document !== 'undefined' && config.environment !== 'test') {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    /*global ga*/
    ga('create', config.googleAnalytics, 'auto');
    ga('require', config.googleOptimize);

    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',config.googleTagManager);
  }
}

export default {
  initialize
};
