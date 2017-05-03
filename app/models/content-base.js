import DS from 'ember-data';

export default DS.Model.extend({
  cmsPK: DS.attr('string'),
  dateLine: DS.attr('string'),
  dateLineDatetime: DS.attr('string'),
  headers: DS.attr(),
  imageMain: DS.attr(),
  itemType: DS.attr('string'),
  itemTypeId: DS.attr('number'),
  slug: DS.attr('string'),
  shortTitle: DS.attr('string'),
  title: DS.attr('string'),
  url: DS.attr('string'),
  type: DS.attr()
});
