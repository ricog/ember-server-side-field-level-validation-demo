import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').createRecord('user');
  },

  actions: {
    add(model) {
      model.save().then(() => this.transitionTo('/'));
    },

    willTransition() {
      this.controller.get('model').rollbackAttributes();
    },
  },
});
