import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sh-moment-timeago', 'Integration | Component | sh moment timeago', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sh-moment-timeago}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sh-moment-timeago}}
      template block text
    {{/sh-moment-timeago}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
