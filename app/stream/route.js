import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  googleAds:  service(),
  titleToken: 'Listen Live to WQXR, New Sounds, Operavore, and WQXR\'s American Standards',

  model() {
    return this.store.findAll('stream', {reload:true}).then(streams => {
      return streams.filterBy('liveWQXR').sortBy('sitePriority')
        .concat(streams.filterBy('liveWNYC').sortBy('sitePriority')).uniq();
    });
  },

  afterModel() {
    this.get('googleAds').doTargeting();
  }
});
