import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';

const Router = EmberRouter.extend({
  session:  service(),
  location: config.locationType,
  rootURL: config.rootURL,
  headData: service(),

  setTitle(title) {
    this.get('headData').set('title', title);
  },

  willTransition(oldInfos, newInfos, transition) {
    this._super(...arguments);
    if (!['login', 'signup', 'validate', 'forgot', 'reset', 'set-password'].includes(transition.targetName)) {
      this.get('session').set('attemptedTransition', transition);
    }
  },
});

function subpageRoutes() {
  this.route('page', {path: '*page_params'});
}

Router.map(function() {
  // This is an example of a route that we've customized beyond the
  // default behavior in the `djangorendered` route.
  this.route('story', { path: 'story/:slug' });

  this.route('show', {path: 'shows'});
  this.route('archived-shows');
  this.route('show-detail', {path: 'shows/:slug'}, subpageRoutes);
  this.route('article-detail', {path: 'articles/:slug'}, subpageRoutes);
  this.route('series-detail', {path: 'series/:slug'}, subpageRoutes);
  this.route('tag-detail', {path: 'tags/:slug'}, subpageRoutes);
  this.route('blog-detail', {path: 'blogs/:slug'}, subpageRoutes);

  this.route('stream', {path: 'streams'});
  this.route('playlist', {path: 'streams/:slug'});
  this.route('playlist-daily', function() {
    this.route('date', {path: ':year/:month/:day'});
  });
  this.route('schedule', function() {
    this.route('date', {path: ':year/:month/:day'});
  });
  this.route('events', function() {
    this.route('event', {path: '*url_path'});
    this.route('archive', {path: 'archive'});
  });

  this.route('videos');
  this.route('topics');
  this.route('settings');

  this.route('profile');

  this.route('login');
  this.route('signup');
  this.route('validate');
  this.route('forgot');
  this.route('reset');
  this.route('verify');
  this.route('set-password');
  this.route('wqxr-api-redirect', { path: '/api/v3/wqxr_djangopages/*upstream_url' });

  // This is our catch all route that can render any existing page
  // from the django site. It will be used when there's nothing more
  // specific.
  this.route('404', { path: '*' });
  this.route('djangorendered', { path: '*upstream_url' });
});

export default Router;
