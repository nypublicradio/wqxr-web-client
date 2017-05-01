import Ember from 'ember';
import { readOnly } from 'ember-computed';
import get, {getProperties} from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default Ember.Component.extend({
  didAnimate: false,
  classNames: ['player-share-bar'],
  metrics: service(),
  metadata: readOnly('story.shareMetadata'),
  isOpen: true,
  actions: {
    popupShareWindow(destination, href) {
      console.log("popupsharewindow");
      const heights = {
        'Twitter': 433,
        'Facebook': 620
      };
      let {metadata={}, region, type} = getProperties(this, 'metadata', 'region', 'type');
      let {shareText, analyticsCode} = metadata;
      if (href) {
        let metrics = get(this, 'metrics');
        metrics.trackEvent('GoogleAnalytics', {
          category: 'Persistent Player',
          action: `Shared Story "${shareText}"`,
          label: `${region}|${analyticsCode}|${type}|${destination}`,
          });
        let features = `titlebar=no,close=no,width=600,height=${heights[destination]}`;
        window.open(href, '_blank', features);
      }
    },

    closeBar(){
      set(this,'isOpen', false);
      get(this, 'onDismiss')();
    }
  }
});
