import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import PlayParamMixin from 'wqxr-web-client/mixins/play-param';
import DS from 'ember-data';
import RSVP from 'rsvp';

const STREAM_BG = '/assets/img/backgrounds/streambanner.jpg';

export default Route.extend(PlayParamMixin, {
  googleAds:  service(),
  classNames: ['home'],
  dj: service(),
  fastboot: service(),
  metadata: service(),

  model() {
    get(this, 'googleAds').doTargeting();
    let hash = {
      wqxrHome: this.store.findRecord('bucket', 'wqxr-home').then(b => {
        return {
          featuredItems: b.get('bucketItems').slice(0, 9),
          otherItems: b.get('bucketItems').slice(9)
        };
      }),
    };
    // django pages don't work w/ FastBoot, and these chunks are rendered with
    // the django page component, so don't load these until the browser environment
    if (!this.get('fastboot.isFastBoot')) {
      hash.wartopChunk = this.store.findRecord('chunk', 'wqxr-wartop-home').catch(()=>'');
      hash.liveChunk = this.store.findRecord('chunk', 'wqxr-live-home').catch(()=>'');
      hash.membershipChunk = this.store.findRecord('chunk', 'wqxr-membership-home').catch(() => '');
    }
    return RSVP.hash(hash);
  },
  afterModel() {
    this.get('metadata').setHeadData({
      path: '',
    });
  },
  setupController(controller) {
    this._super(...arguments);
    let streams = DS.PromiseArray.create({
      promise: this.store.findAll('stream', {reload: true}).then(s => {
        return s.filterBy('liveWQXR').sortBy('sitePriority')
          .concat(s.filterBy('liveWNYC').sortBy('sitePriority')).uniq();
      })
    });
    controller.set('streams', streams);
    controller.set('background', STREAM_BG);
  }
});
