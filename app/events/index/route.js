import Route from '@ember/routing/route';
import { reads } from '@ember/object/computed';
import { get } from '@ember/object';

import { inject as service } from '@ember/service';

export default Route.extend({
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken(model) {
    return get(model, 'title');
  },
  model() {
    // django pages don't work w/ FastBoot, so only execute this in browser
    if (this.get('isFastBoot')) {
      return {'title': 'Events'}
    }
    return this.store.findRecord('django-page', 'events/');
  }
});
