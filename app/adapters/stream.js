import StreamAdapter from 'nypr-publisher-lib/adapters/stream';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import rsvp from 'rsvp';
import fetch from 'fetch';

const json = r => r.json();

export default StreamAdapter.extend(DataAdapterMixin, {
  authorize(xhr) {
    let headers = this.get('session').authorize({});
    for (var h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
  },
  findAll() {
    let base = `${this.host}/${this.namespace}`;
    return rsvp.hash({
      streams: fetch(`${base}/list/streams/`).then(json),
      whatsOn: fetch(`${base}/whats_on/?previous=1`).then(json),
    });
  },
  findRecord(store, type, id/*, snapshot*/) {
    let base = `${this.host}/${this.namespace}`;
    return rsvp.hash({
      stream: fetch(`${base}/list/streams/${id}/`).then(json),
      whatsOn: fetch(`${base}/whats_on/${id}/1`).then(json),
    });
  },
});
