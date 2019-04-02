import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Route.extend({
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken(model) {
    return get(model, 'title');
  },
  model({url_path}) {
    if (this.get('isFastBoot')) {
      return {'title': ''}
    }
    return this.store.findRecord('django-page', `events/${url_path}`.replace(/\/*$/, '/'));
  }
});
