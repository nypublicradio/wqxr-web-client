import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Route.extend({
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken(model) {
    return get(model, 'title');
  },

  model({ year, month }) {
    // django pages don't work w/ FastBoot, so only execute this in browser
    if (this.get('isFastBoot')) {
      return {'title': 'Events'}
    }
    
    return this.store.findRecord('django-page', `events/${year}/${month}/`);
  },
});
