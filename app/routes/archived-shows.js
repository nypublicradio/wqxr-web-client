import Route from '@ember/routing/route';

//import RSVP from 'rsvp';
import ENV from 'wqxr-web-client/config/environment';

export default Route.extend({
  titleToken: 'More Shows',
  model() {
    return this.store.query('show', { discover_station: ENV.moreShowsDiscoverStation, api_key: ENV.moreShowsAPIKey });
  },
  activate(){
    window.scrollTo(0,0);
  }
});
