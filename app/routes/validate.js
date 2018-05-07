import Route from '@ember/routing/route';
import DeauthenticatedRouteMixin from 'wqxr-web-client/mixins/deauthenticated-route-mixin';

export default Route.extend(DeauthenticatedRouteMixin, {
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    }
  }
});
