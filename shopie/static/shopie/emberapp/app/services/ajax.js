import Ember from 'ember';
import { AjaxFailed, UnauthorizedError,
  InvalidError, ForbiddenError} from 'shopie/libs/ajax-error';

let { get, merge, isBlank} = Ember;
let _keys = Object.keys || Ember.keys;
/**
 * Under certain circumtance, Django cant maintain post data when there are not
 * slash at the end of url.Here we will normalize all url, to end up with it
 */
function ensureSlash(url) {
  var queryStart, queryString ;

  queryStart = url.indexOf('?');
  //this url include query params, so take it out
  if (queryStart !== -1) {
    queryString = url.substr(queryStart + 1, url.length);
    url = path.substr(0, queryStart);
  }
  url = url.slice(-1) !== '/' ? `${url}/` : url;
  return queryString == null ? url : `${url}?$queryString`;
}

function forceOptionType(options, method) {
  options = options || {};
  options.type = method;
  return options;
}

function parseHeaders(string) {
  var headers = {}, pairs, pair, i, len;
  if (!string) {
    return string;
  }
  pairs = string.split('\u000d\u000a');
  for (i = 0, len = pairs.length; i < len; i++) {
    pair = pairs[i];
    let index = pair.indexOf('\u003a\u0020');
    if (index > 0) {
      let key = pair.substring(0, index);
      let val = pair.substring(index + 2);
      headers[key] = val;
    }
  }
  return headers;
}

export default Ember.Service.extend({

  headers: Ember.computed('session.csrfToken', function () {
    var _headers = {}, _ref;
    if ((_ref = this.get('session.csrfToken'))) {
      _headers["X-CSRFToken"] = _ref;
    }
    return _headers;
  }).volatile(),

  /*
  Send request
  */
  request(url, options) {
    let hash = this._options(url, options);
    return new Ember.RSVP.Promise((resolve, reject) => {

      hash.success = (payload, textStatus, jqXHR) => {
        // request success, but it maybe hit 404, etc, etc
        let response = this.handleResponse(
          jqXHR.status, parseHeaders(jqXHR.getAllResponseHeaders()), payload
        );

        if (response instanceof AjaxFailed) {
          reject(response);
        } else {
          resolve(response);
        }
      };

      hash.error = (jqXHR, textStatus, errorThrown) => {
        let error;

        if (!(error instanceof Error)) {
          if (errorThrown instanceof Error) {
            error = errorThrown;
          } else {
            error = this.handleResponse(
              jqXHR.status,
              parseHeaders(jqXHR.getAllResponseHeaders()),
              this.parseErrorResponse(jqXHR.responseText) || errorThrown
            );
          }
        }
        reject(error);
      };

      Ember.$.ajax(hash);
    }, `shopie-ajax: ${hash.type} to ${url}`);
  },

  // calls `request()` but forces `options.type` to `POST`
  post(url, options) {
    return this.request(url, forceOptionType(options, 'POST'));
  },

  // calls `request()` but forces `options.type` to `PUT`
  put(url, options) {
    return this.request(url, forceOptionType(options, 'PUT'));
  },

  // calls `request()` but forces `options.type` to `PATCH`
  patch(url, options) {
    return this.request(url, forceOptionType(options, 'PATCH'));
  },

  // calls `request()` but forces `options.type` to `DELETE`
  del(url, options) {
    return this.request(url, forceOptionType(options, 'DELETE'));
  },

  _options(url, options) {
    var hash, headers;
    hash = options || {};
    hash.url = this._buildURL(url);
    hash.type = hash.type || 'GET';
    hash.dataType = hash.dataType || 'json';
    hash.context = this;

    headers = merge(options.headers || {}, get(this, 'headers'));
    if (headers) {
      hash.beforeSend = function (xhr) {
        _keys(headers).forEach((name) =>  xhr.setRequestHeader(name, headers[name]));
      };
    }
    return hash;
  },

  _buildURL(url) {
    let host = get(this, 'host');
    if (isBlank(host)) {
      return ensureSlash(url);
    }
    const startsWith = String.prototype.startsWith || function(searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    };
    if (startsWith.call(url, '/')) {
      return ensureSlash(`${host}${url}`);
    } else {
      return ensureSlash(`${host}/${url}`);
    }
  },

 handleResponse(status, headers, payload) {
   if (this.isSuccess(status, headers, payload)) {
     return payload;
   } else if (this.isUnauthorized(status, headers, payload)) {
     return new UnauthorizedError(payload.errors);
   } else if (this.isForbidden(status, headers, payload)){
     return new ForbiddenError(payload.errors);
   } else if (this.isInvalid(status, headers, payload)) {
     return new InvalidError(payload.errors);
   }

   let errors = this.normalizeErrorResponse(status, headers, payload);

   return new AjaxFailed(errors);
 },

  isUnauthorized(status/*, headers, payload */) {
    return status === 401;
  },

  isForbidden(status/*, headers, payload */) {
    return status === 403;
  },

  isInvalid(status/*, headers, payload */) {
    return status === 422;
  },

  isSuccess(status/*, headers, payload */) {
    return status >= 200 && status < 300 || status === 304;
  },

  parseErrorResponse(responseText) {
    var json = responseText;

    try {
      json = Ember.$.parseJSON(responseText);
    } catch (e) {}

    return json;
  },

  normalizeErrorResponse(status, headers, payload) {
    if (payload && typeof payload === 'object' && payload.errors) {
      return payload.errors;
    } else {
      return [
        {
          status: `${status}`,
          title: "The backend responded with an error",
          detail: `${payload}`
        }
      ];
    }
  }
});
