import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  dataLayer: service('nypr-metrics/data-layer'),
  metadata: service(),
  titleToken(model) {
    return model ? get(model, 'title') : '';
  },
  pageType: 'General Flatpage',
  model({ flatpage_path }) {
    return this.store.query('flat-page', {
        filter: {
          url: '/' + flatpage_path
        }
      }).then(function(flatPages) {
        return flatPages.get("firstObject");
      }).catch((err) => {
        if (!err.isAdapterError) {
          throw(err);
        } else {
          this.transitionTo('404', `${flatpage_path}`);
        }
      });
  },
  afterModel(model, transition) {
    this.get('metadata').setHeadData({
      path: get(transition, 'intent.url'),
    });
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('flatPage', model);
  },
  actions: {
    didTransition() {
      if (window && window.document) {
        this.get('dataLayer').push('Page Type', this.get('pageType'));
      }
      return true;
    },
    willTransition() {
      this.get('dataLayer').clear('Page Type');
      return true;
    }
  }
});
