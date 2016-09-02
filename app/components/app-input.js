import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  fieldName: null,
  model: null,
  label: null,
  value: null,

  errors: computed('modelErrors', function() {
    let modelErrors = get(this, 'modelErrors');

    return modelErrors;
  }),

  modelErrors: computed('model.errors', function() {
    return get(this, 'model').get('errors').errorsFor(get(this, 'fieldName'));
  }),

});
