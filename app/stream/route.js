import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  audio: service(),
  titleToken: 'Listen Live to WQXR, Q2, Operavore, and the Jonathan Channel',

  model() {
    return this.store.findAll('stream').then(streams => {
      return {
        wqxrStreams: streams.filterBy('isWQXR'),
        wnycStreams: streams.filterBy('isWNYC')
      }; 
    });
  },

  setupController(controller/*, model*/) {
    this._super(...arguments);
    controller.set('audio', this.get('audio'));
  }
});
