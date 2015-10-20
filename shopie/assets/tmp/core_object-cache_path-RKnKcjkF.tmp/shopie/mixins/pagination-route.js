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