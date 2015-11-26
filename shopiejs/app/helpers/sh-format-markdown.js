import Ember from 'ember';
import cajaSanitizer from '../utils/caja-sanitizer';
import markdown from '../libs/markdown';

function sanitinize_embedded_js(fn) {
  return function (text) {
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<pre class="js-embed-placeholder">Embedded JavaScript</pre>');
    return fn(text);
  };
}

function sanitize_iframe_js(fn) {
  return function (text) {
    text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '<pre class="iframe-embed-placeholder">Embedded iFrame</pre>');
    return fn(text);
  };
}

function sanitize_caja(text) {
  return html_sanitize(text, cajaSanitizer.url, cajaSanitizer.id);
}

function emberHtmlSafe(fn) {
  return function (text) {
    text = Ember.String.htmlSafe(text);
    return fn(text);
  };
}

let pipelines = [
  emberHtmlSafe,
  sanitinize_embedded_js,
  sanitize_iframe_js,
];

export function shFormatMarkdown(params) {
  if (!params || !params.length) {
    return;
  }

  var text = params[0] || '',
    rendered = markdown.render(text),
    sanitizer = pipelines.reduce(function(prev, curr) {
      return curr(prev);
    }, sanitize_caja);

  return sanitizer(rendered);
}

export default Ember.Helper.helper(shFormatMarkdown);
