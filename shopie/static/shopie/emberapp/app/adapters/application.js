import BaseAdapter from './base'

export default BaseAdapter.extend({
  shouldBackgroundReloadRecord() {
    return false;
  }
});
