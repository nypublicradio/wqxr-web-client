import DS from 'ember-data';
import config from 'wqxr-web-client/config/environment';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { retryFromServer, beforeTeardown } from 'nypr-django-for-ember/utils/compat-hooks';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';

export default Route.extend(PlayParamMixin, {
  queryParams: {
    q: {
      refreshModel: true
    }
  },
  googleAds: service(),
  metadata: service(),
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),


  titleToken(model) {
    let title = get(model, 'title');
    if (title) {
      return title.split(' | ')[0];
    } else {
      return 'Not Found';
    }
  },

  model({ upstream_url }, { queryParams }) {
    // django pages don't work w/ FastBoot, so only execute this in browser.
    // It is also a security concern to access django pages within fastboot,
    // as retrieving a djangorendered page is a GET request, but the url passed
    // on by the fastboot server to the django backend might not be. This is not
    // ideal behavior for reasons described here: https://github.com/simplabs/ember-simple-auth/issues/944
    if (this.get('isFastBoot')) {
      return {'title': ''}
    }
    // This adds trailing slashes, because the server's redirect
    // doesn't otherwise work correctly due to the proxying I'm using
    // in development (which is neeeded due to CORs).
    upstream_url = upstream_url.replace(/\/*$/, '/');

    let qp = Object.keys(queryParams)
      .filter(q => queryParams[q] && config.QP_WHITELIST.includes(q)).map(p => `${p}=${queryParams[p].replace(/\s/g, '%20')}`);
    if (qp.length) {
      upstream_url += `?${qp.join('&')}`;
    }

    return this.store.find('django-page', upstream_url)
      .catch(e => {
        if (e instanceof DS.NotFoundError) {
          this.transitionTo('404', upstream_url);
        }
        retryFromServer(e, upstream_url)
      });
  },

  afterModel(transition) {
    get(this, 'googleAds').doTargeting();
    this.get('metadata').setHeadData({
      path: get(transition, 'intent.url'),
    });
  },

  setupController(controller, model) {
    this._super(...arguments);
    // can't reference the doc in FastBoot, only execute this in browser
    if (this.get('fastboot.isFastBoot')) {
      return;
    }
    let doc = model.get('document');
    let classNamesForRoute = [];
    if (!doc.querySelector('.graphic-responsive')) {
      classNamesForRoute.push('l-constrained');
    }
    if (model.get('id') === 'search/') {
      classNamesForRoute.push('search');
    }
    controller.set('classNamesForRoute', classNamesForRoute);
  },

  actions: {
    willTransition() {
      this._super(...arguments);
      beforeTeardown();
      return true;
    }
  }
});
