import Ember from 'ember';

export default Ember.Mixin.create({

    // set from PaginationRouteMixin
    paginationSettings: null,

    // indicates whether we're currently loading the next page
    isLoading: null,

    /**
     * Takes an ajax response, concatenates any error messages, then generates an error notification.
     * @param {jqXHR} response The jQuery ajax reponse object.
     * @return
     */
    reportLoadError: function (response) {
        alert(response);
    },

    actions: {
        /**
         * Loads the next paginated page of posts into the ember-data store. Will cause the posts list UI to update.
         * @return
         */
        loadNextPage: function () {
            var self = this,
                store = this.get('store'),
                recordType = this.get('model').get('type'),
                metadata = this.store.metadataFor(recordType),
                nextPage = metadata.pagination && metadata.pagination.next,
                paginationSettings = this.get('paginationSettings');

            if (nextPage) {
                this.set('isLoading', true);
                this.set('paginationSettings.page', nextPage);

                store.find(recordType, paginationSettings).then(function () {
                    self.set('isLoading', false);
                }, function (response) {
                    self.reportLoadError(response);
                });
            }
        },

        resetPagination: function () {
            this.set('paginationSettings.page', 1);
        }
    }
});
