import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { get } from "@ember/object";

export default Route.extend({
  dataLayer: service('nypr-metrics/data-layer'),
  metadata: service(),

  beforeModel() {
    schedule('afterRender', () => {
      this.get('dataLayer').send404();
    });
  },
  afterModel(model, transition) {
    this.get('metadata').setHeadData({
      path: get(transition, 'intent.url'),
    });
  },
});
