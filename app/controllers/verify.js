import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'wqxr-web-client/config/environment';

export default Controller.extend({
  config,
  session: service(),
  flashMessages: service(),
  queryParams: ['email_id', 'verification_token'],
  email_id: null,
  verification_token: null,
  actions: {
    goToProfile(errorMessage) {
      let flashMessages = this.get('flashMessages');
      if (!errorMessage) {
        flashMessages.add({
          message: 'Your email address has been successfully verified',
          type: 'success'
        });
      } else {
        flashMessages.add({
          message: errorMessage,
          type: 'warning'
        });
      }
      this.transitionToRoute('profile');
    }
  }
});
