import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({
  cmsPK: attr('string'),
  dateLine: attr('string'),
  dateLineDatetime: attr('string'),
  headers: attr(),
  imageMain: attr(),
  itemType: attr('string'),
  itemTypeId: attr('number'),
  siteId: attr('number'),
  slug: attr('string'),
  shortTitle: attr('string'),
  title: attr('string'),
  url: attr('string'),
});
