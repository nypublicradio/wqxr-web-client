import DataPipeline from 'nypr-metrics/services/data-pipeline';
import Ember from 'ember';
import computed from 'ember-computed';

export default DataPipeline.extend({
  session: Ember.inject.service(),
  browserId: computed.readOnly('session.data.browserId'),
  authorize(fetchOptions) {
    fetchOptions.headers = this.get('session').authorize(fetchOptions.headers);
    return fetchOptions;
  }
})
