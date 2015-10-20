"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('shopie/adapters/application', ['exports', 'shopie/adapters/base'], function (exports, BaseAdapter) {

	'use strict';

	var ApplicationAdapter = BaseAdapter['default'].extend();

	exports['default'] = ApplicationAdapter;

});
define('shopie/adapters/base', ['exports', 'ember-data', 'shopie/utils/shopie-paths'], function (exports, DS, shopiePaths) {

    'use strict';

    exports['default'] = DS['default'].JSONAPIAdapter.extend({
        host: window.location.origin,
        namespace: shopiePaths['default']().apiRoot.slice(1),

        query: function query(store, type, _query) {
            var id = undefined;

            if (_query.id) {
                id = _query.id;
                delete _query.id;
            }

            return this.ajax(this.buildURL(type.modelName, id), 'GET', { data: _query });
        },

        buildURL: function buildURL(type, id) {
            // Ensure trailing slashes
            var url = this._super(type, id);

            if (url.slice(-1) !== '/') {
                url += '/';
            }

            return url;
        }
    });

});
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
define('shopie/authenticators/shopie-oauth2', ['exports', 'ember', 'simple-auth-oauth2/authenticators/oauth2'], function (exports, Ember, Authenticator) {

    'use strict';

    exports['default'] = Authenticator['default'].extend({
        config: Ember['default'].inject.service(),
        makeRequest: function makeRequest(url, data) {
            data.client_id = this.get('config.clientId');
            data.client_secret = this.get('config.clientSecret');
            data.scopes = 'read write';
            return this._super(url, data);
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
define('shopie/components/sh-app', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['sh-app'],
        showCart: false,

        /**
        * todo: build logic to display cart
        * @type {Array}
        */
        showCartContent: Ember['default'].observer('showCart', function () {
            var showSettingsMenu = this.get('showCart');
        })
    });

});
define('shopie/components/sh-btn-group-type', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'section',
        classNames: ['sh-btn-group-type'],

        actions: {
            primaryAction: function primaryAction() {
                this.sendAction('primaryAction');
            },
            secondaryAction: function secondaryAction() {
                this.sendAction('secondaryAction');
            }
        }
    });

});
define('shopie/components/sh-cart-table', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['sh-cart-table']
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
define('shopie/components/sh-infinite-scroll-box', ['exports', 'ember', 'shopie/mixins/infinite-scroll', 'shopie/utils/set-scroll-classname'], function (exports, Ember, InfiniteScrollMixin, setScrollClassName) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend(InfiniteScrollMixin['default'], {
        didRender: function didRender() {
            this._super();

            var el = this.$();

            el.on('scroll', Ember['default'].run.bind(el, setScrollClassName['default'], {
                target: el.closest('.content-list'),
                offset: 10
            }));
        },

        willDestroyElement: function willDestroyElement() {
            this._super();

            this.$().off('scroll');
        }
    });

});
define('shopie/components/sh-infinite-scroll', ['exports', 'ember', 'shopie/mixins/infinite-scroll'], function (exports, Ember, InfiniteScroll) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({ InfiniteScroll: InfiniteScroll['default'] });

});
define('shopie/components/sh-input', ['exports', 'ember', 'shopie/mixins/text-input'], function (exports, Ember, TextInputMixin) {

    'use strict';

    exports['default'] = Ember['default'].TextField.extend(TextInputMixin['default'], {
        classNames: ['sh-input']
    });

});
define('shopie/components/sh-loading', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['sk-fading-circle']
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
define('shopie/components/sh-modal-dialog', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({

        notifications: Ember['default'].inject.service(),

        didInsertElement: function didInsertElement() {
            this.$('.js-modal-container, .js-modal-background').addClass('fade-in open');
            this.$('.js-modal').addClass('open');
        },

        close: function close() {
            var self = this;

            this.$('.js-modal, .js-modal-background').removeClass('fade-in').addClass('fade-out');

            // The background should always be the last thing to fade out, so check on that instead of the content
            this.$('.js-modal-background').on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function (event) {
                if (event.originalEvent.animationName === 'fade-out') {
                    self.$('.js-modal, .js-modal-background').removeClass('open');
                }
            });

            this.sendAction();
        },

        handleAction: function handleAction(promise) {
            var _this = this;

            promise.then(function (resolved) {
                _this.close();
                return resolved;
            }, function (error) {
                _this.get('notifications').showErrors(error, {});
            });
        },

        actions: {
            closeModal: function closeModal() {
                this.close();
            },
            confirmAccept: function confirmAccept() {
                this.handleAction(this.attrs.confirmAccept());
            },
            confirmReject: function confirmReject() {
                this.handleAction(this.attrs.confirmReject());
            },
            noBubble: Ember['default'].K
        },

        klass: Ember['default'].computed('type', 'style', function () {
            var classNames = [];

            classNames.push(this.get('type') ? 'modal-' + this.get('type') : 'modal');

            if (this.get('style')) {
                this.get('style').split(',').forEach(function (style) {
                    classNames.push('modal-style-' + style);
                });
            }

            return classNames.join(' ');
        }),

        acceptButtonClass: Ember['default'].computed('confirm.accept.buttonClass', function () {
            return this.get('confirm.accept.buttonClass') ? this.get('confirm.accept.buttonClass') : 'btn btn-green';
        }),

        rejectButtonClass: Ember['default'].computed('confirm.reject.buttonClass', function () {
            return this.get('confirm.reject.buttonClass') ? this.get('confirm.reject.buttonClass') : 'btn btn-red';
        })
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
define('shopie/components/sh-notification', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'article',
        classNames: ['sh-notification', 'sh-notification-passive'],
        classNameBindings: ['typeClass'],

        message: null,

        notifications: Ember['default'].inject.service(),

        typeClass: Ember['default'].computed('message.type', function () {
            var classes = '',
                type = this.get('message.type'),
                typeMapping;

            typeMapping = {
                success: 'green',
                error: 'red',
                warn: 'yellow'
            };

            if (typeMapping[type] !== undefined) {
                classes += 'sh-notification-' + typeMapping[type];
            }

            return classes;
        }),

        didInsertElement: function didInsertElement() {
            var _this = this;

            this.$().on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function (event) {
                if (event.originalEvent.animationName === 'fade-out') {
                    _this.get('notifications').closeNotification(_this.get('message'));
                }
            });
        },

        willDestroyElement: function willDestroyElement() {
            this.$().off('animationend webkitAnimationEnd oanimationend MSAnimationEnd');
        },

        actions: {
            closeNotification: function closeNotification() {
                this.get('notifications').closeNotification(this.get('message'));
            }
        }
    });

});
define('shopie/components/sh-notifications', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'aside',
        classNames: 'sh-notifications',

        notifications: Ember['default'].inject.service(),

        messages: Ember['default'].computed.alias('notifications.notifications')
    });

});
define('shopie/components/sh-product-add-to-cart', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({});

});
define('shopie/components/sh-product-item', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'li',
        classNames: ['sh-product', 'product', 'js-product'],

        actions: {
            view: function view(product) {
                this.sendAction('view', product);
            }
        }
    });

});
define('shopie/components/sh-trim-focus-input', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var TrimFocusInput = Ember['default'].TextField.extend({
        focus: true,
        classNames: ['sh-input'],
        attributeBindings: ['autofocus'],

        autofocus: Ember['default'].computed(function () {
            if (this.get('focus')) {
                return device.ios() ? false : 'autofocus';
            }

            return false;
        }),

        focusField: Ember['default'].on('didInsertElement', function () {
            // This fix is required until Mobile Safari has reliable
            // autofocus, select() or focus() support
            if (this.get('focus') && !device.ios()) {
                this.$().val(this.$().val()).focus();
            }
        }),

        trimValue: Ember['default'].on('focusOut', function () {
            var text = this.$().val();
            this.$().val(text.trim());
        })
    });

    exports['default'] = TrimFocusInput;

});
define('shopie/controllers/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({

        // jscs: disable
        signedOut: Ember['default'].computed.match('currentPath', /(signin|signup|setup|reset)/),
        // jscs: enable
        showCart: false,

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
define('shopie/controllers/cart', ['exports', 'ember', 'shopie/models/cart'], function (exports, Ember, CartModel) {

    'use strict';

    var watchedProps = ['models.items.[]'];
    CartModel['default'].eachAttribute(function (name) {
        watchedProps.push('model.' + name);
    });
    exports['default'] = Ember['default'].Controller.extend({
        items: (function () {
            return this.get('model.items');
        }).property('model.items')
    });

});
define('shopie/controllers/index', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var headerImages = ["/static/images/home15.jpg", "/static/images/home14.jpg", "/static/images/home13.jpg"];

    exports['default'] = Ember['default'].Controller.extend({
        imageCover: Ember['default'].computed(function () {
            return headerImages[Math.floor(Math.random() * headerImages.length)];
        })
    });

});
define('shopie/controllers/login', ['exports', 'ember', 'shopie/mixins/validation-engine', 'ic-ajax'], function (exports, Ember, ValidationEngine, ic_ajax) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend(ValidationEngine['default'], {
        submitting: false,
        loggingIn: false,
        authProperties: ['identification', 'password']

    });

});
define('shopie/controllers/modals/quick-view', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('shopie/controllers/modals/remove-cart-item', ['exports', 'ember', 'shopie/utils/get-cookie', 'ic-ajax'], function (exports, Ember, getCookie, ic_ajax) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        notifications: Ember['default'].inject.service(),

        actions: {
            confirmAccept: function confirmAccept() {
                var _this = this;

                var item = this.get('model'),
                    itemId = this.get('id'),
                    itemName = item.get('productName'),
                    cart = item.get('cart');

                return ic_ajax.request({
                    url: '/cart/item/' + itemId + '/delete/',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded',
                    headers: {
                        'X-CSRFToken': getCookie['default']('csrftoken')
                    },
                    data: {
                        product_id: item.productId,
                        add_item_quantity: 0
                    }
                }).then(function (json) {
                    var message = itemName + ' telah dihapus dari keranjang anda';
                    _this.get('notifications').showNotification(message, {
                        delayed: false,
                        key: 'cart.items.remove'
                    });
                    _this.get('model').deleteRecord();
                    _this.send('refreshCart');
                    return json;
                }, function (error) {
                    _this.get('notifications').showAPIError(error, { key: 'cart.items.remove' });
                });
            },

            confirmReject: function confirmReject() {
                return new Ember['default'].RSVP.Promise(function (resolve, reject) {
                    return resolve();
                });
            }
        },

        confirm: {
            accept: {
                text: 'Remove',
                buttonClass: 'btn btn-red'
            },
            reject: {
                text: 'Cancel',
                buttonClass: 'btn btn-default btn-minor'
            }
        }
    });

});
define('shopie/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('shopie/controllers/product', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        showCart: false,
        actions: {
            purchase: function purchase() {
                alert('kamu tertarik?');
            },
            read: function read() {
                var el = Ember['default'].$('body');
                el.animate({
                    scrollTop: Ember['default'].$(".entry_content").offset().top
                }, 2000);
            }
        }
    });

});
define('shopie/controllers/shop', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        showCart: false,
        actions: {
            openQuickView: function openQuickView(product) {
                this.send('openModal', 'quick-view', product);
            }
        }
    });

});
define('shopie/controllers/users/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('shopie/helpers/cycle-it', ['exports', 'ember', 'shopie/utils/cycle-generator'], function (exports, Ember, cycleGenerator) {

    'use strict';

    exports['default'] = Ember['default'].Helper.helper(function (params) {
        var gen = cycleGenerator['default'](params);
        return gen.next();
    });

});
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
define('shopie/initializers/shopie-authenticator', ['exports', 'shopie/authenticators/shopie-oauth2'], function (exports, ShopieOauth2Authenticator) {

    'use strict';

    exports['default'] = {
        name: 'shopie-authenticator',

        initialize: function initialize(registry, application) {
            application.register('shopie-authenticator:oauth2-password-grant', ShopieOauth2Authenticator['default']);
        }
    };

});
define('shopie/initializers/simple-auth-env', ['exports', 'shopie/config/environment'], function (exports, ENV) {

    'use strict';

    exports['default'] = {
        name: 'simple-auth-env',
        before: 'simple-auth-oauth2',

        initialize: function initialize() {
            ENV['default']['simple-auth-oauth2'].serverTokenEndpoint = '/o/token/';
            ENV['default']['simple-auth-oauth2'].serverTokenRevocationEndpoint = '/authentication/revoke_token/';

            ENV['default']['simple-auth'].localStorageKey = 'shopie:session';
        }
    };

});
define('shopie/initializers/simple-auth-oauth2', ['exports', 'simple-auth-oauth2/configuration', 'simple-auth-oauth2/authenticators/oauth2', 'simple-auth-oauth2/authorizers/oauth2', 'shopie/config/environment'], function (exports, Configuration, Authenticator, Authorizer, ENV) {

  'use strict';

  exports['default'] = {
    name: 'simple-auth-oauth2',
    before: 'simple-auth',
    initialize: function initialize(container, application) {
      Configuration['default'].load(container, ENV['default']['simple-auth-oauth2'] || {});
      container.register('simple-auth-authorizer:oauth2-bearer', Authorizer['default']);
      container.register('simple-auth-authenticator:oauth2-password-grant', Authenticator['default']);
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
define('shopie/libs/stale-result', ['exports'], function (exports) {

    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var StaleResult = (function () {
        function StaleResult() {
            _classCallCheck(this, StaleResult);

            this.hasResults = false;
            this._results = null;
        }

        _createClass(StaleResult, [{
            key: "results",
            set: function set(results) {
                if (results) {
                    this._results = results;
                    this.hasResults = true;
                }
            },
            get: function get() {
                return this._results;
            }
        }]);

        return StaleResult;
    })();

    exports['default'] = StaleResult;

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
define('shopie/libs/validators/login', ['exports', 'shopie/libs/validators/base'], function (exports, BaseValidator) {

    'use strict';

    exports['default'] = BaseValidator['default'].create({
        properties: ['identification', 'signin', 'forgotPassword'],
        invalidMessage: 'Email address is not valid',

        identification: function identification(model) {
            var id = model.get('identification');

            if (!validator.empty(id) && !validator.isEmail(id)) {
                model.get('errors').add('identification', this.get('invalidMessage'));
                this.invalidate();
            }
        },

        signin: function signin(model) {
            var id = model.get('identification'),
                password = model.get('password');

            model.get('errors').clear();

            if (validator.empty(id)) {
                model.get('errors').add('identification', 'Please enter an email');
                this.invalidate();
            }

            if (!validator.empty(id) && !validator.isEmail(id)) {
                model.get('errors').add('identification', this.get('invalidMessage'));
                this.invalidate();
            }

            if (validator.empty(password)) {
                model.get('errors').add('password', 'Please enter a password');
                this.invalidate();
            }
        },

        forgotPassword: function forgotPassword(model) {
            var id = model.get('identification');

            model.get('errors').clear();

            if (validator.empty(id) || !validator.isEmail(id)) {
                model.get('errors').add('identification', this.get('invalidMessage'));
                this.invalidate();
            }
        }
    });

});
define('shopie/libs/validators/new-user', ['exports', 'shopie/libs/validators/base'], function (exports, BaseValidator) {

    'use strict';

    exports['default'] = BaseValidator['default'].extend({
        properties: ['name', 'email', 'password'],
        name: function name(model) {
            var name = model.get('name');

            if (!validator.isLength(name, 1)) {
                model.get('errors').add('name', 'Please enter a name.');
                this.invalidate();
            }
        },
        email: function email(model) {
            var email = model.get('email');

            if (validator.empty(email)) {
                model.get('errors').add('email', 'Please enter an email.');
                this.invalidate();
            } else if (!validator.isEmail(email)) {
                model.get('errors').add('email', 'Invalid Email.');
                this.invalidate();
            }
        },
        password: function password(model) {
            var password = model.get('password');

            if (!validator.isLength(password, 8)) {
                model.get('errors').add('password', 'Password must be at least 8 characters long');
                this.invalidate();
            }
        }
    });

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
define('shopie/mixins/infinite-scroll', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({
        isLoading: false,
        triggerPoint: 100,

        /**
         * Determines if we are past a scroll point where we need to fetch the next page
         * @param {object} event The scroll event
         */
        checkScroll: function checkScroll(event) {
            var element = event.target,
                triggerPoint = this.get('triggerPoint'),
                isLoading = this.get('isLoading');

            // If we haven't passed our threshold or we are already fetching content, exit
            if (isLoading || element.scrollTop + element.clientHeight + triggerPoint <= element.scrollHeight) {
                return;
            }

            this.sendAction('fetch');
        },

        didInsertElement: function didInsertElement() {
            var el = this.get('element');

            el.onscroll = Ember['default'].run.bind(this, this.checkScroll);

            if (el.scrollHeight <= el.clientHeight) {
                this.sendAction('fetch');
            }
        },

        willDestroyElement: function willDestroyElement() {
            // turn off the scroll handler
            this.get('element').onscroll = null;
        }
    });

});
define('shopie/mixins/pagination-route', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var defaultPaginationSettings = {
        page: 1,
        limit: 15
    };

    exports['default'] = Ember['default'].Mixin.create({
        notifications: Ember['default'].inject.service(),

        paginationModel: null,
        paginationSettings: null,
        paginationMeta: null,

        init: function init() {
            var paginationSettings = this.get('paginationSettings'),
                settings = Ember['default'].$.extend({}, defaultPaginationSettings, paginationSettings);

            this._super.apply(this, arguments);
            this.set('paginationSettings', settings);
            this.set('paginationMeta', {});
        },

        reportLoadError: function reportLoadError(response) {
            var message = 'A problem was encountered while loading more records';

            this.get('notifications').showAlert(message, { type: 'error', key: 'pagination.load.failed' });
        },

        loadFirstPage: function loadFirstPage() {
            var _this = this;

            var paginationSettings = this.get('paginationSettings'),
                modelName = this.get('paginationModel');

            paginationSettings.page = 1;

            return this.get('store').query(modelName, paginationSettings).then(function (results) {
                _this.set('paginationMeta', results.meta);
                return results;
            }, function (response) {
                _this.reportLoadError(response);
            });
        },

        actions: {
            loadFirstPage: function loadFirstPage() {
                return this.loadFirstPage();
            },

            /**
             * Loads the next paginated page of posts into the ember-data store. Will cause the posts list UI to update.
             * @return
             */
            loadNextPage: function loadNextPage() {
                var _this2 = this;

                var store = this.get('store'),
                    modelName = this.get('paginationModel'),
                    metadata = this.get('paginationMeta'),
                    paginationSettings = this.get('paginationSettings');

                // our pagination
                var available = metadata.pagination && metadata.pagination.pages > metadata.pagination.page;

                if (available) {
                    this.set('isLoading', true);
                    this.set('paginationSettings.page', metadata.pagination.page + 1);

                    store.query(modelName, paginationSettings).then(function (results) {
                        _this2.set('isLoading', false);
                        _this2.set('paginationMeta', results.meta);
                        return results;
                    }, function (response) {
                        _this2.reportLoadError(response);
                    });
                }
            },

            resetPagination: function resetPagination() {
                this.set('paginationSettings.page', 1);
            }
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

            Object.keys(shortcuts).forEach(function (shortcut) {
                return _this.addShortcut(shortcut);
            });
        },

        addShortcut: function addShortcut(shortcut) {
            var _this2 = this;

            var shortcuts = this.get('shortcuts'),
                scope = shortcuts[shortcut].scope || 'default',
                action = shortcuts[shortcut],
                options = undefined;
            if (Ember['default'].typeOf(action) !== 'string') {
                options = action.options;
                action = action.action;
            }

            key(shortcut, scope, function (event) {
                // stop things like ctrl+s from actually opening a save dialogue
                event.preventDefault();
                _this2.send(action, options);
            });
        },

        removeShortcuts: function removeShortcuts() {
            var shortcuts = this.get('shortcuts');

            Object.keys(shortcuts).forEach(function (shortcut) {
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
define('shopie/mixins/slug-route', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({

        model: null,

        serialize: function serialize(model, params) {
            return { product_id: model.get('slug') + '-' + model.get('id') };
        }
    });

});
define('shopie/mixins/style-body', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({
        activate: function activate() {
            this._super();

            var cssClasses = this.get('classNames');

            if (cssClasses) {
                Ember['default'].run.schedule('afterRender', null, function () {
                    cssClasses.forEach(function (curClass) {
                        Ember['default'].$('body').addClass(curClass);
                    });
                });
            }
        },

        deactivate: function deactivate() {
            this._super();

            var cssClasses = this.get('classNames');

            Ember['default'].run.schedule('afterRender', null, function () {
                cssClasses.forEach(function (curClass) {
                    Ember['default'].$('body').removeClass(curClass);
                });
            });
        }
    });

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
define('shopie/mixins/validation-engine', ['exports', 'ember', 'ember-data', 'shopie/utils/ajax', 'shopie/utils/validator-extensions', 'shopie/libs/validator/login', 'shopie/libs/validator/new-user'], function (exports, Ember, DS, getRequestErrorMessage, ValidatorExtensions, loginValidator, newUserValidator) {

    'use strict';

    ValidatorExtensions['default'].init();

    exports['default'] = Ember['default'].Mixin.create({
        validators: {
            login: loginValidator['default'],
            newUser: newUserValidator['default']
        },

        errors: DS['default'].Errors.create(),

        hasValidated: Ember['default'].A,

        validate: function validate(opts) {
            opts = opts || {};

            var model = this,
                type = undefined,
                validator = undefined,
                hasValidated = undefined;

            if (opts.model) {
                model = opts.model;
            } else if (this instanceof DS['default'].Model) {
                model = this;
            } else if (this.get('model')) {
                model = this.get('model');
            }

            type = this.get('validationType') || model.get('validationType');
            validator = this.get('validators.' + type) || model.get('validators.' + type);
            hasValidated = this.get('hasValidated');
            opts.validationType = type;

            return new Ember['default'].RSVP.Promise(function (resolve, reject) {
                var passed = undefined;
                if (!type || !validator) {
                    return reject(['The validator specified, "' + type + '", did not exist!']);
                }

                if (opts.property) {
                    // If property isn't in `hasValidated`, add it to mark that this field can show a validation result
                    hasValidated.addObject(opts.property);
                    model.get('errors').remove(opts.property);
                } else {
                    model.get('errors').clear();
                }

                passed = validator.check(model, opts.property);

                return passed ? resolve() : reject();
            });
        },

        /**
        * The primary goal of this method is to override the `save` method on Ember Data models.
        * This allows us to run validation before actually trying to save the model to the server.
        * You can supply options to be passed into the `validate` method, since the ED `save` method takes no options.
        */
        save: function save(options) {
            var _this = this;

            // this is a hack, but needed for async _super calls.
            // ref: https://github.com/emberjs/ember.js/pull/4301
            var _super = this.__nextSuper;

            options = options || {};
            options.wasSave = true;

            // model.destroyRecord() calls model.save() behind the scenes.
            // in that case, we don't need validation checks or error propagation,
            // because the model itself is being destroyed.
            if (this.get('isDeleted')) {
                return this._super();
            }

            // If validation fails, reject with validation errors.
            // If save to the server fails, reject with server response.
            return this.validate(options).then(function () {
                return _super.call(_this, options);
            })['catch'](function (result) {
                // server save failed or validator type doesn't exist
                if (result && !Ember['default'].isArray(result)) {
                    // return the array of errors from the server
                    result = getRequestErrorMessage['default'](result);
                }

                return Ember['default'].RSVP.reject(result);
            });
        },
        actions: {
            validate: function validate(property) {
                this.validate({ property: property });
            }
        }
    });

});
define('shopie/models/cart-item', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        quantity: DS['default'].attr(),
        lineTotal: DS['default'].attr(),
        lineSubtotal: DS['default'].attr(),
        extraPrice: DS['default'].attr(),
        product: DS['default'].belongsTo('product', { async: true }),
        cart: DS['default'].belongsTo('cart'),

        productName: (function () {
            return this.get('product.name');
        }).property('product.name'),

        productPrice: (function () {
            return this.get('product').get('unitPrice');
        }).property('product.name'),

        productId: (function () {
            return this.get('product.id');
        }).property('product.id')
    });

});
define('shopie/models/cart', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        subtotalPrice: DS['default'].attr('string'),
        totalPrice: DS['default'].attr('string'),
        createdAt: DS['default'].attr('moment-date'),
        updatedAt: DS['default'].attr('moment-date'),
        extraPrice: DS['default'].attr(),
        user: DS['default'].belongsTo('user'),
        items: DS['default'].hasMany('cart-item', { async: true })
    });

});
define('shopie/models/product', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        name: DS['default'].attr('string'),
        slug: DS['default'].attr('string'),
        metaDescription: DS['default'].attr('string'),
        shortDescription: DS['default'].attr('string'),
        description: DS['default'].attr('string'),
        image: DS['default'].attr('string'),
        thumbnail: DS['default'].attr('string'),
        unitPrice: DS['default'].attr('string'),
        isActive: DS['default'].attr('boolean'),
        productType: DS['default'].attr(),
        parent: DS['default'].belongsTo('product', { inverse: 'variants' }),
        variants: DS['default'].hasMany('product', { inverse: 'parent' }),
        author: DS['default'].belongsTo('user', { async: true }),

        formatSlug: (function () {
            return this.get('slug') + '-' + this.get('id');
        }).property('slug', 'id')
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
define('shopie/router', ['exports', 'ember', 'shopie/config/environment', 'shopie/utils/document-title'], function (exports, Ember, config, documentTitle) {

  'use strict';

  $('noscript').remove();

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  documentTitle['default']();

  Router.map(function () {
    this.route('cart');
    //product
    this.route('shop');
    this.route('product', { path: '/product/:product_slug' });
    this.route('issues', { path: '/product/:product_slug/issues' });
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
        notifications: Ember['default'].inject.service(),

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

            openModal: function openModal(modalName, model, type) {
                key.setScope('modal');
                modalName = 'modals/' + modalName;
                this.set('modalName', modalName);

                // We don't always require a modal to have a controller
                // so we're skipping asserting if one exists
                if (this.controllerFor(modalName, true)) {
                    this.controllerFor(modalName).set('model', model);

                    if (type) {
                        this.controllerFor(modalName).set('imageType', type);
                        this.controllerFor(modalName).set('src', model.get(type));
                    }
                }

                return this.render(modalName, {
                    into: 'application',
                    outlet: 'modal'
                });
            },

            confirmModal: function confirmModal() {
                var modalName = this.get('modalName');

                this.send('closeModal');

                if (this.controllerFor(modalName, true)) {
                    this.controllerFor(modalName).send('confirmAccept');
                }
            },

            closeModal: function closeModal() {
                this.disconnectOutlet({
                    outlet: 'modal',
                    parentView: 'application'
                });

                key.setScope('default');
            },

            // noop default for unhandled save (used from shortcuts)
            save: Ember['default'].K
        }
    });

});
define('shopie/routes/cart', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        titleToken: 'Cart',
        classNames: ['cart', 'js-cart'],

        config: Ember['default'].inject.service(),

        model: function model() {
            var cartId = this.get('config.currentCart');
            return this.get('store').findRecord('cart', cartId).then(function (cart) {
                var items = cart.get('items');
                return cart;
            });
        },

        actions: {
            refreshCart: function refreshCart() {
                this.model();
            }
        }
    });

});
define('shopie/routes/index', ['exports', 'ember', 'shopie/mixins/style-body'], function (exports, Ember, styleBody) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend(styleBody['default'], {
        classNames: ['home', 'js-home'],
        titleToken: 'Home',

        renderTemplate: function renderTemplate() {
            this.render('cover/home', {
                into: 'application',
                outlet: 'header-cover'
            });
            this.render('index');
        }
    });

});
define('shopie/routes/login', ['exports', 'ember', 'simple-auth/configuration', 'shopie/mixins/style-body', 'ember-data'], function (exports, Ember, Configuration, styleBody, DS) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend(styleBody['default'], {
        titleToken: 'Log In',

        classNames: ['shopie-login'],

        beforeModel: function beforeModel() {
            if (this.get('session').isAuthenticated) {
                this.transitionTo(Configuration['default'].routeAfterAuthentication);
            }
        },

        model: function model() {
            return Ember['default'].Object.create({
                identification: '',
                password: '',
                errors: DS['default'].Errors.create()
            });
        },

        // the deactivate hook is called after a route has been exited.
        deactivate: function deactivate() {
            this._super();

            var controller = this.controllerFor('login');

            // clear the properties that hold the credentials when we're no longer on the signin screen
            controller.set('model.identification', '');
            controller.set('model.password', '');
        }
    });

});
define('shopie/routes/product', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({

        classNames: ['product', 'js-product'],

        titleToken: function titleToken() {
            return this.modelFor(this.routeName).get('name') || 'Product';
        },
        // Our server, serve this page by /product/{product-slug}-{pk}
        model: function model(params) {
            var splitted = params.product_slug.split('-');
            if (splitted.length) {
                var productPk = Number(splitted.pop());
                if (isNaN(productPk) || !isFinite(productPk) || productPk % 1 !== 0 || productPk <= 0) {
                    return this.redirectTo404(params.product_slug);
                }
                return this.store.findRecord('product', productPk);
            } else {
                return this.redirectTo404(params.product_slug);
            }
        },

        redirectTo404: function redirectTo404(slug) {
            return this.transitionTo('error404', slug);
        },

        serialize: function serialize(model) {
            return { product_slug: model.get('formatSlug') };
        }
    });

});
define('shopie/routes/shop', ['exports', 'ember', 'shopie/mixins/shortcuts-route', 'shopie/mixins/pagination-route', 'shopie/mixins/style-body'], function (exports, Ember, ShortcutsRoute, PaginationRoute, styleBody) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend(styleBody['default'], ShortcutsRoute['default'], PaginationRoute['default'], {
        titleToken: 'Shop',
        paginationModel: 'product',
        classNames: ['shop', 'js-shop'],

        paginationSettings: {
            page: 1,
            limit: 20
        },

        model: function model() {
            var _this = this;

            return this.loadFirstPage().then(function () {
                return _this.store.filter('product', function (product) {
                    return product.get('isActive') && product.get('productType') !== 30;
                });
            });
        },

        setupCurrentMeta: function setupCurrentMeta(meta) {
            this.controller.set('currentMeta', meta);
        },

        scrollContent: function scrollContent(amount) {
            var content = Ember['default'].$('.js-products'),
                scrolled = content.scrollTop();

            content.scrollTop(scrolled + 50 * amount);
        },

        shortcuts: {
            'v': 'viewProduct'
        }
    });

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
define('shopie/services/notifications', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Service.extend({
        delayedNotifications: Ember['default'].A(),
        content: Ember['default'].A(),

        alerts: Ember['default'].computed.filter('content', function (notification) {
            var status = Ember['default'].get(notification, 'status');
            return status === 'alert';
        }),

        notifications: Ember['default'].computed.filter('content', function (notification) {
            var status = Ember['default'].get(notification, 'status');
            return status === 'notification';
        }),

        handleNotification: function handleNotification(message, delayed) {
            // If this is an alert message from the server, treat it as html safe
            if (typeof message.toJSON === 'function' && message.get('status') === 'alert') {
                message.set('message', message.get('message').htmlSafe());
            }

            if (!Ember['default'].get(message, 'status')) {
                Ember['default'].set(message, 'status', 'notification');
            }

            if (!delayed) {
                this.get('content').pushObject(message);
            } else {
                this.get('delayedNotifications').pushObject(message);
            }
        },

        showAlert: function showAlert(message, options) {
            options = options || {};

            this.handleNotification({
                message: message,
                status: 'alert',
                type: options.type
            }, options.delayed);
        },

        showNotification: function showNotification(message, options) {
            options = options || {};

            if (!options.doNotCloseNotifications) {
                this.closeNotifications();
            }

            this.handleNotification({
                message: message,
                status: 'notification',
                type: options.type
            }, options.delayed);
        },

        // TODO: review whether this can be removed once no longer used by validations
        showErrors: function showErrors(errors, options) {
            options = options || {};

            if (!options.doNotCloseNotifications) {
                this.closeNotifications();
            }

            for (var i = 0; i < errors.length; i += 1) {
                this.showNotification(errors[i].message || errors[i], { type: 'error', doNotCloseNotifications: true });
            }
        },

        showAPIError: function showAPIError(resp, options) {
            options = options || {};
            options.type = options.type || 'error';

            if (!options.doNotCloseNotifications) {
                this.closeNotifications();
            }

            options.defaultErrorText = options.defaultErrorText || 'There was a problem on the server, please try again.';

            if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.error) {
                this.showAlert(resp.jqXHR.responseJSON.error, options);
            } else if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.errors) {
                this.showErrors(resp.jqXHR.responseJSON.errors, options);
            } else if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.message) {
                this.showAlert(resp.jqXHR.responseJSON.message, options);
            } else {
                this.showAlert(options.defaultErrorText, { type: options.type, doNotCloseNotifications: true });
            }
        },

        displayDelayed: function displayDelayed() {
            var self = this;

            self.delayedNotifications.forEach(function (message) {
                self.get('content').pushObject(message);
            });
            self.delayedNotifications = [];
        },

        closeNotification: function closeNotification(notification) {
            var content = this.get('content');

            if (typeof notification.toJSON === 'function') {
                notification.deleteRecord();
                notification.save()['finally'](function () {
                    content.removeObject(notification);
                });
            } else {
                content.removeObject(notification);
            }
        },

        closeNotifications: function closeNotifications() {
            this.set('content', this.get('content').rejectBy('status', 'notification'));
        },

        closeAll: function closeAll() {
            this.get('content').clear();
        }
    });

});
define('shopie/services/shopie-paths', ['exports', 'ember', 'shopie/utils/shopie-paths'], function (exports, Ember, shopiePaths) {

    'use strict';

    exports['default'] = Ember['default'].Service.extend(Ember['default']._ProxyMixin, {
        content: shopiePaths['default']()
    });

});
define('shopie/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.10",
              "loc": {
                "source": null,
                "start": {
                  "line": 5,
                  "column": 8
                },
                "end": {
                  "line": 7,
                  "column": 8
                }
              },
              "moduleName": "shopie/templates/application.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
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
              ["inline","outlet",["header-cover"],[],["loc",[null,[6,10],[6,35]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 4,
                "column": 4
              },
              "end": {
                "line": 8,
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
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [
            ["block","sh-nav-menu-front",[],["open",["subexpr","@mut",[["get","autoNavOpen",["loc",[null,[5,34],[5,45]]]]],[],[]],"toggleMaximise","toggleAutoNav","openAutoNav","openAutoNav","openModal","openModal","closeMobileMenu","closeMobileMenu"],0,null,["loc",[null,[5,8],[7,30]]]]
          ],
          locals: [],
          templates: [child0]
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 10,
                "column": 4
              },
              "end": {
                "line": 12,
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
            ["content","outlet",["loc",[null,[11,8],[11,18]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 19,
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
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","sh-viewport");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(element0,1,1);
          morphs[1] = dom.createMorphAt(element0,3,3);
          morphs[2] = dom.createMorphAt(element0,5,5);
          morphs[3] = dom.createMorphAt(element0,7,7);
          return morphs;
        },
        statements: [
          ["block","unless",[["get","isAdmin",["loc",[null,[4,14],[4,21]]]]],[],0,null,["loc",[null,[4,4],[8,15]]]],
          ["block","sh-main",[],["onMouseEnter","closeAutoNav"],1,null,["loc",[null,[10,4],[12,16]]]],
          ["content","sh-notifications",["loc",[null,[14,4],[14,24]]]],
          ["inline","outlet",["modal"],[],["loc",[null,[16,4],[16,22]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
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
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","sh-app",[],["showCart",["subexpr","@mut",[["get","showCart",["loc",[null,[1,19],[1,27]]]]],[],[]]],0,null,["loc",[null,[1,0],[19,11]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('shopie/templates/cart', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 30,
                "column": 20
              },
              "end": {
                "line": 32,
                "column": 20
              }
            },
            "moduleName": "shopie/templates/cart.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("img");
            dom.setAttribute(el1,"width","200");
            dom.setAttribute(el1,"height","200");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element0, 'src');
            return morphs;
          },
          statements: [
            ["attribute","src",["concat",[["get","item.product.thumbnail",["loc",[null,[31,34],[31,56]]]]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 32,
                "column": 20
              },
              "end": {
                "line": 34,
                "column": 20
              }
            },
            "moduleName": "shopie/templates/cart.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("img");
            dom.setAttribute(el1,"src","/static/images/placeholder.png");
            dom.setAttribute(el1,"width","200");
            dom.setAttribute(el1,"height","200");
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
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 14
            },
            "end": {
              "line": 46,
              "column": 14
            }
          },
          "moduleName": "shopie/templates/cart.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","product-remove");
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"type","button");
          dom.setAttribute(el3,"class","btn btn-link btn-sm tag-delete-button");
          var el4 = dom.createElement("i");
          dom.setAttribute(el4,"class","icon-trash");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"class","product-thumbnail");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("                  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"colspan","4");
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("Line Total:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
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
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [1, 1]);
          var morphs = new Array(7);
          morphs[0] = dom.createElementMorph(element2);
          morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
          morphs[2] = dom.createMorphAt(dom.childAt(element1, [5]),0,0);
          morphs[3] = dom.createMorphAt(dom.childAt(element1, [7]),0,0);
          morphs[4] = dom.createMorphAt(dom.childAt(element1, [9]),0,0);
          morphs[5] = dom.createMorphAt(dom.childAt(element1, [11]),0,0);
          morphs[6] = dom.createMorphAt(dom.childAt(fragment, [3, 5]),0,0);
          return morphs;
        },
        statements: [
          ["element","action",["openModal","remove-cart-item",["get","item",["loc",[null,[27,128],[27,132]]]]],[],["loc",[null,[27,88],[27,134]]]],
          ["block","if",[["get","item.product.thumbnail",["loc",[null,[30,26],[30,48]]]]],[],0,1,["loc",[null,[30,20],[34,27]]]],
          ["content","item.productName",["loc",[null,[36,22],[36,42]]]],
          ["content","item.productPrice",["loc",[null,[37,22],[37,43]]]],
          ["content","item.quantity",["loc",[null,[38,22],[38,39]]]],
          ["content","item.lineSubtotal",["loc",[null,[39,22],[39,43]]]],
          ["content","item.lineTotal",["loc",[null,[44,22],[44,40]]]]
        ],
        locals: ["item"],
        templates: [child0, child1]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 60,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/cart.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","page-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-list js-content-list large-12 columns");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("header");
        dom.setAttribute(el4,"class","view-header");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h2");
        dom.setAttribute(el5,"class","view-title");
        var el6 = dom.createTextNode("Cart");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("section");
        dom.setAttribute(el5,"class","view-actions");
        var el6 = dom.createTextNode("\n\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","view-container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("form");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("table");
        dom.setAttribute(el6,"class","cart-table large-12");
        dom.setAttribute(el6,"role","grid");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("thead");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("tr");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("th");
        dom.setAttribute(el9,"class","product-remove");
        var el10 = dom.createTextNode(" ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("th");
        dom.setAttribute(el9,"class","product-thumbnail");
        var el10 = dom.createTextNode(" ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("th");
        dom.setAttribute(el9,"class","product-name");
        var el10 = dom.createTextNode("Product name");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("th");
        dom.setAttribute(el9,"class","product-unit-price");
        var el10 = dom.createTextNode("Unit price");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("th");
        dom.setAttribute(el9,"class","product-quantity");
        var el10 = dom.createTextNode("Quantity");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("th");
        var el10 = dom.createTextNode("Total");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("tbody");
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("tfoot");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("td");
        dom.setAttribute(el8,"colspan","4");
        var el9 = dom.createTextNode(" ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("td");
        var el9 = dom.createTextNode("Cart Subtotal");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("td");
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [0, 1, 1, 3, 1, 1]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element3, [5, 5]),0,0);
        return morphs;
      },
      statements: [
        ["block","each",[["get","items",["loc",[null,[24,22],[24,27]]]]],[],0,null,["loc",[null,[24,14],[46,23]]]],
        ["content","model.totalPrice",["loc",[null,[51,18],[51,38]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('shopie/templates/components/sh-app', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/components/sh-app.hbs"
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
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/components/sh-btn-group-type', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/components/sh-btn-group-type.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","button-group");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2,"class","button primary radius");
        dom.setAttribute(el2,"href","#");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2,"class","button secondary radius");
        dom.setAttribute(el2,"href","#");
        var el3 = dom.createComment("");
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
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element0, 'data-grouptype');
        morphs[1] = dom.createElementMorph(element1);
        morphs[2] = dom.createMorphAt(element1,0,0);
        morphs[3] = dom.createElementMorph(element2);
        morphs[4] = dom.createMorphAt(element2,0,0);
        return morphs;
      },
      statements: [
        ["attribute","data-grouptype",["concat",[["get","dataGroupType",["loc",[null,[1,44],[1,57]]]]]]],
        ["element","action",["primaryAction"],[],["loc",[null,[2,5],[2,31]]]],
        ["content","primaryActionText",["loc",[null,[2,71],[2,92]]]],
        ["element","action",["secondaryAction"],[],["loc",[null,[3,5],[3,33]]]],
        ["content","secondaryActionText",["loc",[null,[3,75],[3,98]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/components/sh-cart-table', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 4
            },
            "end": {
              "line": 23,
              "column": 4
            }
          },
          "moduleName": "shopie/templates/components/sh-cart-table.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.setAttribute(el2,"colspan","2");
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("Line Total:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(5);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),0,0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]),0,0);
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [7]),0,0);
          morphs[4] = dom.createMorphAt(dom.childAt(fragment, [3, 5]),0,0);
          return morphs;
        },
        statements: [
          ["content","item.productName",["loc",[null,[13,12],[13,32]]]],
          ["content","item.productPrice",["loc",[null,[14,12],[14,33]]]],
          ["content","item.quantity",["loc",[null,[15,12],[15,29]]]],
          ["content","item.lineSubtotal",["loc",[null,[16,12],[16,33]]]],
          ["content","item.lineTotal",["loc",[null,[21,12],[21,30]]]]
        ],
        locals: ["item"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/components/sh-cart-table.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("table");
        dom.setAttribute(el1,"class","cart-table large-12");
        dom.setAttribute(el1,"role","grid");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Product name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Unit price");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Quantity");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode(" ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tfoot");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("td");
        dom.setAttribute(el3,"colspan","2");
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("td");
        var el4 = dom.createTextNode("Cart Subtotal");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("td");
        var el4 = dom.createComment("");
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
        var element1 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [5, 5]),0,0);
        return morphs;
      },
      statements: [
        ["block","each",[["get","items",["loc",[null,[11,12],[11,17]]]]],[],0,null,["loc",[null,[11,4],[23,13]]]],
        ["content","cart.totalPrice",["loc",[null,[28,8],[28,27]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('shopie/templates/components/sh-gravatar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
define('shopie/templates/components/sh-infinite-scroll-box', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/components/sh-infinite-scroll-box.hbs"
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
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/components/sh-infinite-scroll', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/components/sh-infinite-scroll.hbs"
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
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/components/sh-loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 13,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/components/sh-loading.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle1 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle2 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle3 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle4 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle5 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle6 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle7 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle8 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle9 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle10 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle11 sk-circle");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sk-circle12 sk-circle");
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
  }()));

});
define('shopie/templates/components/sh-modal-dialog', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 12
            },
            "end": {
              "line": 4,
              "column": 81
            }
          },
          "moduleName": "shopie/templates/components/sh-modal-dialog.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("header");
          dom.setAttribute(el1,"class","modal-header");
          var el2 = dom.createElement("h1");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 0]),0,0);
          return morphs;
        },
        statements: [
          ["content","title",["loc",[null,[4,58],[4,67]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 12
            },
            "end": {
              "line": 5,
              "column": 136
            }
          },
          "moduleName": "shopie/templates/components/sh-modal-dialog.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"class","close icon-x");
          dom.setAttribute(el1,"href","");
          dom.setAttribute(el1,"title","Close");
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","hidden");
          var el3 = dom.createTextNode("Close");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element3 = dom.childAt(fragment, [0]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element3);
          return morphs;
        },
        statements: [
          ["element","action",["closeModal"],[],["loc",[null,[5,75],[5,98]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 12
            },
            "end": {
              "line": 14,
              "column": 12
            }
          },
          "moduleName": "shopie/templates/components/sh-modal-dialog.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("footer");
          dom.setAttribute(el1,"class","modal-footer");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"type","button");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"type","button");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [2]);
          var element2 = dom.childAt(element0, [3]);
          var morphs = new Array(6);
          morphs[0] = dom.createAttrMorph(element1, 'class');
          morphs[1] = dom.createElementMorph(element1);
          morphs[2] = dom.createMorphAt(element1,0,0);
          morphs[3] = dom.createAttrMorph(element2, 'class');
          morphs[4] = dom.createElementMorph(element2);
          morphs[5] = dom.createMorphAt(element2,0,0);
          return morphs;
        },
        statements: [
          ["attribute","class",["concat",[["get","rejectButtonClass",["loc",[null,[12,47],[12,64]]]]," btn-minor js-button-reject"]]],
          ["element","action",["confirmReject"],[],["loc",[null,[12,95],[12,121]]]],
          ["content","confirm.reject.text",["loc",[null,[12,122],[12,145]]]],
          ["attribute","class",["concat",[["get","acceptButtonClass",["loc",[null,[12,185],[12,202]]]]," js-button-accept"]]],
          ["element","action",["confirmAccept"],[],["loc",[null,[12,223],[12,249]]]],
          ["content","confirm.accept.text",["loc",[null,[12,250],[12,273]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/components/sh-modal-dialog.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","modal-container js-modal-container");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("article");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("section");
        dom.setAttribute(el3,"class","modal-content");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("section");
        dom.setAttribute(el4,"class","modal-body");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("        ");
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
        dom.setAttribute(el1,"class","modal-background js-modal-background");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element5, [1]);
        var morphs = new Array(7);
        morphs[0] = dom.createElementMorph(element4);
        morphs[1] = dom.createAttrMorph(element5, 'class');
        morphs[2] = dom.createElementMorph(element6);
        morphs[3] = dom.createMorphAt(element6,1,1);
        morphs[4] = dom.createMorphAt(element6,3,3);
        morphs[5] = dom.createMorphAt(dom.childAt(element6, [5]),1,1);
        morphs[6] = dom.createMorphAt(element6,7,7);
        return morphs;
      },
      statements: [
        ["element","action",["closeModal"],[],["loc",[null,[1,48],[1,71]]]],
        ["attribute","class",["concat",[["get","klass",["loc",[null,[2,22],[2,27]]]]," js-modal"]]],
        ["element","action",["noBubble"],["bubbles",false,"preventDefault",false],["loc",[null,[3,39],[3,95]]]],
        ["block","if",[["get","title",["loc",[null,[4,18],[4,23]]]]],[],0,null,["loc",[null,[4,12],[4,88]]]],
        ["block","if",[["get","showClose",["loc",[null,[5,18],[5,27]]]]],[],1,null,["loc",[null,[5,12],[5,143]]]],
        ["content","yield",["loc",[null,[7,16],[7,25]]]],
        ["block","if",[["get","confirm",["loc",[null,[9,18],[9,25]]]]],[],2,null,["loc",[null,[9,12],[14,19]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('shopie/templates/components/sh-nav-menu-front', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
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
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 18
            },
            "end": {
              "line": 11,
              "column": 42
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
          "revision": "Ember@1.13.10",
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
          "revision": "Ember@1.13.10",
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
    var child4 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 26,
              "column": 20
            },
            "end": {
              "line": 26,
              "column": 44
            }
          },
          "moduleName": "shopie/templates/components/sh-nav-menu-front.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode(" Shop");
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
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 32,
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
        var el6 = dom.createComment("");
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
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element2, [1]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1, 1, 1]),0,0);
        morphs[1] = dom.createMorphAt(dom.childAt(element3, [1]),0,0);
        morphs[2] = dom.createMorphAt(element3,3,3);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [3, 1]),0,0);
        morphs[4] = dom.createMorphAt(element0,3,3);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],[],0,null,["loc",[null,[5,12],[5,52]]]],
        ["block","link-to",["cart"],[],1,null,["loc",[null,[11,18],[11,54]]]],
        ["block","if",[["get","session.isAuthenticated",["loc",[null,[12,20],[12,43]]]]],[],2,3,["loc",[null,[12,14],[23,21]]]],
        ["block","link-to",["shop"],[],4,null,["loc",[null,[26,20],[26,56]]]],
        ["content","yield",["loc",[null,[30,2],[30,11]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  }()));

});
define('shopie/templates/components/sh-notification', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/components/sh-notification.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","sh-notification-content");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("button");
        dom.setAttribute(el1,"class","sh-notification-close icon-x");
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","hidden");
        var el3 = dom.createTextNode("Close");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        morphs[1] = dom.createElementMorph(element0);
        return morphs;
      },
      statements: [
        ["content","message.message",["loc",[null,[2,4],[2,23]]]],
        ["element","action",["closeNotification"],[],["loc",[null,[4,45],[4,75]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/components/sh-notifications', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "shopie/templates/components/sh-notifications.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
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
          ["inline","sh-notification",[],["message",["subexpr","@mut",[["get","message",["loc",[null,[2,30],[2,37]]]]],[],[]]],["loc",[null,[2,4],[2,39]]]]
        ],
        locals: ["message"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/components/sh-notifications.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","each",[["get","messages",["loc",[null,[1,8],[1,16]]]]],[],0,null,["loc",[null,[1,0],[3,9]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('shopie/templates/components/sh-product-add-to-cart', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/components/sh-product-add-to-cart.hbs"
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
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/components/sh-product-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 2
              },
              "end": {
                "line": 5,
                "column": 2
              }
            },
            "moduleName": "shopie/templates/components/sh-product-item.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("img");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element0, 'src');
            return morphs;
          },
          statements: [
            ["attribute","src",["concat",[["get","product.thumbnail",["loc",[null,[4,15],[4,32]]]]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 2
              },
              "end": {
                "line": 7,
                "column": 2
              }
            },
            "moduleName": "shopie/templates/components/sh-product-item.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("img");
            dom.setAttribute(el1,"src","/static/images/placeholder.png");
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
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 1
            },
            "end": {
              "line": 8,
              "column": 1
            }
          },
          "moduleName": "shopie/templates/components/sh-product-item.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","if",[["get","product.thumbnail",["loc",[null,[3,8],[3,25]]]]],[],0,1,["loc",[null,[3,2],[7,9]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 12
            },
            "end": {
              "line": 10,
              "column": 70
            }
          },
          "moduleName": "shopie/templates/components/sh-product-item.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode(" ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["content","product.name",["loc",[null,[10,54],[10,70]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 24,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/components/sh-product-item.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","top");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","name column-name");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","action-links");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","action-buttons");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","button secondary round extra-small");
        var el6 = dom.createTextNode("view");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","desc");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
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
        dom.setAttribute(el1,"class","bottom");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","price");
        var el3 = dom.createComment("");
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
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [5, 1, 1, 0]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(element1,1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3, 1]),0,0);
        morphs[2] = dom.createElementMorph(element2);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [7]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(fragment, [2, 1]),0,0);
        return morphs;
      },
      statements: [
        ["block","link-to",["product",["get","product.formatSlug",["loc",[null,[2,22],[2,40]]]]],["class","icon"],0,null,["loc",[null,[2,1],[8,13]]]],
        ["block","link-to",["product",["get","product.formatSlug",["loc",[null,[10,33],[10,51]]]]],[],1,null,["loc",[null,[10,12],[10,82]]]],
        ["element","action",["view",["get","product",["loc",[null,[14,40],[14,47]]]]],[],["loc",[null,[14,24],[14,49]]]],
        ["content","product.shortDescription",["loc",[null,[18,8],[18,36]]]],
        ["content","product.unitPrice",["loc",[null,[22,23],[22,44]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('shopie/templates/components/sh-trim-focus-input', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/components/sh-trim-focus-input.hbs"
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
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/cover/home', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/cover/home.hbs"
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
        dom.setAttribute(el4,"class","light white-text header-text");
        dom.setAttribute(el4,"style","margin-top:132px;");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h1");
        dom.setAttribute(el5,"class","text-center");
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
        dom.setAttribute(el7,"class","white-text lead");
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
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var morphs = new Array(1);
        morphs[0] = dom.createAttrMorph(element0, 'style');
        return morphs;
      },
      statements: [
        ["attribute","style",["concat",["background: url(",["get","imageCover",["loc",[null,[2,67],[2,77]]]],") no-repeat center fixed; -webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;background-attachment: scroll;"]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
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
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('shopie/templates/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/loading.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","page-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
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
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]),1,1);
        return morphs;
      },
      statements: [
        ["content","sh-loading",["loc",[null,[3,4],[3,18]]]]
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
        "revision": "Ember@1.13.10",
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
define('shopie/templates/modals/quick-view', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 0
            }
          },
          "moduleName": "shopie/templates/modals/quick-view.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
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
          ["content","model.shortDescription",["loc",[null,[3,2],[3,28]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/modals/quick-view.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","sh-modal-dialog",[],["action","closeModal","showClose",true,"style","wide","title",["subexpr","@mut",[["get","model.name",["loc",[null,[2,10],[2,20]]]]],[],[]]],0,null,["loc",[null,[1,0],[4,20]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('shopie/templates/modals/remove-cart-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 0
            }
          },
          "moduleName": "shopie/templates/modals/remove-cart-item.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Kamu akan menghapus ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" dari keranjang belanja Anda. Jika kamu ingin memasukkannya lagi, Anda harus mencarinya lagi.");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["content","model.name",["loc",[null,[3,27],[3,41]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "moduleName": "shopie/templates/modals/remove-cart-item.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","sh-modal-dialog",[],["action","closeModal","confirmAccept",["subexpr","action",["confirmAccept"],[],["loc",[null,[1,53],[1,77]]]],"confirmReject",["subexpr","action",["confirmReject"],[],["loc",[null,[1,92],[1,116]]]],"showClose",true,"type","action","style","wide","title","Are you sure you want to remove this product from your cart?","confirm",["subexpr","@mut",[["get","confirm",["loc",[null,[2,81],[2,88]]]]],[],[]]],0,null,["loc",[null,[1,0],[4,20]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('shopie/templates/product', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 13
            },
            "end": {
              "line": 19,
              "column": 10
            }
          },
          "moduleName": "shopie/templates/product.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","octicon octicon-issue-opened");
          var el2 = dom.createTextNode(" issues");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
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
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 38,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/product.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","product-wrap");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","product-intro");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","title center");
        var el5 = dom.createElement("h1");
        dom.setAttribute(el5,"class","entry title");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","large-8 columns large-centered text-center");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","sub-intro");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","product-cta noise");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","wrap");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","row");
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","large-6 small-12 columns center-column");
        var el6 = dom.createTextNode("\n      ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6,"class","action-lists");
        var el7 = dom.createTextNode("\n        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        dom.setAttribute(el7,"class","title");
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Support: ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n        ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("li");
        var el8 = dom.createTextNode("\n          ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createElement("a");
        dom.setAttribute(el9,"href","/wiki/");
        var el10 = dom.createElement("span");
        dom.setAttribute(el10,"class","octicon octicon-book");
        var el11 = dom.createTextNode(" documentation");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n        ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n      ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n      ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","product-about-text");
        dom.setAttribute(el2,"class","product-about");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","large-9 small-12 columns center-column");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","entry_content");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
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
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 1]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1, 0]),0,0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3, 1]),0,0);
        morphs[2] = dom.createMorphAt(element1,5,5);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [3, 0, 1, 1, 1, 3, 1]),0,0);
        morphs[4] = dom.createMorphAt(dom.childAt(element0, [5, 1, 1, 1]),1,1);
        return morphs;
      },
      statements: [
        ["content","model.name",["loc",[null,[4,56],[4,70]]]],
        ["inline","sh-format-markdown",[["get","model.shortDescription",["loc",[null,[6,52],[6,74]]]]],[],["loc",[null,[6,31],[6,76]]]],
        ["inline","sh-btn-group-type",[],["dataGroupType","atau","primaryAction","purchase","primaryActionText","Beli sekarang","secondaryAction","read","secondaryActionText","Pelajari dulu"],["loc",[null,[8,6],[8,166]]]],
        ["block","link-to",["issues",["get","model.formatSlug",["loc",[null,[17,33],[17,49]]]]],[],0,null,["loc",[null,[17,13],[19,22]]]],
        ["inline","sh-format-markdown",[["get","model.description",["loc",[null,[32,31],[32,48]]]]],[],["loc",[null,[32,10],[32,50]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('shopie/templates/shop', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 10
            },
            "end": {
              "line": 7,
              "column": 81
            }
          },
          "moduleName": "shopie/templates/shop.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Keranjang belanja");
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
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.10",
            "loc": {
              "source": null,
              "start": {
                "line": 12,
                "column": 10
              },
              "end": {
                "line": 14,
                "column": 10
              }
            },
            "moduleName": "shopie/templates/shop.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
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
            ["inline","sh-product-item",[],["product",["subexpr","@mut",[["get","product",["loc",[null,[13,38],[13,45]]]]],[],[]],"view","openQuickView"],["loc",[null,[13,12],[13,68]]]]
          ],
          locals: ["product"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.10",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 6
            },
            "end": {
              "line": 16,
              "column": 6
            }
          },
          "moduleName": "shopie/templates/shop.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("ul");
          dom.setAttribute(el1,"class","products js-products");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["block","each",[["get","model",["loc",[null,[12,18],[12,23]]]]],[],0,null,["loc",[null,[12,10],[14,19]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/shop.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","page-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","content-list js-content-list large-12 columns");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("header");
        dom.setAttribute(el4,"class","view-header");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h2");
        dom.setAttribute(el5,"class","view-title");
        var el6 = dom.createTextNode("Shop");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("section");
        dom.setAttribute(el5,"class","view-actions");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
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
        var element0 = dom.childAt(fragment, [0, 1, 1]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 3]),1,1);
        morphs[1] = dom.createMorphAt(element0,3,3);
        return morphs;
      },
      statements: [
        ["block","link-to",["cart"],["class","btn btn-green","title","Cart"],0,null,["loc",[null,[7,10],[7,93]]]],
        ["block","sh-infinite-scroll-box",[],["tagName","section","classNames","content-list-content js-content-scrollbox","fetch","loadNextPage"],1,null,["loc",[null,[10,6],[16,33]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('shopie/templates/users/edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
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
        "revision": "Ember@1.13.10",
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
        "revision": "Ember@1.13.10",
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
define('shopie/tests/adapters/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('shopie/tests/adapters/base.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/base.js should pass jshint', function(assert) { 
    assert.ok(true, 'adapters/base.js should pass jshint.'); 
  });

});
define('shopie/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('shopie/tests/authenticators/shopie-oauth2.jshint', function () {

  'use strict';

  QUnit.module('JSHint - authenticators');
  QUnit.test('authenticators/shopie-oauth2.js should pass jshint', function(assert) { 
    assert.ok(true, 'authenticators/shopie-oauth2.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-app.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-app.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-btn-group-type.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-btn-group-type.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-btn-group-type.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-cart-table.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-cart-table.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-cart-table.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-gravatar.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-gravatar.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-gravatar.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-infinite-scroll-box.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-infinite-scroll-box.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-infinite-scroll-box.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-infinite-scroll.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-infinite-scroll.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-infinite-scroll.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-input.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-input.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-input.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-loading.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-loading.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-loading.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-main.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-main.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-main.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-modal-dialog.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-modal-dialog.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-modal-dialog.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-nav-menu-front.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-nav-menu-front.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-nav-menu-front.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-notification.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-notification.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-notification.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-notifications.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-notifications.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-notifications.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-product-add-to-cart.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-product-add-to-cart.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-product-add-to-cart.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-product-item.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-product-item.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-product-item.js should pass jshint.'); 
  });

});
define('shopie/tests/components/sh-trim-focus-input.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/sh-trim-focus-input.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/sh-trim-focus-input.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/cart.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/cart.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/cart.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/login.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/login.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/login.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/modals/quick-view.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/modals');
  QUnit.test('controllers/modals/quick-view.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/modals/quick-view.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/modals/remove-cart-item.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/modals');
  QUnit.test('controllers/modals/remove-cart-item.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/modals/remove-cart-item.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/product.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/product.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/product.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/shop.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/shop.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/shop.js should pass jshint.'); 
  });

});
define('shopie/tests/controllers/users/edit.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers/users');
  QUnit.test('controllers/users/edit.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/users/edit.js should pass jshint.'); 
  });

});
define('shopie/tests/helpers/cycle-it.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/cycle-it.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/cycle-it.js should pass jshint.'); 
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
define('shopie/tests/helpers/sh-format-markdown.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/sh-format-markdown.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/sh-format-markdown.js should pass jshint.'); 
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
define('shopie/tests/initializers/shopie-authenticator.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/shopie-authenticator.js should pass jshint', function(assert) { 
    assert.ok(true, 'initializers/shopie-authenticator.js should pass jshint.'); 
  });

});
define('shopie/tests/initializers/simple-auth-env.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/simple-auth-env.js should pass jshint', function(assert) { 
    assert.ok(true, 'initializers/simple-auth-env.js should pass jshint.'); 
  });

});
define('shopie/tests/integration/components/sh-app-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('sh-app', 'Integration | Component | sh app', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 10
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'sh-app', ['loc', [null, [1, 0], [1, 10]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'sh-app', [], [], 0, null, ['loc', [null, [2, 4], [4, 15]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('shopie/tests/integration/components/sh-app-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/sh-app-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/sh-app-test.js should pass jshint.'); 
  });

});
define('shopie/tests/integration/components/sh-btn-group-type-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('sh-btn-group-type', 'Integration | Component | sh btn group type', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 21
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'sh-btn-group-type', ['loc', [null, [1, 0], [1, 21]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'sh-btn-group-type', [], [], 0, null, ['loc', [null, [2, 4], [4, 26]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('shopie/tests/integration/components/sh-btn-group-type-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/sh-btn-group-type-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/sh-btn-group-type-test.js should pass jshint.'); 
  });

});
define('shopie/tests/integration/components/sh-infinite-scroll-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('sh-infinite-scroll', 'Integration | Component | sh infinite scroll', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 22
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'sh-infinite-scroll', ['loc', [null, [1, 0], [1, 22]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'sh-infinite-scroll', [], [], 0, null, ['loc', [null, [2, 4], [4, 27]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('shopie/tests/integration/components/sh-infinite-scroll-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/sh-infinite-scroll-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/sh-infinite-scroll-test.js should pass jshint.'); 
  });

});
define('shopie/tests/integration/components/sh-modal-dialog-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('sh-modal-dialog', 'Integration | Component | sh modal dialog', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 19
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'sh-modal-dialog', ['loc', [null, [1, 0], [1, 19]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'sh-modal-dialog', [], [], 0, null, ['loc', [null, [2, 4], [4, 24]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('shopie/tests/integration/components/sh-modal-dialog-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/sh-modal-dialog-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/sh-modal-dialog-test.js should pass jshint.'); 
  });

});
define('shopie/tests/integration/components/sh-product-add-to-cart-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('sh-product-add-to-cart', 'Integration | Component | sh product add to cart', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 26
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'sh-product-add-to-cart', ['loc', [null, [1, 0], [1, 26]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'sh-product-add-to-cart', [], [], 0, null, ['loc', [null, [2, 4], [4, 31]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('shopie/tests/integration/components/sh-product-add-to-cart-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/sh-product-add-to-cart-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/sh-product-add-to-cart-test.js should pass jshint.'); 
  });

});
define('shopie/tests/integration/components/sh-product-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('sh-product-item', 'Integration | Component | sh product item', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 16
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'product-item', ['loc', [null, [1, 0], [1, 16]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'product-item', [], [], 0, null, ['loc', [null, [2, 4], [4, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('shopie/tests/integration/components/sh-product-item-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/sh-product-item-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/sh-product-item-test.js should pass jshint.'); 
  });

});
define('shopie/tests/integration/components/sh-trim-focus-input-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('sh-trim-focus-input', 'Integration | Component | sh trim focus input', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 23
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'sh-trim-focus-input', ['loc', [null, [1, 0], [1, 23]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.10',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.10',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'sh-trim-focus-input', [], [], 0, null, ['loc', [null, [2, 4], [4, 28]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('shopie/tests/integration/components/sh-trim-focus-input-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/sh-trim-focus-input-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/sh-trim-focus-input-test.js should pass jshint.'); 
  });

});
define('shopie/tests/libs/stale-result.jshint', function () {

  'use strict';

  QUnit.module('JSHint - libs');
  QUnit.test('libs/stale-result.js should pass jshint', function(assert) { 
    assert.ok(true, 'libs/stale-result.js should pass jshint.'); 
  });

});
define('shopie/tests/libs/validators/base.jshint', function () {

  'use strict';

  QUnit.module('JSHint - libs/validators');
  QUnit.test('libs/validators/base.js should pass jshint', function(assert) { 
    assert.ok(true, 'libs/validators/base.js should pass jshint.'); 
  });

});
define('shopie/tests/libs/validators/login.jshint', function () {

  'use strict';

  QUnit.module('JSHint - libs/validators');
  QUnit.test('libs/validators/login.js should pass jshint', function(assert) { 
    assert.ok(true, 'libs/validators/login.js should pass jshint.'); 
  });

});
define('shopie/tests/libs/validators/new-user.jshint', function () {

  'use strict';

  QUnit.module('JSHint - libs/validators');
  QUnit.test('libs/validators/new-user.js should pass jshint', function(assert) { 
    assert.ok(true, 'libs/validators/new-user.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/body-event-listener.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/body-event-listener.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/body-event-listener.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/infinite-scroll.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/infinite-scroll.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/infinite-scroll.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/pagination-route.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/pagination-route.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/pagination-route.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/shortcuts-route.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/shortcuts-route.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/shortcuts-route.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/slug-route.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/slug-route.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/slug-route.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/style-body.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/style-body.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/style-body.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/text-input.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/text-input.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/text-input.js should pass jshint.'); 
  });

});
define('shopie/tests/mixins/validation-engine.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins');
  QUnit.test('mixins/validation-engine.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/validation-engine.js should pass jshint.'); 
  });

});
define('shopie/tests/models/cart-item.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/cart-item.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/cart-item.js should pass jshint.'); 
  });

});
define('shopie/tests/models/cart.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/cart.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/cart.js should pass jshint.'); 
  });

});
define('shopie/tests/models/product.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/product.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/product.js should pass jshint.'); 
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
define('shopie/tests/routes/cart.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/cart.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/cart.js should pass jshint.'); 
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
define('shopie/tests/routes/product.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/product.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/product.js should pass jshint.'); 
  });

});
define('shopie/tests/routes/shop.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/shop.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/shop.js should pass jshint.'); 
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
define('shopie/tests/services/notifications.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/notifications.js should pass jshint', function(assert) { 
    assert.ok(true, 'services/notifications.js should pass jshint.'); 
  });

});
define('shopie/tests/services/shopie-paths.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/shopie-paths.js should pass jshint', function(assert) { 
    assert.ok(true, 'services/shopie-paths.js should pass jshint.'); 
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
define('shopie/tests/unit/adapters/base-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:base', 'Unit | Adapter | base', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

});
define('shopie/tests/unit/adapters/base-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/adapters');
  QUnit.test('unit/adapters/base-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/adapters/base-test.js should pass jshint.'); 
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
define('shopie/tests/unit/helpers/cycle-it-test', ['shopie/helpers/cycle-it', 'qunit'], function (cycle_it, qunit) {

  'use strict';

  qunit.module('Unit | Helper | cycle it');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = cycle_it.cycleIt(42);
    assert.ok(result);
  });

});
define('shopie/tests/unit/helpers/cycle-it-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/helpers');
  QUnit.test('unit/helpers/cycle-it-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/helpers/cycle-it-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/helpers/sh-format-markdown-test', ['shopie/helpers/sh-format-markdown', 'qunit'], function (sh_format_markdown, qunit) {

  'use strict';

  qunit.module('Unit | Helper | sh format markdown');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = sh_format_markdown.shFormatMarkdown(42);
    assert.ok(result);
  });

});
define('shopie/tests/unit/helpers/sh-format-markdown-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/helpers');
  QUnit.test('unit/helpers/sh-format-markdown-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/helpers/sh-format-markdown-test.js should pass jshint.'); 
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
define('shopie/tests/unit/mixins/slug-route-test', ['ember', 'shopie/mixins/slug-route', 'qunit'], function (Ember, SlugRouteMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | slug route');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var SlugRouteObject = Ember['default'].Object.extend(SlugRouteMixin['default']);
    var subject = SlugRouteObject.create();
    assert.ok(subject);
  });

});
define('shopie/tests/unit/mixins/slug-route-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/mixins');
  QUnit.test('unit/mixins/slug-route-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/mixins/slug-route-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/models/cart-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('cart-item', 'Unit | Model | cart item', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('shopie/tests/unit/models/cart-item-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/cart-item-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/models/cart-item-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/models/cart-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('cart', 'Unit | Model | cart', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('shopie/tests/unit/models/cart-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/cart-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/models/cart-test.js should pass jshint.'); 
  });

});
define('shopie/tests/unit/models/product-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('product', 'Unit | Model | product', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('shopie/tests/unit/models/product-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/product-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/models/product-test.js should pass jshint.'); 
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
define('shopie/tests/unit/routes/cart-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:cart', 'Unit | Route | cart', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('shopie/tests/unit/routes/cart-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/cart-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/cart-test.js should pass jshint.'); 
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
define('shopie/tests/unit/routes/shop-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:shop', 'Unit | Route | shop', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('shopie/tests/unit/routes/shop-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/shop-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/shop-test.js should pass jshint.'); 
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
define('shopie/tests/utils/ajax.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/ajax.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/ajax.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/caja-sanitizers.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/caja-sanitizers.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/caja-sanitizers.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/ctrl-or-cmd.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/ctrl-or-cmd.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/ctrl-or-cmd.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/cycle-generator.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/cycle-generator.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/cycle-generator.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/document-title.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/document-title.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/document-title.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/get-cookie.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/get-cookie.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/get-cookie.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/set-scroll-classname.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/set-scroll-classname.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/set-scroll-classname.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/shopie-paths.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/shopie-paths.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/shopie-paths.js should pass jshint.'); 
  });

});
define('shopie/tests/utils/validation-extensions.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/validation-extensions.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/validation-extensions.js should pass jshint.'); 
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
define('shopie/utils/ajax', ['exports', 'ember'], function (exports, Ember) {

    'use strict';


    exports['default'] = getRequestErrorMessage;
    function getRequestErrorMessage(request, performConcat) {
        var message, msgDetail;

        // Can't really continue without a request
        if (!request) {
            return null;
        }

        // Seems like a sensible default
        message = request.statusText;

        // If a non 200 response
        if (request.status !== 200) {
            try {
                // Try to parse out the error, or default to 'Unknown'
                if (request.responseJSON.errors && Ember['default'].isArray(request.responseJSON.errors)) {
                    message = request.responseJSON.errors.map(function (errorItem) {
                        return errorItem.message;
                    });
                } else {
                    message = request.responseJSON.error || 'Unknown Error';
                }
            } catch (e) {
                msgDetail = request.status ? request.status + ' - ' + request.statusText : 'Server was not available';
                message = 'The server returned an error (' + msgDetail + ').';
            }
        }

        if (performConcat && Ember['default'].isArray(message)) {
            message = message.join('<br />');
        }

        // return an array of errors by default
        if (!performConcat && typeof message === 'string') {
            message = [message];
        }

        return message;
    }

});
define('shopie/utils/caja-sanitizers', ['exports'], function (exports) {

    'use strict';

    /**
     * google-caja uses url() and id() to verify if the values are allowed.
     */
    var url, id;

    /**
     * Check if URL is allowed
     * URLs are allowed if they start with http://, https://, or /.
     */
    url = function (url) {
        url = url.toString().replace(/['"]+/g, '');
        if (/^https?:\/\//.test(url) || /^\//.test(url)) {
            return url;
        }
    };

    /**
     * Check if ID is allowed
     * All ids are allowed at the moment.
     */
    id = function (id) {
        return id;
    };

    exports['default'] = {
        url: url,
        id: id
    };

});
define('shopie/utils/ctrl-or-cmd', ['exports'], function (exports) {

	'use strict';

	var ctrlOrCmd = navigator.userAgent.indexOf('Mac') !== -1 ? 'command' : 'ctrl';

	exports['default'] = ctrlOrCmd;

});
define('shopie/utils/cycle-generator', ['exports'], function (exports) {

    'use strict';

    var cycleGenerator = regeneratorRuntime.mark(function cycleGenerator(iterable) {
        var saved, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2;

        return regeneratorRuntime.wrap(function cycleGenerator$(context$1$0) {
            while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                    saved = [];
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    context$1$0.prev = 4;
                    _iterator = iterable[Symbol.iterator]();

                case 6:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        context$1$0.next = 14;
                        break;
                    }

                    item = _step.value;
                    context$1$0.next = 10;
                    return item;

                case 10:
                    saved.push(item);

                case 11:
                    _iteratorNormalCompletion = true;
                    context$1$0.next = 6;
                    break;

                case 14:
                    context$1$0.next = 20;
                    break;

                case 16:
                    context$1$0.prev = 16;
                    context$1$0.t0 = context$1$0["catch"](4);
                    _didIteratorError = true;
                    _iteratorError = context$1$0.t0;

                case 20:
                    context$1$0.prev = 20;
                    context$1$0.prev = 21;

                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }

                case 23:
                    context$1$0.prev = 23;

                    if (!_didIteratorError) {
                        context$1$0.next = 26;
                        break;
                    }

                    throw _iteratorError;

                case 26:
                    return context$1$0.finish(23);

                case 27:
                    return context$1$0.finish(20);

                case 28:
                    if (!(saved.length > 0)) {
                        context$1$0.next = 57;
                        break;
                    }

                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    context$1$0.prev = 32;
                    _iterator2 = saved[Symbol.iterator]();

                case 34:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                        context$1$0.next = 41;
                        break;
                    }

                    item = _step2.value;
                    context$1$0.next = 38;
                    return item;

                case 38:
                    _iteratorNormalCompletion2 = true;
                    context$1$0.next = 34;
                    break;

                case 41:
                    context$1$0.next = 47;
                    break;

                case 43:
                    context$1$0.prev = 43;
                    context$1$0.t1 = context$1$0["catch"](32);
                    _didIteratorError2 = true;
                    _iteratorError2 = context$1$0.t1;

                case 47:
                    context$1$0.prev = 47;
                    context$1$0.prev = 48;

                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }

                case 50:
                    context$1$0.prev = 50;

                    if (!_didIteratorError2) {
                        context$1$0.next = 53;
                        break;
                    }

                    throw _iteratorError2;

                case 53:
                    return context$1$0.finish(50);

                case 54:
                    return context$1$0.finish(47);

                case 55:
                    context$1$0.next = 28;
                    break;

                case 57:
                case "end":
                    return context$1$0.stop();
            }
        }, cycleGenerator, this, [[4, 16, 20, 28], [21,, 23, 27], [32, 43, 47, 55], [48,, 50, 54]]);
    });

    exports['default'] = cycleGenerator;

});
define('shopie/utils/document-title', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var documentTitle = function documentTitle() {
        Ember['default'].Route.reopen({
            // `titleToken` can either be a static string or a function
            // that accepts a model object and returns a string (or array
            // of strings if there are multiple tokens).
            titleToken: null,

            // `title` can either be a static string or a function
            // that accepts an array of tokens and returns a string
            // that will be the document title. The `collectTitleTokens` action
            // stops bubbling once a route is encountered that has a `title`
            // defined.
            title: null,

            _actions: {
                collectTitleTokens: function collectTitleTokens(tokens) {
                    var titleToken = this.titleToken,
                        finalTitle;

                    if (typeof this.titleToken === 'function') {
                        titleToken = this.titleToken(this.currentModel);
                    }

                    if (Ember['default'].isArray(titleToken)) {
                        tokens.unshift.apply(this, titleToken);
                    } else if (titleToken) {
                        tokens.unshift(titleToken);
                    }

                    if (this.title) {
                        if (typeof this.title === 'function') {
                            finalTitle = this.title(tokens);
                        } else {
                            finalTitle = this.title;
                        }

                        this.router.setTitle(finalTitle);
                    } else {
                        return true;
                    }
                }
            }
        });

        Ember['default'].Router.reopen({
            updateTitle: (function () {
                this.send('collectTitleTokens', []);
            }).on('didTransition'),

            setTitle: function setTitle(title) {
                if (Ember['default'].testing) {
                    this._title = title;
                } else {
                    window.document.title = title;
                }
            }
        });
    };

    exports['default'] = documentTitle;

});
define('shopie/utils/get-cookie', ['exports'], function (exports) {

    'use strict';

    /* global $ */
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = cookies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cookie = _step.value;

                    cookie = $.trim(cookie);
                    if (cookie.substring(0, name.length + 1) === name + '=') {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        return cookieValue;
    }

    exports['default'] = getCookie;

});
define('shopie/utils/set-scroll-classname', ['exports'], function (exports) {

    'use strict';

    // ## scrollShadow
    // This adds a 'scroll' class to the targeted element when the element is scrolled
    // `this` is expected to be a jQuery-wrapped element
    // **target:** The element in which the class is applied. Defaults to scrolled element.
    // **class-name:** The class which is applied.
    // **offset:** How far the user has to scroll before the class is applied.
    var setScrollClassName = function setScrollClassName(options) {
        var $target = options.target || this,
            offset = options.offset,
            className = options.className || 'scrolling';

        if (this.scrollTop() > offset) {
            $target.addClass(className);
        } else {
            $target.removeClass(className);
        }
    };

    exports['default'] = setScrollClassName;

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
            adminRoot: adminRoot,
            apiRoot: apiRoot,
            url: {
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
            }
        };
    };

    exports['default'] = shopiePaths;

});
define('shopie/utils/validation-extensions', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    function init() {
        // Provide a few custom validators
        //
        validator.extend('empty', function (str) {
            return Ember['default'].isBlank(str);
        });

        validator.extend('notContains', function (str, badString) {
            return str.indexOf(badString) === -1;
        });
    }

    exports['default'] = {
        init: init
    };

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
  require("shopie/app")["default"].create({"API_HOST":null,"API_NAMESPACE":"api/v1","name":"shopie","version":"0.0.0+8bb31f85"});
}

/* jshint ignore:end */
//# sourceMappingURL=shopie.map