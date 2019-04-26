import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Route.extend({
  poll: service(),
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
    // django pages don't work w/ FastBoot, so only execute this in browser
    if (this.get('isFastBoot')) {
      return {'title': 'Play History'}
    }
    // year, month, day, and scheduleStation will all be available vars
    return this.store.findRecord('django-page', `playlist-daily/${year}/${month}/${day}/?scheduleStation=${scheduleStation}`, {reload: true});
  },

  actions: {
    didTransition() {
      this.get('poll').addPoll({
        interval: 60 * 1000 * 5,
        callback: () => this.refresh(),
        label: 'refresh'
      });
    },
    willTransition() {
      this.get('poll').clearPollByLabel('refresh');
    }
  }
});
