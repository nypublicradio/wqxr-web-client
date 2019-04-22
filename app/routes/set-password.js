import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  model(params) {
    if (get(this, 'session.isAuthenticated')) {
      this.transitionTo('/profile');
    } else if (!get(params, 'username')){
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
