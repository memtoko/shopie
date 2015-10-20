define('shopie/helpers/sh-format-markdown', ['exports', 'ember', 'shopie/utils/caja-sanitizers'], function (exports, Ember, cajaSanitizers) {

    'use strict';

    var writer = commonmark.HtmlRenderer({ sourcepos: true, smart: true });
    var reader = commonmark.Parser();

    exports['default'] = Ember['default'].Helper.helper(function (params) {
        if (!params || !params.length) {
            return;
        }
        var escapedhtml = '',
            markdown = params[0] || '';

        // convert markdown to HTML
        escapedhtml = writer.render(reader.parse(markdown));
        // replace script and iFrame
        escapedhtml = escapedhtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<pre class="js-embed-placeholder">Embedded JavaScript</pre>');
        escapedhtml = escapedhtml.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '<pre class="iframe-embed-placeholder">Embedded iFrame</pre>');

        // sanitize html
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        escapedhtml = html_sanitize(escapedhtml, cajaSanitizers['default'].url, cajaSanitizers['default'].id);
        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        return Ember['default'].String.htmlSafe(escapedhtml);
    });

});