// adds a trailing slash to urls that need to be created and added to href elements
// (ie this would be used by link-to)
import HistoryLocation from '@ember/routing/history-location';

export default HistoryLocation.extend({
  formatURL() {
    let url = this._super(...arguments);

    if (url.includes('#')) {
      return url.replace(/([^/])#(.*)/, '$1/#$2');
    } else {
      return url.replace(/\/?$/, '/');
    }
  }
});
