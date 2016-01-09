import Ember from 'ember';

let { get, isArray } = Ember;

let routeProperty = {
  // `titleToken` can either be a static string or a function
  // that accepts a model object and returns a string (or array
  // of strings if there are multiple tokens).
  titleToken: null,

  // `title` can either be a static string or a function
  // that accepts an array of tokens and returns a string
  // that will be the document title. The `collectTitleTokens` action
  // stops bubbling once a route is encountered that has a `title`
  // defined.
  title: null
};

// Search the name for "actions", older version is _actions
let routeActionName = (function() {
  var i, len, mergedProps, prop, routeProto;

  routeProto = Ember.Route.proto();
  mergedProps = routeProto.mergedProperties;

  for (i = 0, len = mergedProps.length; i < len; i++) {
    prop = mergedProps[i];
    if (prop === 'actions' || prop === '_actions') {
      return prop;
    }
  }
})();

routeProperty[routeActionName] = {

  collectTitleTokens(tokens) {
    var finalTitle, title, titleToken;

    titleToken = get(this, 'titleToken');
    if (typeof titleToken === 'function') {
      titleToken = titleToken.call(this, get(this, 'currentModel'));
    }

    if (isArray(titleToken)) {
      tokens.unshift.apply(this, titleToken);
    } else if (titleToken) {
      tokens.unshift(titleToken);
    }

    title = get(this, 'title');
    if (title) {
      if (typeof title === 'function') {
        finalTitle = title.call(this, tokens);
      } else {
        finalTitle = title;
      }
      this.router.setTitle(finalTitle);
    } else {
      return true;
    }
  }

};

export default function() {
  Ember.Route.reopen(routeProperty);

  Ember.Router.reopen({
    updateTitle: Ember.on('didTransition', function() {
      this.send('collectTitleTokens', []);
    }),
    setTitle(title) {
      window.document.title = title;
    }
  });
};
