import StreamModel from 'nypr-publisher-lib/models/stream';
import { computed } from '@ember/object';
import { get } from '@ember/object';

export default StreamModel.extend({
  shareMetadata: computed('currentShow', 'currentPlaylistItem', function() {
    let shareText = '';
    let shareUrl = '';
    let via = get(this, 'twitterHandle') || 'WQXR';

    let entry = get(this, 'currentPlaylistItem.catalogEntry');
    if (entry && entry.composer) {
      shareText = `I'm listening to ${entry.composer.name} - ${entry.title}`;
      shareUrl = `http://www.wqxr.org/streams/?stream=${get(this, 'slug')}`;
    } else {
      shareText = `I'm listening to ${get(this, 'currentShow.title')}`;
      shareUrl = get(this, 'currentShow.url');
    }

    return ({shareText, shareUrl, via});
  }),
  previousPlaylistItem: computed('previous', 'currentPlaylistItem', function() {
    let lastTrack = get(this, "previous.firstObject");
    if (lastTrack && !this._trackIsStale(lastTrack)) {
      return lastTrack;
    }
    return null;
  }),
  _trackIsStale(track) {
    let secondsSinceEpoch = Math.round(Date.now() / 1000)
    return secondsSinceEpoch - track.startTimeTs > (60 * 60);
  }
})
