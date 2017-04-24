import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  keyForAttribute(key) { return key; },
  modelNameFromPayloadKey() { return 'bucket'; },
  extractId(model, {attributes}) {
    return attributes.slug;
  },
  normalizeResponse(store, klass, payload, id, requestType) {
    let { bucketItems = [] } = payload.data.attributes;
    // bucketItems.map(item => store.push({data: item}));
    payload.data.relationships.bucketItems = {data: bucketItems.map(b => ({id: b.id, type: b.type}))};
    payload.included = bucketItems;
    delete payload.data.attributes.bucketItems;
    return this._super(store, klass, payload, id, requestType);
  }
});
