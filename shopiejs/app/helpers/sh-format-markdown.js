import Ember from 'ember';
import cajaSanitizers from '../utils/caja-sanitizer';
import markdown from '../libs/markdown';

export function shFormatMarkdown(params) {
  if (!params || !params.length) {
    return;
  }

  var text = params[0] || '',
      escaped = '';

  escaped = markdown.render(text);
  // replace script and iFrame
  escaped = escaped.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    '<pre class="js-embed-placeholder">Embedded JavaScript</pre>');
  escaped = escaped.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    '<pre class="iframe-embed-placeholder">Embedded iFrame</pre>');

  // sanitize html
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  escaped = html_sanitize(escaped, cajaSanitizers.url, cajaSanitizers.id);
  // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

  return Ember.String.htmlSafe(escaped);
}

export default Ember.Helper.helper(shFormatMarkdown);
