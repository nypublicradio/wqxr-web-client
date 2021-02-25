import StationName from 'nypr-audio-services/components/stream-banner/station-name'
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default StationName.extend({
    activeStream: null,
    hifi: service(),
    isPlaying: computed('hifi.isPlaying', 'activeStream', function() {
        return this.get('hifi.isPlaying') &&
               this.get('hifi.currentSound.metadata.contentId') === this.get('activeStream.slug');
    })
});
