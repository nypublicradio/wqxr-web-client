import { hash as waitFor } from 'rsvp';
import { set, get } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Inflector from 'ember-inflector';
const inflector = new Inflector(Inflector.defaultRules);
import { beforeTeardown } from 'nypr-django-for-ember/utils/compat-hooks';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import config from 'wqxr-web-client/config/environment';
import { reads } from '@ember/object/computed';


export default Route.extend(PlayParamMixin, {
  session:      service(),
  googleAds:    service(),
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  model(params) {
    const channelPathName = inflector.pluralize(this.routeName.split('-')[0]);
    const listingSlug = `${channelPathName}/${params.slug}`;
    set(this, 'listingSlug', listingSlug);

    let channel = this.store.findRecord('channel', listingSlug);
    let listenLive = this.store.findRecord('chunk', `shows-${params.slug}-listenlive`)
      .catch(() => '');

    return waitFor({
      channel,
      listenLive,
      user: this.get('session.data.authenticated'),
    });
  },

  afterModel({ channel }, transition) {
    // this code block references the document, so don't execute in FastBoot
    if (channel && !get(this, "isFastBoot")) {
      let canonicalUrl = get(channel, 'url');
      let canonicalHostMatch = canonicalUrl && canonicalUrl.match(/\/\/([\w.]+)\//);
      if  (canonicalHostMatch && canonicalHostMatch.pop() !== document.location.host
           && document.location.host !== 'localhost:4200') { // cypress doesn't like domain changes in tests
        transition.abort();
        window.location.href = canonicalUrl;
        return;
      }
    }
    get(this, 'googleAds').doTargeting({show: channel.get('slug')});
    if (channel.get('headerDonateChunk')) {
      transition.send('updateDonateChunk', channel.get('headerDonateChunk'));
    }
    if (channel.get('altLayout')) {
      transition.send('setMiniChrome', true);
    }
  },

  setupController(controller, model) {
    let { page_params = '' } = this.paramsFor(`${this.routeName}.page`);
    let [navSlug] = page_params.split('/');
    controller.setProperties({
      channelType: this.routeName,
      defaultSlug: navSlug,
      model,
      session: get(this, 'session'),
      adminURL: `${config.adminRoot}/admin`
    });
  },

  actions: {
    willTransition(transition) {
      let isExiting = !transition.targetName.match(this.routeName);
      this._super(...arguments);
      beforeTeardown();
      if (get(this, 'currentModel.channel.altLayout') && isExiting) {
        transition.send('setMiniChrome', false);
      }
      if (isExiting) {
        get(this, 'googleAds').clearTarget('show');
      }
      return true;
    }
  }
});
