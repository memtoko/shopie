import Ember from 'ember';

let { isArray } = Ember;
let EmberError = Ember.Error;

export default function(request, performConcat) {
  var message, msgDetail;
  if (!request) {
    return;
  }
  message = request.statusText;
  if (request.status !== 200) {
    try {
      if (request.responseJSON.errors && Ember.isArray(request.responseJSON.errors)) {
        message = (function() {
          var i, len, ref, results, item;
          ref = request.responseJSON.errors;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            results.push(item);
          }
          return results;
        })();
      } else {
        message = request.responseJSON.error || 'Unknown error';
      }
    } catch (error) {
      if (request.status) {
        msgDetail = request.status + " - " + request.statusText;
      } else {
        msgDetail = 'Server was not available';
      }
      message = "The server returned an error (" + msgDetail + ")";
    }
  }
  if (performConcat && Ember.isArray(message)) {
    message = message.join('<br />');
  }
  if (!performConcat && typeof message === 'string') {
    message = [message];
  }
  return message;
};

// used by obCreate
function __dummy__() {}

let objCreate = Object.create || function (proto) {
  if (typeof proto !== 'object') {
    throw new TypeError('Argument must be an object');
  }
  __dummy__.prototype = proto;
  return new __dummy__();
};

export function AjaxFailed(errors, message = 'Ajax operation failed') {
  EmberError.call(this, message);
  this.errors = errors || [{
    title: 'Ajax Error',
    detail: message
  }];
}

AjaxFailed.prototype = objCreate(EmberError.prototype);

export function InvalidError(errors) {
  AjaxFailed.call(this, errors, 'Request was rejected because it was invalid');
}

InvalidError.prototype = objCreate(AjaxFailed.prototype);

export function UnauthorizedError(errors) {
  AjaxFailed.call(this, errors, 'Ajax authorization failed');
}

UnauthorizedError.prototype = objCreate(AjaxFailed.prototype);

export function ForbiddenError(errors) {
  AjaxFailed.call(this, errors,
    'Request was rejected because user is not permitted to perform this operation.');
}

ForbiddenError.prototype = Object.create(AjaxFailed.prototype);
