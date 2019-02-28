import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel(){
    this.transitionTo('playlist-daily')

  },

  model({ slug }) {
    this.transitionTo('playlist-daily', { queryParams: { scheduleStation: slug } })
    return;
  },

});
