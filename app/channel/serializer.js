import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute: key => key,
  keyForRelationship: key => key,
  normalizeResponse(store, typeClass, {included = [], data}, id, requestType) {
    let featuredStory = data.attributes.featured;
    delete data.attributes.featured;

    // id will have a trailing slash because it is derived from the URL and we
    // reliably append a trailing slash via Django
    included.push({
      type: 'api-response',
      id: `${id}about/1`,
      relationships: {
        'about-page': {
          data: {
            type: 'about-page', id: `${id}about`
          }
        }
      }
    },
    {
      type: 'about-page',
      id: `${id}about`,
      attributes: data.attributes.about
    });
    
    included = included.map(r => {
      let { attributes, type } = r;
      if (type === 'api-response') {
        return r;
      }

      // story serializer expects keys dasherized
      if (attributes) {
        r.attributes = {};
        Object.keys(attributes).forEach(k => r.attributes[k.dasherize()] = attributes[k]);
      }
      return r;
    });

    if (featuredStory) {
      let story = {
        type: 'story',
        id: featuredStory.id,
        attributes: {}
      };
      Object.keys(featuredStory).forEach(k => story.attributes[k.dasherize()] = featuredStory[k]);
      
      included.push(story);

      data.relationships = {
        featured: {
          data: {
            type: 'story',
            id: featuredStory.id
          }
        }
      };
    }
    return this._super(store, typeClass, {data, included}, id, requestType);
  }
});
