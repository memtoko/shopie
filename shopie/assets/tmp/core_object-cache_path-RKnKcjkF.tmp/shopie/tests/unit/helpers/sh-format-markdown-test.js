define('shopie/tests/unit/helpers/sh-format-markdown-test', ['shopie/helpers/sh-format-markdown', 'qunit'], function (sh_format_markdown, qunit) {

  'use strict';

  qunit.module('Unit | Helper | sh format markdown');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = sh_format_markdown.shFormatMarkdown(42);
    assert.ok(result);
  });

});