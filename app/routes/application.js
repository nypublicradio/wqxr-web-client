import DS from 'ember-data';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { reads } from '@ember/object/computed';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { schedule } from '@ember/runloop';

const DETAIL_ROUTES = new RegExp(/story|(show|article|series|tag|blog)-detail\./);

export default Route.extend(ApplicationRouteMixin, {
  dataLayer: service('nypr-metrics/data-layer'),
  dataPipeline: service(),
  asyncWriter: service(),
  legacyLoader: service(),
  leaderboard: service(),
  currentUser: service(),
  session: service(),
  poll: service(),
  store: service(),
  dj: service(),
  fastboot: service(),
  isFastBoot: reads('fastboot.isFastBoot'),

  title(tokens = []) {
    let siteName = 'WQXR';
    let tagline = "New York's Classical Music Radio Station";

    // combine the first two items if the second item stats with `:`
    if (tokens[1] && tokens[1].startsWith(':'))  {
      tokens.splice(0, 2, `${tokens[0]} ${tokens[1]}`);
    }

    tokens.push(siteName);
    if (tokens.length < 3) {
      tokens.push(tagline);
    }
    let title = tokens.join(' | ');
    get(this, 'dataLayer').setPageTitle(title);

    if (!this.controller._wasModal) {
      let route = this.router.currentRouteName;

      schedule('afterRender', () => {
        get(this, 'dataLayer').sendPageView();
        if (!DETAIL_ROUTES.test(route) && !route.match(/loading/)) {
          this.get('dataPipeline').reportItemView();
        }
      });
    } else {
      // reset
      this.controller._wasModal = false;
    }

    return title;
  },

  beforeModel() {
    get(this, 'currentUser').load();


    // can't reference window in FastBoot, only execute in browser.
    // make sure Fastboot instance doesn't try to refresh auth credentials.
    if (get(this, 'isFastBoot')) {
      this.set('session.noRefresh', true);
      return;
    }

    get(this, 'session').syncBrowserId()
      .then(id => get(this, 'dj').addBrowserId(id));
    get(this, 'session').staffAuth();

    get(this, 'dataLayer').setLoggedIn(false);

    get(this, 'asyncWriter').install();
    get(this, 'leaderboard').install();

    window.WNYC_LEGACY_LOADER = get(this, 'legacyLoader');

    let pollFunction = () =>  get(this, 'store').findAll('stream');

    get(this, 'poll').addPoll({interval: 10 * 1000, callback: pollFunction});
  },

  model() {
    // django pages don't work w/ FastBoot, and these chunks are rendered with
    // the django page component, so don't load these until the browser environment
    if (get(this, 'isFastBoot')) {
      return;
    }
    return RSVP.hash({
      splashPage: this.store.findRecord('chunk', 'wqxr-global').catch(()=>'')
    });
  },

  actions: {
    error(error/*, transition*/) {
      if (error instanceof DS.NotFoundError) {
        if (get(this, 'isFastBoot')) {
            this.set('fastboot.response.statusCode', 404);
        }
        this.transitionTo('404', error.url);
      } else {
        /* eslint-disable */
        console.error(error);
        /* eslint-enable */
      }
    },
    didTransition() {
      // can't reference window in FastBoot, only execute in browser
      if (get(this, 'isFastBoot')) {
        return;
      }
      this.set('dataPipeline.currentReferrer', window.location.toString());
    },
    willTransition() {
      //close queue/history modal when we open a new page
      this.controllerFor('application').send('closeModal');
      this.send('updateDonateChunk', null);
    },
    updateDonateChunk(donateChunk) {
      this.controllerFor('application').set('headerDonateChunk', donateChunk);
    },
    setMiniChrome(val) {
      this.controllerFor('application').set('miniChrome', val);
    },
    disableChrome() {
      this.controllerFor('application').set('chromeDisabled', true);
    },
    enableChrome() {
      this.controllerFor('application').set('chromeDisabled', false);
    }
  },

  sessionAuthenticated() {
    this._super(...arguments);
    get(this, 'dataLayer').setLoggedIn(true);
    get(this, 'currentUser').load();
  },

  sessionInvalidated() {
    get(this, 'dataLayer').setLoggedIn(false);
    if (this.get('session.noRefresh') === true) {
      this.set('session.noRefresh', false);
    } else {
      this._super(...arguments);
    }
  }
});
