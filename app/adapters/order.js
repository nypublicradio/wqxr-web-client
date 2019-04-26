import DS from 'ember-data';
import ENV from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default DS.JSONAPIAdapter.extend(AdapterFetch, DataAdapterMixin, {
  // we are replacing authorize() here, since ember-fetch (needed for FastBoot)
  // overrides ember-simple-auth's ajaxOptions method, which calls authorize().
  // So instead, we do what we used to do in authorize() right here.
  ajaxOptions(...args) {
    const options = this._super(...args);
    const headers = this.get('session').authorize({});
    options.headers = {}
    for (var h in headers) {
      options.headers[h] = headers[h];
    }
    return options;
  },

  host: ENV.membershipAPI,
  namespace: 'v1',
  authorize(xhr) {
    let headers = this.get('session').authorize({});
    for (var h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
  },
  buildURL(...args) {
    let url = this._super(...args);
    return `${url}/`;
  },
});
