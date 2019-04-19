import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel() {
    if (get(this, 'session.isAuthenticated') || !this.get('username')) {
      this.transitionTo('/');
    }
  },

  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
