import Ember from 'ember';
/* global commonmark, html_sanitize*/
import cajaSanitizers from 'shopie/utils/caja-sanitizers';

var writer = commonmark.HtmlRenderer({ sourcepos: true, smart: true });
var reader = commonmark.Parser();

export default Ember.Helper.helper(function (params) {
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
    escapedhtml = html_sanitize(escapedhtml, cajaSanitizers.url, cajaSanitizers.id);
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    return Ember.String.htmlSafe(escapedhtml);
});