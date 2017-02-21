import Component from 'ember-component';
import ENV from 'wqxr-web-client/config/environment';

export default Component.extend({
  resendEndpoint: `${ENV.wnycAuthAPI}/v1/confirm/resend`,
});
