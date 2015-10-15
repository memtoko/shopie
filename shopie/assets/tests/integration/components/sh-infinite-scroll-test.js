import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sh-infinite-scroll', 'Integration | Component | sh infinite scroll', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sh-infinite-scroll}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sh-infinite-scroll}}
      template block text
    {{/sh-infinite-scroll}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
