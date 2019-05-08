import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  titleToken: 'Profile',
  
  currentUser: service(),
  headData: service(),

  model() {
    return this.get('currentUser.user');
  },
  setupController(controller, model) {
    controller.set('orders', this.store.findAll('order'));
    controller.send('updateEmailStatus', get(model, 'email'));
    return this._super(controller, model);
  },
  actions: {
    didTransition() {
      this.get('headData').set('enableZendeskWidget', true);
      //shows the zendesk widget if prev loaded
      if (zE && typeof zE.show === "function") {
        zE.show();
      }
    },
    willTransition() {
      //hide the zendesk Widget
      if (zE && typeof zE.hide === "function") {
        zE.hide();
      }
    }
  }
});
