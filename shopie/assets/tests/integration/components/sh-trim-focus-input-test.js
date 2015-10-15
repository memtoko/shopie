import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sh-trim-focus-input', 'Integration | Component | sh trim focus input', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sh-trim-focus-input}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sh-trim-focus-input}}
      template block text
    {{/sh-trim-focus-input}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
