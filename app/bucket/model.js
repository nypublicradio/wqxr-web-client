import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  slug: attr('string'),
  title: attr('string'),
  bucketItems: hasMany('ContentBase', {
    polymorphic: true
  })
});
