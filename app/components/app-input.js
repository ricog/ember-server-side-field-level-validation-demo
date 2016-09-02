import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { computed, get, observer, set } = Ember;

export default Ember.Component.extend({
  validation: Ember.inject.service(),

  fieldName: null,
  model: null,
  label: null,
  value: null,
  serverErrors: null,
  validationFields: null,

  init() {
    this._super(...arguments);
    this.set('serverErrors', []);
    this.set('validationFields', []);
    this.get('triggerCheckInput');
  },

  actions: {
    validate() {
      this.get('checkInput').perform(this.get('value'));
    }
  },

  errors: computed('serverErrors', 'modelErrors', function() {
    let serverErrors = get(this, 'serverErrors');
    let modelErrors = get(this, 'modelErrors');

    if (serverErrors.length) {
      return serverErrors;
    }

    return modelErrors;
  }),

  modelErrors: computed('model.errors', function() {
    return get(this, 'model').get('errors').errorsFor(get(this, 'fieldName'));
  }),

  triggerCheckInput: observer('value', function() {
    this.get('checkInput').perform(this.get('value'), true);
  }),

  checkInput: task(function *(value, delay) {
    if (value === undefined) {
      return null;
    }

    if (delay) {
      yield timeout(500);
    }
    this.set('modelErrors', null);
    let { state, response } = yield this.get('validation').check(this.get('model'), this.get('fieldName'), value);
    if (state === 'error') {
      set(this, 'serverErrors', response);
      set(this, 'validationFields', []);
      return response;
    } else {
      set(this, 'serverErrors', []);
      set(this, 'validationFields', response);
      return response;
    }
  }).restartable(),
});
