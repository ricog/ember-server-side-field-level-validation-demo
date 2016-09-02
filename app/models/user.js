import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  username: attr(),
  firstName: attr(),
  lastName: attr(),
});
