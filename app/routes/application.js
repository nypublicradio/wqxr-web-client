import Route from 'ember-route';
import get from 'ember-metal/get';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import service from 'ember-service/inject';
import RSVP from 'rsvp';

export default Route.extend(ApplicationRouteMixin, {
  metrics: service(),
  asyncWriter: service(),
  legacyLoader: service(),
  leaderboard: service(),
  currentUser: service(),
  session: service(),
  poll: service(),
  store: service(),
  audio: service(),
  title(tokens) {
    if (tokens && tokens.length > 0) {
      let lastToken = tokens.slice(-1);
      return `${lastToken} | WQXR`;
    } else {
      return 'WQXR | New York\'s Classical Music Radio Station';
    }
  },

  beforeModel() {

    let metrics = get(this, 'metrics');

    get(this, 'session').syncBrowserId();
    get(this, 'session').staffAuth();
    get(this, 'currentUser').load();

    metrics.identify('GoogleAnalytics', {isAuthenticated: false});

    get(this, 'asyncWriter').install();
    get(this, 'leaderboard').install();

    window.WNYC_LEGACY_LOADER = get(this, 'legacyLoader');

    let pollFunction = () => get(this, 'store').findAll('stream');
    get(this, 'poll').addPoll({interval: 60 * 1000, callback: pollFunction});
  },

  model() {
    return RSVP.hash({
      splashPage: this.store.findRecord('chunk', 'wqxr-splash-page').catch(()=>'')
    });
  },

  actions: {
    error(error/*, transition*/) {
      if (error) {
        // sometimes this.controller is undefined
        this.controllerFor('application').set('error', error);
        return error;
      }
    },
    didTransition() {
      this.controllerFor('application').set('error', null);
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
    get(this, 'metrics').identify('GoogleAnalytics', {isAuthenticated: true});
    get(this, 'currentUser').load();
  },
});
