import Ember from 'ember';

let defaultPaginationSettings = {
  page: 1
};

export default Ember.Mixin.create({
  notifications: Ember.inject.service(),

  // Initialize this variable, prevent ember set it to content
  paginationModel: null,
  paginationSettings: null,
  paginationMeta: null,

  init() {
    let paginationSettings = this.get('paginationSettings');
    let settings = Ember.$.extend({}, defaultPaginationSettings, paginationSettings);

    this._super(...arguments);
    this.set('paginationSettings', settings);
    this.set('paginationMeta', {});
  },

  reportLoadError() {
    let message = 'A problem was encountered while loading more records';
    this.get('notifications').showAlert(message, {
      type: 'error',
      key: 'pagination.load.failed'
    });
  },

  loadFirstPage() {
    var paginationSettings  = this.get('paginationSettings'),
      modelName = this.get('paginationModel');
    // reset the setting page to 1, in case this method called when we already
    // fetch more pages
    paginationSettings.page = 1;

    return this.get('store').query(modelName, paginationSettings).then((results) => {
      this.set('paginationMeta', results.meta);
      return results;
    }, (err) => {
      this.reportLoadError(err);
    });
  },

  actions: {

    loadFirstPage() {
      return this.loadFirstPage();
    },

    loadNextPage() {
      var modelName = this.get('paginationModel'),
        meta = this.get('paginationMeta'),
        paginationSettings = this.get('paginationSettings');

      const available = meta.pagination && meta.pagination.pages > meta.pagination.page;

      if (available) {
        this.set('isLoading', true);
        this.set('paginationSettings.page', meta.pagination.page + 1);
        this.get('store').query(modelName, paginationSettings).then((results) => {
          this.set('isLoading', false);
          this.set('paginationMeta', results.meta);
          return results;
        }, (err) => {
          this.reportLoadError(err);
        })
      }
    },

    resetPagination() {
      this.set('paginationSettings.page', 1);
    }
  }
});
