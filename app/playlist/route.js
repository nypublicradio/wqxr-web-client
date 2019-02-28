import Route from '@ember/routing/route';

export default Route.extend({

  model({ slug }) {
    this.transitionTo('playlist-daily', { queryParams: { scheduleStation: slug } })
    return;
  },

});
