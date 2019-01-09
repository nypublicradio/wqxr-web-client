import config from '../config/environment';
import { run } from '@ember/runloop';
import Component from '@ember/component';
import { get } from '@ember/object';

function optimize(context) {
  const dataLayer = get(context, 'dataLayer');
  console.log(dataLayer)
  if (dataLayer) {
    dataLayer.push({'event': 'optimize.activate'});
  }
}


export function initialize(appInstance) {
  if (typeof window !== 'undefined' && config.environment !== 'test') {
    console.log("initializing google analytics");
      // application.inject('route', 'foo', 'service:foo');
      appInstance.inject('component', 'dataLayer', 'service:nypr-metrics/data-layer');

      Component.reopen({
        didRender() {
          run.throttle(Component, optimize, this, 100);
          return this._super(...arguments);
        },
      });

      (function(a,s,y,n,c,h,i/*,d,e*/){s.className+=' '+y;
    h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
    (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);
    })(window,document.documentElement,'async-hide','dataLayer', 2000,{[config.googleOptimize]:true});



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
