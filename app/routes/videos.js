import Route from '@ember/routing/route';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';


export default Route.extend({
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken(model) {
    return this.get('title', model);
  },
  model() {
    if (this.get('isFastBoot')) {
      return {'title': ''}
    }
    return this.store.findRecord('django-page', 'videos/');
  }
});
