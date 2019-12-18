import Component from '@ember/component';
import { inject as service } from '@ember/service';

const CANCELLEDCOOKIE = 'onboardingCancelled'

export default Component.extend({
  cookies        : service(), 

  showOnboardingMessage: false, 

  init() {
    this._super(...arguments); //calls the default init method for the component class(since it's extending and we're overwriting it with this)
    if (!this.get('cookies').exists(CANCELLEDCOOKIE)) {
       this.set('showOnboardingMessage', true);
    }

  }, 

  actions: {
    hideOnboardMessage() {
      this.get('cookies').write(CANCELLEDCOOKIE, true);
      this.set('showOnboardingMessage', false);
    }
  }
});
