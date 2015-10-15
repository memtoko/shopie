"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('shopie/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'shopie/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('shopie/authenticators/shopie-token-auth', ['exports', 'ember', 'simple-auth/authenticators/base'], function (exports, Ember, Base) {

    'use strict';

    exports['default'] = Base['default'].extend({

        init: function init() {
            var globalConfig = window.ENV['simple-auth'] || {};
            this.serverTokenEndpoint = globalConfig.serverTokenEndpoint || '/api-token-auth/';
        },

        restore: function restore(data) {
            return new Ember['default'].RSVP.Promise(function (resolve, reject) {
                return Ember['default'].isEmpty(data.token) ? reject() : resolve(data);
            });
        },

        authenticate: function authenticate(credentials) {
            var data = {
                username: credentials.identification,
                password: credentials.password
            };
            return new Ember['default'].RSVP.Promise((function (resolve, reject) {
                this.makeRequest(this.serverTokenEndpoint, data).then(function (response) {
                    Ember['default'].run(function () {
                        return resolve();
                    });
                }, function (xhr, status, error) {
                    Ember['default'].run(function () {
                        return reject(xhr.responseJSON || xhr.responseText);
                    });
                });
            }).bind(this));
        },

        invalidate: function invalidate(data) {
            return new Ember['default'].RSVP.Promise(function (resolve, reject) {
                return resolve();
            });
        },

        makeRequest: function makeRequest(url, data) {
            return Ember['default'].$.ajax({
                url: url,
                type: 'POST',
                data: data,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded'
            });
        }
    });

});
define('shopie/authorizers/shopie-token-auth', ['exports', 'ember', 'simple-auth/authorizers/base'], function (exports, Ember, Base) {

    'use strict';

    exports['default'] = Base['default'].extend({
        authorize: function authorize(jqXHR, requestOptions) {
            var secureData = this.get('session.secure');
            var accessToken = secureData.token;
            if (this.get('session.isAuthenticated') && !Ember['default'].isEmpty(accessToken)) {
                jqXHR.setRequestHeader('Authorization', 'Token  ' + accessToken);
            }
        }
    });

});
define('shopie/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'shopie/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('shopie/components/sh-gravatar', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        size: 200,
        email: '',

        gravatarUrl: Ember['default'].computed('email', 'size', function () {
            var emailHash = md5(this.get('email')),
                size = this.get('size');
            return 'http://www.gravatar.com/avatar/' + emailHash + '?s=' + size;
        })
    });

});
define('shopie/components/sh-input', ['exports', 'ember', 'shopie/mixins/text-input'], function (exports, Ember, TextInputMixin) {

    'use strict';

    exports['default'] = Ember['default'].TextField.extend(TextInputMixin['default'], {
        classNames: 'sh-input'
    });

});
define('shopie/components/sh-main', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'main',
        classNames: ['sh-main'],
        ariaRole: 'main',

        mouseEnter: function mouseEnter() {
            this.sendAction('onMouseEnter');
        }
    });

});
define('shopie/components/sh-nav-menu-front', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'nav',
        classNames: ['sh-nav'],
        classNameBindings: ['open'],

        config: Ember['default'].inject.service(),

        open: false,

        mouseEnter: function mouseEnter() {
            this.sendAction('onMouseEnter');
        },

        actions: {
            toggleAutoNav: function toggleAutoNav() {
                this.sendAction('toggleMaximise');
            },

            openModal: function openModal(modal) {
                this.sendAction('openModal', modal);
            },

            closeMobileMenu: function closeMobileMenu() {
                this.sendAction('closeMobileMenu');
            },

            openAutoNav: function openAutoNav() {
                this.sendAction('openAutoNav');
            }
        }
    });

});
define('shopie/controllers/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({

        // jscs: disable
        signedOut: Ember['default'].computed.match('currentPath', /(signin|signup|setup|reset)/),
        // jscs: enable

        topNotificationCount: 0,
        showMobileMenu: false,
        showSettingsMenu: false,

        autoNav: false,
        autoNavOpen: Ember['default'].computed('autoNav', {
            get: function get() {
                return false;
            },
            set: function set(key, value) {
                if (this.get('autoNav')) {
                    return value;
                }
                return false;
            }
        }),

        actions: {
            topNotificationChange: function topNotificationChange(count) {
                this.set('topNotificationCount', count);
            },

            toggleAutoNav: function toggleAutoNav() {
                this.toggleProperty('autoNav');
            },

            openAutoNav: function openAutoNav() {
                this.set('autoNavOpen', true);
            },

            closeAutoNav: function closeAutoNav() {
                this.set('autoNavOpen', false);
            },

            closeMobileMenu: function closeMobileMenu() {
                this.set('showMobileMenu', false);
            }
        }
    });

});
define('shopie/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('shopie/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('shopie/controllers/users/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('shopie/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'shopie/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('shopie/initializers/export-application-global', ['exports', 'ember', 'shopie/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('shopie/initializers/shopie-token-auth', ['exports', 'ember', 'shopie/config/environment', 'shopie/authenticators/shopie-token-auth', 'shopie/authorizers/shopie-token-auth'], function (exports, Ember, ENV, Authenticator, Authorizer) {

    'use strict';

    exports['default'] = {
        name: 'shopie-token-auth',
        before: 'simple-auth',
        initialize: function initialize(container, application) {
            container.register('simple-auth-authorizer:shopie-token-auth', Authorizer['default']);
            container.register('simple-auth-authenticator:shopie-token-auth', Authenticator['default']);
            ENV['default']['simple-auth'].localStorageKey = 'shopie:session';
        }
    };

});
define('shopie/initializers/simple-auth', ['exports', 'simple-auth/configuration', 'simple-auth/setup', 'shopie/config/environment'], function (exports, Configuration, setup, ENV) {

  'use strict';

  exports['default'] = {
    name: 'simple-auth',
    initialize: function initialize(container, application) {
      Configuration['default'].load(container, ENV['default']['simple-auth'] || {});
      setup['default'](container, application);
    }
  };

});
define('shopie/libs/validators/base', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var _this2 = undefined;

    var BaseValidator = Ember['default'].objects.extend({
        properties: [],
        passed: false,

        check: function check(model, prop) {
            var _this = this;

            this.set('passed', true); //default

            if (prop && this[prop]) {
                this[prop](model);
            } else {
                this.get('properties').forEach(function (property) {
                    if (_this[property]) {
                        _this[property](model);
                    }
                });
            }
            return this.get('passed');
        },

        invalidate: function invalidate() {
            return _this2.set('passed', false);
        }
    });

    exports['default'] = BaseValidator;

});
define('shopie/mixins/body-event-listener', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({
        bodyElementSelector: 'html',
        bodyClick: Ember['default'].K,

        init: function init() {
            this._super();

            return Ember['default'].run.next(this, this._setupDocumentHandlers);
        },

        willDestroy: function willDestroy() {
            this._super();

            return this._removeDocumentHandlers();
        },

        _setupDocumentHandlers: function _setupDocumentHandlers() {
            var _this = this;

            if (this._clickHandler) {
                return;
            }

            this._clickHandler = function () {
                return _this.bodyClick;
            };

            return $(this.get('bodyElementSelector')).on('click', this._clickHandler);
        },

        _removeDocumentHandlers: function _removeDocumentHandlers() {
            $(this.get('bodyElementSelector')).off('click', this._clickHandler);
            this._clickHandler = null;
        },

        click: function click(event) {
            return event.stopPropagation();
        }
    });

});
define('shopie/mixins/shortcuts-route', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    key.filter = function () {
        return true;
    };

    key.setScope('default');

    var ShortcutsRoute = Ember['default'].Mixin.create({
        registerShortcuts: function registerShortcuts() {
            var _this = this;

            var shortcuts = this.get('shortcuts');

            Ember['default'].keys(shortcuts).forEach(function (shortcut) {
                return _this.addShortcut(shortcut);
            });
        },

        addShortcut: function addShortcut(shortcut) {
            var shortcuts = this.get('shortcuts'),
                scope = shortcuts[shortcut].scope || 'default',
                action = shortcuts[shortcut],
                options = undefined;
            if (Ember['default'].typeOf(action) !== 'string') {
                options = action.options;
                action = action.action;
            }

            key(shortcut, scope, (function (event) {
                // stop things like ctrl+s from actually opening a save dialogue
                event.preventDefault();
                this.send(action, options);
            }).bind(this));
        },

        removeShortcuts: function removeShortcuts() {
            var shortcuts = this.get('shortcuts');

            Ember['default'].keys(shortcuts).forEach(function (shortcut) {
                return key.unbind(shortcut);
            });
        },

        activate: function activate() {
            this._super();
            this.registerShortcuts();
        },

        deactivate: function deactivate() {
            this._super();
            this.removeShortcuts();
        }
    });

    exports['default'] = ShortcutsRoute;

});
define('shopie/mixins/text-input', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({
        selectOnClick: false,
        stopEnterKeyDownPropagation: false,

        click: function click(event) {
            if (this.get('selectOnClick')) {
                event.currentTarget.select();
            }
        },

        keyDown: function keyDown(event) {
            // stop event propagation when pressing "enter"
            // most useful in the case when undesired (global) keyboard shortcuts are getting triggered while interacting
            // with this particular input element.
            if (this.get('stopEnterKeyDownPropagation') && event.keyCode === 13) {
                event.stopPropagation();

                return true;
            }
        }
    });

});
define('shopie/models/user', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        firstName: DS['default'].attr('string'),
        lastName: DS['default'].attr('string'),
        email: DS['default'].attr('string')
    });

});
define('shopie/router', ['exports', 'ember', 'shopie/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('cart');
    this.route('shop');
    this.route('product', { path: '/product/:product_slug-:product_id' });
    this.route('users', { path: '/user' });
    this.route('login', {});
  });

  exports['default'] = Router;

});
define('shopie/routes/application', ['exports', 'ember', 'simple-auth/mixins/application-route-mixin', 'simple-auth/configuration', 'shopie/mixins/shortcuts-route', 'shopie/utils/ctrl-or-cmd'], function (exports, Ember, ApplicationRouteMixin, Configuration, ShortcutsRoute, ctrlOrCmd) {

    'use strict';

    var shortcuts = {};

    shortcuts.esc = { action: 'closeMenus', scope: 'all' };
    shortcuts.enter = { action: 'confirmModal', scope: 'modal' };
    shortcuts[ctrlOrCmd['default'] + '+s'] = { action: 'save', scope: 'all' };

    exports['default'] = Ember['default'].Route.extend(ApplicationRouteMixin['default'], ShortcutsRoute['default'], {
        shortcuts: shortcuts,
        config: Ember['default'].inject.service(),

        title: function title(tokens) {
            return tokens.join(' - Shopie');
        },

        actions: {
            invalidateSession: function invalidateSession() {
                this.get('session').invalidate();
            },

            sessionAuthenticationFailed: function sessionAuthenticationFailed(error) {
                if (error.errors) {
                    // These are server side errors, which can be marked as htmlSafe
                    error.errors.forEach(function (err) {
                        err.message = err.message.htmlSafe();
                    });
                }
            },

            // noop default for unhandled save (used from shortcuts)
            save: Ember['default'].K
        }
    });

});
define('shopie/routes/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('shopie/routes/login', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('shopie/routes/users', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({

		model: function model() {
			return this.store.find('user');
		}
	});

});
define('shopie/services/config', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    function isNumeric(num) {
        return !isNaN(num);
    }

    function _mapType(val) {
        if (val === '') {
            return null;
        } else if (val === 'true') {
            return true;
        } else if (val === 'false') {
            return false;
        } else if (isNumeric(val)) {
            return +val;
        } else if (val.indexOf('{') === 0) {
            try {
                return JSON.parse(val);
            } catch (e) {
                /*jshint unused:false */
                return val;
            }
        } else {
            return val;
        }
    }

    exports['default'] = Ember['default'].Service.extend(Ember['default']._ProxyMixin, {
        content: Ember['default'].computed(function () {
            var metaConfigTags = Ember['default'].$('meta[name^="env-"]'),
                config = {};

            metaConfigTags.each(function (i, el) {
                var key = el.name,
                    value = el.content,
                    propertyName = key.substring(4);

                config[propertyName] = _mapType(value);
            });

            return config;
        })
    });

});
define('shopie/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 4
            },
            "end": {
              "line": 4,
              "column": 4
            }
          },
          "moduleName": "shopie/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","sh-nav-menu-front",[],["open",["subexpr","@mut",[["get","autoNavOpen",["loc",[null,[3,33],[3,44]]]]],[],[]],"toggleMaximise","toggleAutoNav","openAutoNav","openAutoNav","openModal","openModal","closeMobileMenu","closeMobileMenu"],["loc",[null,[3,8],[3,159]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 4
            },
            "end": {
              "line": 7,
              "column": 4
            }
          },
          "moduleName": "shopie/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["content","outlet",["loc",[null,[6,8],[6,18]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sh-viewport");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element0,1,1);
        morphs[1] = dom.createMorphAt(element0,2,2);
        morphs[2] = dom.createMorphAt(element0,4,4);
        return morphs;
      },
      statements: [
        ["block","unless",[["get","isAdmin",["loc",[null,[2,14],[2,21]]]]],[],0,null,["loc",[null,[2,4],[4,15]]]],
        ["block","sh-main",[],["onMouseEnter","closeAutoNav"],1,null,["loc",[null,[5,4],[7,16]]]],
        ["inline","outlet",["modal"],[],["loc",[null,[9,4],[9,22]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('shopie/templates/components/sh-gravatar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/components/sh-gravatar.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("img");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","email-input");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'src');
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        return morphs;
      },
      statements: [
        ["attribute","src",["get","gravatarUrl",["loc",[null,[1,11],[1,22]]]]],
        ["inline","sh-input",[],["type","email","value",["subexpr","@mut",[["get","email",["loc",[null,[3,32],[3,37]]]]],[],[]],"placeholder","Enter your Gravatar e-mail"],["loc",[null,[3,2],[3,80]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/components/sh-nav-menu-front', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 12
            },
            "end": {
              "line": 5,
              "column": 40
            }
          },
          "moduleName": "shopie/templates/components/sh-nav-menu-front.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode(" Memtoko");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 18
            },
            "end": {
              "line": 11,
              "column": 92
            }
          },
          "moduleName": "shopie/templates/components/sh-nav-menu-front.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode(" Cart");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 14
            },
            "end": {
              "line": 20,
              "column": 14
            }
          },
          "moduleName": "shopie/templates/components/sh-nav-menu-front.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","has-dropdown");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"href","#");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2,"class","dropdown");
          var el3 = dom.createTextNode("\n                      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          var el4 = dom.createElement("a");
          dom.setAttribute(el4,"href","/account/dashboard");
          var el5 = dom.createTextNode("Dashboard");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          var el4 = dom.createElement("a");
          dom.setAttribute(el4,"href","/account/logout");
          var el5 = dom.createTextNode("Logout");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 1]),0,0);
          return morphs;
        },
        statements: [
          ["content","session.user.username",["loc",[null,[14,30],[14,57]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 14
            },
            "end": {
              "line": 23,
              "column": 14
            }
          },
          "moduleName": "shopie/templates/components/sh-nav-menu-front.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"href","/account/login");
          var el3 = dom.createTextNode("Login");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"href","/account/register");
          var el3 = dom.createTextNode("Register");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 31,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/components/sh-nav-menu-front.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"class","main-header app");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2,"class","top-bar global-nav navbar-app");
        dom.setAttribute(el2,"data-topbar","");
        dom.setAttribute(el2,"role","navigation");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","title-area");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","name");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h1");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"class","toggle-topbar menu-icon");
        var el5 = dom.createElement("a");
        dom.setAttribute(el5,"href","#");
        var el6 = dom.createElement("span");
        var el7 = dom.createTextNode("Menu");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"class","top-bar-section");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","right");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n              ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","left");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","/shop");
        var el7 = dom.createTextNode("Shop");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1, 1]),0,0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
        morphs[2] = dom.createMorphAt(element1,3,3);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],[],0,null,["loc",[null,[5,12],[5,52]]]],
        ["block","link-to",["cart"],["classNames","sh-nav-menu-front-about js-nav-item"],1,null,["loc",[null,[11,18],[11,104]]]],
        ["block","if",[["get","session.isAuthenticated",["loc",[null,[12,20],[12,43]]]]],[],2,3,["loc",[null,[12,14],[23,21]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('shopie/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 23,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","header-cover");
        dom.setAttribute(el1,"style","min-height:400px;overflow:hidden;");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","text-overlay text-center");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","text-overlay header-image-color");
        dom.setAttribute(el3,"style","height:400px;overflow:hidden;");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","header-text");
        dom.setAttribute(el4,"style","margin-top:132px;");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h1");
        dom.setAttribute(el5,"class","light white-text text-center");
        var el6 = dom.createTextNode("Lead by Design");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","row");
        var el6 = dom.createTextNode("\n                    ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","large-8 columns large-centered text-center");
        var el7 = dom.createTextNode("\n                        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("p");
        dom.setAttribute(el7,"class","lead white-text");
        var el8 = dom.createElement("strong");
        var el9 = dom.createTextNode("ZURB");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode(" is a product design company since 1998. ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("br");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("Through consulting, product design tools and training, we transform the way businesses approach progressive design.");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n                    ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","medium-10 large-9 columns medium-centered");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3,"class","lead large text-center");
        var el4 = dom.createElement("strong");
        var el5 = dom.createTextNode("We’re a nimble team, doing mighty things!");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" We’re empowering businesses and teams to put Design first by helping them roll up their sleeves and apply customer-centric product design practices to their daily work.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("br");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3,"class","lead large text-center");
        var el4 = dom.createTextNode("Have a project or training that you want to get started? Give us a call at 408.341.0600 or email us at ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","/cdn-cgi/l/email-protection#f196948582859083859495b18b848393df929e9c");
        var el5 = dom.createTextNode("this");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(". Learn more about our Studios work.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("br");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var morphs = new Array(1);
        morphs[0] = dom.createAttrMorph(element0, 'style');
        return morphs;
      },
      statements: [
        ["attribute","style",["concat",["background: url(",["get","model.image",["loc",[null,[2,67],[2,78]]]],") no-repeat center fixed; -webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;background-attachment: scroll;"]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/login.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[1,0],[1,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/users/edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/users/edit.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/users/profile', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/users/profile.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/users', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/users.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","row");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("Hi, ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  \n   ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        morphs[1] = dom.createMorphAt(element0,3,3);
        return morphs;
      },
      statements: [
        ["content","model.firstName",["loc",[null,[2,9],[2,28]]]],
        ["content","outlet",["loc",[null,[3,3],[3,13]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('shopie/tests/authenticators/shopie-token-auth.jshint', function () {

  'use strict';

  QUnit.module('JSHint - authenticators');
  QUnit.test('authenticators/shopie-token-auth.js should pass jshint', function(assert) { 
    assert.ok(true, 'authenticators/shopie-token-auth.js should pass jshint.'); 
  });

});
define('shopie/tests/authorizers/shopie-token-auth.jshint', function () {

  'use strict';

  QUnit.module('JSHint - authorizers');
  QUnit.test('authorizers/shopie-token-auth.js should pass jshint', function(assert) { 
    assert.ok(true, 'authorizers/shopie-token-auth.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-gravatar.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-gravatar.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-gravatar.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-input.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-input.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-input.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-main.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-main.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-main.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-nav-menu-front.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-nav-menu-front.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-nav-menu-front.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/users/edit.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/users');
  QUnit.test('controllers/users/edit.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/users/edit.js should pass jshint.'); 
  });

});
define('shopie/tests/helpers/resolver', ['exports', 'ember/resolver', 'shopie/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('shopie/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('shopie/tests/helpers/start-app', ['exports', 'ember', 'shopie/app', 'shopie/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('shopie/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('shopie/tests/initializers/shopie-token-auth.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/shopie-token-auth.js should pass jshint', function(assert) { 
    assert.ok(true, 'initializers/shopie-token-auth.js should pass jshint.'); 
  });

});
define('shopie/tests/libs/validators/base.jshint', function () {

  'use strict';

  QUnit.module('JSHint - libs/validators');
  QUnit.test('libs/validators/base.js should pass jshint', function(assert) { 
    assert.ok(true, 'libs/validators/base.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/body-event-listener.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/body-event-listener.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/body-event-listener.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/shortcuts-route.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/shortcuts-route.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/shortcuts-route.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/text-input.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/text-input.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/text-input.js should pass jshint.'); 
  });

});
define('shopie/tests/models/user.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/user.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/user.js should pass jshint.'); 
  });

});
define('shopie/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('shopie/tests/routes/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('shopie/tests/routes/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('shopie/tests/routes/login.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/login.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/login.js should pass jshint.'); 
  });

});
define('shopie/tests/routes/users.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/users.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/users.js should pass jshint.'); 
  });

});
define('shopie/tests/services/config.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/config.js should pass jshint', function(assert) { 
    assert.ok(true, 'services/config.js should pass jshint.'); 
  });

});
define('shopie/tests/test-helper', ['shopie/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('shopie/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('shopie/tests/transforms/moment-date.jshint', function () {

  'use strict';

  QUnit.module('JSHint - transforms');
  QUnit.test('transforms/moment-date.js should pass jshint', function(assert) { 
    assert.ok(true, 'transforms/moment-date.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

});
define('shopie/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/adapters');
  QUnit.test('unit/adapters/application-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/controllers/users/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:users/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('shopie/tests/unit/controllers/users/edit-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers/users');
  QUnit.test('unit/controllers/users/edit-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/controllers/users/edit-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/mixins/body-event-listener-test', ['ember', 'shopie/mixins/body-event-listener', 'qunit'], function (Ember, BodyEventListenerMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | body event listener');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var BodyEventListenerObject = Ember['default'].Object.extend(BodyEventListenerMixin['default']);
    var subject = BodyEventListenerObject.create();
    assert.ok(subject);
  });

});
define('shopie/tests/unit/mixins/body-event-listener-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/mixins');
  QUnit.test('unit/mixins/body-event-listener-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/mixins/body-event-listener-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/mixins/shortcuts-route-test', ['ember', 'shopie/mixins/shortcuts-route', 'qunit'], function (Ember, ShortcutsRouteMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | shortcuts route');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var ShortcutsRouteObject = Ember['default'].Object.extend(ShortcutsRouteMixin['default']);
    var subject = ShortcutsRouteObject.create();
    assert.ok(subject);
  });

});
define('shopie/tests/unit/mixins/shortcuts-route-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/mixins');
  QUnit.test('unit/mixins/shortcuts-route-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/mixins/shortcuts-route-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/models/user-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('shopie/tests/unit/models/user-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/user-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/models/user-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/routes/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('shopie/tests/unit/routes/application-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/application-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/application-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('shopie/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/index-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/index-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/routes/login-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:login', 'Unit | Route | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('shopie/tests/unit/routes/login-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/login-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/login-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/routes/users-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:users', 'Unit | Route | users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('shopie/tests/unit/routes/users-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/users-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/users-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/serializers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('application', 'Unit | Serializer | application', {
    // Specify the other units that are required for this test.
    needs: ['serializer:application']
  });

  // Replace this with your real tests.
  ember_qunit.test('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

});
define('shopie/tests/unit/serializers/application-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/serializers');
  QUnit.test('unit/serializers/application-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/serializers/application-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/serializers/tatypie-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('tatypie', 'Unit | Serializer | tatypie', {
    // Specify the other units that are required for this test.
    needs: ['serializer:tatypie']
  });

  // Replace this with your real tests.
  ember_qunit.test('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

});
define('shopie/tests/unit/serializers/tatypie-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/serializers');
  QUnit.test('unit/serializers/tatypie-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/serializers/tatypie-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/services/config-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:config', 'Unit | Service | config', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('shopie/tests/unit/services/config-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/config-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/services/config-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/transforms/moment-date-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('transform:moment-date', 'Unit | Transform | moment date', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var transform = this.subject();
    assert.ok(transform);
  });

});
define('shopie/tests/unit/transforms/moment-date-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/transforms');
  QUnit.test('unit/transforms/moment-date-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/transforms/moment-date-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/utils/ctrl-or-cmd-test', ['shopie/utils/ctrl-or-cmd', 'qunit'], function (ctrlOrCmd, qunit) {

  'use strict';

  qunit.module('Unit | Utility | ctrl or cmd');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = ctrlOrCmd['default']();
    assert.ok(result);
  });

});
define('shopie/tests/unit/utils/ctrl-or-cmd-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/utils');
  QUnit.test('unit/utils/ctrl-or-cmd-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/utils/ctrl-or-cmd-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/utils/shopie-paths-test', ['shopie/utils/shopie-paths', 'qunit'], function (shopiePaths, qunit) {

  'use strict';

  qunit.module('Unit | Utility | shopie paths');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = shopiePaths['default']();
    assert.ok(result);
  });

});
define('shopie/tests/unit/utils/shopie-paths-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/utils');
  QUnit.test('unit/utils/shopie-paths-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/utils/shopie-paths-test.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/ctrl-or-cmd.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/ctrl-or-cmd.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/ctrl-or-cmd.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/shopie-paths.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/shopie-paths.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/shopie-paths.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/word-count.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/word-count.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/word-count.js should pass jshint.'); 
  });

});
define('shopie/transforms/moment-date', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Transform.extend({
        deserialize: function deserialize(serialized) {
            if (serialized) {
                return moment(serialized);
            }
            return serialized;
        },

        serialize: function serialize(deserialized) {
            if (deserialized) {
                return moment(deserialized).toDate();
            }
            return deserialized;
        }
    });

});
define('shopie/utils/ctrl-or-cmd', ['exports'], function (exports) {

	'use strict';

	var ctrlOrCmd = navigator.userAgent.indexOf('Mac') !== -1 ? 'command' : 'ctrl';

	exports['default'] = ctrlOrCmd;

});
define('shopie/utils/shopie-paths', ['exports'], function (exports) {

    'use strict';

    var makeRoute = function makeRoute(root, args) {
        var slashAtStart, slashAtEnd, parts, route;

        slashAtStart = /^\//;
        slashAtEnd = /\/$/;
        route = root.replace(slashAtEnd, '');
        parts = Array.prototype.slice.call(args, 0);

        parts.forEach(function (part) {
            if (part) {
                route = [route, part.replace(slashAtStart, '').replace(slashAtEnd, '')].join('/');
            }
        });
        return route += '/';
    };

    var shopiePaths = function shopiePaths() {
        var _arguments = arguments;

        var adminRoot = '/console',
            apiRoot = '/api/v1';

        return {
            admin: function admin() {
                return makeRoute(adminRoot, _arguments);
            },
            api: function api() {
                return makeRoute(apiRoot, _arguments);
            },

            isSecure: function isSecure(url) {
                var link = document.createElement('a');
                link.href = url;
                return link.protocol === 'https:';
            },

            join: function join() {
                if (arguments.length > 1) {
                    return makeRoute(arguments[0], Array.prototype.slice.call(arguments, 1));
                } else if (arguments.length === 1) {
                    var arg = arguments[0];
                    return arg.slice(-1) === '/' ? arg : arg + '/';
                }
                return '/';
            }
        };
    };

    exports['default'] = shopiePaths;

});
define('shopie/utils/word-count', ['exports'], function (exports) {

    'use strict';

    // jscs: disable
    /* global XRegExp */

    function wordCount(s) {

        var nonANumLetters = new XRegExp("[^\\s\\d\\p{L}]", "g"); // all non-alphanumeric letters regexp

        s = s.replace(/<(.|\n)*?>/g, ' '); // strip tags
        s = s.replace(nonANumLetters, ''); // ignore non-alphanumeric letters
        s = s.replace(/(^\s*)|(\s*$)/gi, ''); // exclude starting and ending white-space
        s = s.replace(/\n /gi, ' '); // convert newlines to spaces
        s = s.replace(/\n+/gi, ' ');
        s = s.replace(/[ ]{2,}/gi, ' '); // convert 2 or more spaces to 1

        return s.split(' ').length;
    }

    exports['default'] = wordCount;

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('shopie/config/environment', ['ember'], function(Ember) {
  var prefix = 'shopie';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("shopie/tests/test-helper");
} else {
  require("shopie/app")["default"].create({"API_HOST":null,"API_NAMESPACE":"api/v1","name":"shopie","version":"0.0.0+9d81e8df"});
}

/* jshint ignore:end */
//# sourceMappingURL=shopie.map