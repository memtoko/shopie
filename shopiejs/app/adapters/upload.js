import BaseAdapter from './application';

export default BaseAdapter.extend({

  ajaxOptions(url, type, options) {
    var hash = this._super(...arguments);
    if (hash.data && type !== 'GET') {
      hash.cache = false;
      hash.contentType = false;
      hash.processData = false;
      hash.data = this._buildFormData(hash.data);
    }
    console.log(hash);
    return hash;
  },

  _buildFormData(data) {
    var form = new FormData(),
      root = Object.keys(data)[0];

    Object.keys(data[root]).forEach(function(key) {
      if (typeof data[root][key] !== 'undefined') {
        form.append(root + "[" + key + "]", data[root][key]);
      }
    }, this);

    return form;
  }
});
