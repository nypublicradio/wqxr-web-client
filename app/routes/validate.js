import Route from '@ember/routing/route';
import DeauthenticatedRouteMixin from 'wqxr-web-client/mixins/deauthenticated-route-mixin';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Route.extend(DeauthenticatedRouteMixin, {
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),
  titleToken: 'Validate',

  setupController() {
    // don't render this page in fastboot. It causes a double confirmation when
    // page loads.
    if (this.get('isFastBoot')){
      return;
    }
    return this._super(...arguments);
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
