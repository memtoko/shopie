import Ember from 'ember';

export default Ember.Mixin.create({

    // set from PaginationRouteMixin
    paginationSettings: null,

    // indicates whether we're currently loading the next page
    isLoading: null,

    currentMeta: null,

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
            let metadata   = this.get('currentMeta'),
                page  = metadata.pagination.page || 1,
                pages = metadata.pagination.pages || 1,
                type = this.get('model').get('type'),
                nextPage = page + 1;

            if (pages > page) {
                this.set('isLoading', true);
                let settings = Ember.$.extend({}, this.get('paginationSettings'), {page: nextPage});
                this.set('paginationSettings.page', nextPage);
                this.store.query(type, settings).then((result) => {
                    let metadata = result.get('meta');
                    this.set('currentMeta', metadata);
                    this.set('isLoading', false);
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
