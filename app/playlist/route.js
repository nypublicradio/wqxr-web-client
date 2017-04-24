import Route from 'ember-route';

export default Route.extend({
  model({ slug }) {
    return this.store.findRecord('stream', slug);
  },
  titleToken(model) {
    return `Playlist for ${model.get('name')}`;
  },
});
