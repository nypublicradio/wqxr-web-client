import Component from '@ember/component';
import { inject as service } from '@ember/service';

const CANCELLED_COOKIE = 'onboardingCancelled'

export default Component.extend({
  cookies        : service(),
  showOnboardingMessage: false, 

  init() {
    this._super(...arguments);
    if (!this.get('cookies').exists(CANCELLED_COOKIE)) {
       this.set('showOnboardingMessage', true);
    }
  }, 

  actions: {
    hideOnboardMessage() {
      this.get('cookies').write(CANCELLED_COOKIE, true);
      this.set('showOnboardingMessage', false);
    }
  }
});
