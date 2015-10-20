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