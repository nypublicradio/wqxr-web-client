import Route from '@ember/routing/route';
import { get, getProperties } from '@ember/object';
import { set } from '@ember/object';
import ListingRouteMixin from 'wqxr-web-client/mixins/listing-route';
import { hash as waitFor } from 'rsvp';

export default Route.extend(ListingRouteMixin, {
  model() {
    let {
      channelType,
      channelPathName
    } = getProperties(this, 'channelType', 'channelPathName');
    let { slug } = this.paramsFor(channelType);
    let navSlug = this._getNavSlug(channelType);

    if (`${channelPathName}/${slug}` == 'shows/elliott-forrest') {
      let show = this.modelFor("show-detail").channel
      let episodes = this.store.query('story', { show: 'carnegie', page_size: 31})
                      .then( function (episodes) {
                        return {'currentEpisode': episodes.slice(0,1),
                                'pastEpisodes': episodes.slice(1)
                              };
                      })
      return waitFor({
        show,
        episodes
      });
    } else {
      let id = `${channelPathName}/${slug}/${navSlug || 'recent_stories'}/${1}`;

      set(this, 'pageNumbers.totalPages', 0);

      return this.store.findRecord('api-response', id)
        .then(m => {
          // wait until models are loaded to keep UI consistent
          set(this, 'pageNumbers.page', 1);
          set(this, 'pageNumbers.totalPages', Number(get(m, 'totalPages')));

          return m;
      });
    }
  },

  renderTemplate() {
    let {
      channelType,
      channelPathName
    } = getProperties(this, 'channelType', 'channelPathName');
    let { slug } = this.paramsFor(channelType);

    if (`${channelPathName}/${slug}` == 'shows/elliott-forrest') {
      this.send('disableChrome');
      this.render('showdetail-fullbleed');
    } else {
      this._super(...arguments);
    }
  },

  actions: {
    willTransition() {
      this.send('enableChrome');
    }
  }
});
