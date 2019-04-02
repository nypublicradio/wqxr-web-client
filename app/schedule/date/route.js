import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Route.extend({
  googleAds: service(),
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  titleToken(model) {
    return get(model, 'title');
  },
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
  model({ year, month, day, scheduleStation }) {
    if (this.get('isFastBoot')) {
      return {'title': 'Schedule'}
    }
    // year, month, day, and scheduleStation will all be available vars
    return this.store.findRecord('django-page', `schedule/${year}/${month}/${day}/?scheduleStation=${scheduleStation}`);
  },
  afterModel() {
    this.get('googleAds').doTargeting();
  }
});
