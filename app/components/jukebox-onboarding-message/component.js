import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

const CANCELLED_COOKIE = 'onboardingCancelled'

export default Component.extend({
  cookies: service(),
  fastboot: service(),
  isFastboot: reads('fastboot.isFastBoot'),
  showOnboardingMessage: false,

  init() {
    this._super(...arguments);
    if (this.isFastBoot || this.get('cookies').exists(CANCELLED_COOKIE)) {
      return false;
    }
    this.set('showOnboardingMessage', true);
  },

  actions: {
    hideOnboardMessage() {
      this.get('cookies').write(CANCELLED_COOKIE, true);
      this.set('showOnboardingMessage', false);
    }
  }
});