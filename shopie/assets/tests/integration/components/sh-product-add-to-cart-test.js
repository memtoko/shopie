import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sh-product-add-to-cart', 'Integration | Component | sh product add to cart', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sh-product-add-to-cart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sh-product-add-to-cart}}
      template block text
    {{/sh-product-add-to-cart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
