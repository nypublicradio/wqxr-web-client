import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  extractId(modelClass, resourceHash) {
    return resourceHash.attributes.slug;
  }
});
