import Ember from 'ember';
import DS from 'ember-data';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app-input', 'Integration | Component | app input', {
  integration: true
});

test('it renders', function(assert) {

  let model = Ember.Object.create({
    username: 'joe',
    errors: new DS.Errors(),
  });
  this.set('model', model);

  this.render(hbs`{{app-input fieldName='username' model=model value=model.username label='Username'}}`);

  assert.equal(this.$().text().trim(), 'Username');
});
