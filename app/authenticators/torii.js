/* global FB */
import Ember from 'ember';
import Torii from 'ember-simple-auth/authenticators/torii';
import service from 'ember-service/inject';
import fetch from 'fetch';
import RSVP from 'rsvp';
import config from 'wnyc-web-client/config/environment';
import { decamelizeKeys } from 'wnyc-web-client/helpers/decamelize-keys';
import { task } from 'ember-concurrency';

export default Torii.extend({
  torii: service(),

  authenticate() {
    return this._super(...arguments)
    .then(data => {
      return new RSVP.Promise(resolve => {
        let postAuthTask = this.get('postAuthTask').perform(data);
        resolve(postAuthTask);
      });
    });
  },

  postAuthTask: task(function * (data) {
    try {
      let permissions = yield this.fbAPI(`/${data.userId}/permissions`);
      data = this.attachPermissions(data, permissions);
      data = decamelizeKeys([data]);
      let response = yield this.getSession(data.provider, data.accessToken);
      if (response && response.ok) {
        return data;
      } else {
        // the fall-through catch block will populate the exception
        throw '';
      }
    } catch(e) {
      throw {error: e || 'Authorization Failed', data: data};
    }
  }),

  fbAPI(url) {
    if (Ember.testing) {
      // the FB api is attached to the window by torii at run time so it's complicated to mock out
      return RSVP.resolve({});
    }
    return new RSVP.Promise(function(resolve/*, reject*/) {
      FB.api(url, response => resolve(response));
    });
  },

  attachPermissions(data, permissions) { // modifies data
    if (permissions && permissions.data) {
      data.permissions = permissions.data.reduce((result, p) => {
        if (p && p.permission) {
          result[p.permission] = p.status;
        }
        return result;
      }, {});
    }
    return data;
  },

  getSession(provider, accessToken) {
    return fetch(`${config.wnycAuthAPI}/v1/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Provider': provider
      }
    });
  }
});
