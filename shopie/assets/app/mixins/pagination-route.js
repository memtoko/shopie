import Ember from 'ember';

let defaultPaginationSettings = {
    page: 1,
    limit: 15
};

export default Ember.Mixin.create({
    notifications: Ember.inject.service(),

    paginationModel: null,
    paginationSettings: null,
    paginationMeta: null,

    init: function () {
        let paginationSettings = this.get('paginationSettings'),
            settings = Ember.$.extend({}, defaultPaginationSettings, paginationSettings);

        this._super(...arguments);
        this.set('paginationSettings', settings);
        this.set('paginationMeta', {});
    },

    reportLoadError: function (response) {
        var message = 'A problem was encountered while loading more records';

        this.get('notifications').showAlert(message, {type: 'error', key: 'pagination.load.failed'});
    },

    loadFirstPage: function () {
        let paginationSettings = this.get('paginationSettings'),
            modelName = this.get('paginationModel');

        paginationSettings.page = 1;

        return this.get('store').query(modelName, paginationSettings).then((results) => {
            this.set('paginationMeta', results.meta);
            return results;
        }, (response) => {
            this.reportLoadError(response);
        });
    },

    actions: {
        loadFirstPage: function() {
            return this.loadFirstPage();
        },

        /**
         * Loads the next paginated page of posts into the ember-data store. Will cause the posts list UI to update.
         * @return
         */
        loadNextPage: function () {
            let store = this.get('store'),
                modelName = this.get('paginationModel'),
                metadata = this.get('paginationMeta'),
                paginationSettings = this.get('paginationSettings');

            // our pagination
            const available = metadata.pagination && metadata.pagination.pages > metadata.pagination.page;

            if (available) {
                this.set('isLoading', true);
                this.set('paginationSettings.page', metadata.pagination.page + 1);

                store.query(modelName, paginationSettings).then((results) => {
                    this.set('isLoading', false);
                    this.set('paginationMeta', results.meta);
                    return results;
                }, (response) => {
                    this.reportLoadError(response);
                });
            }
        },

        resetPagination: function () {
            this.set('paginationSettings.page', 1);
        }
    }
});
