import EmberObject from '@ember/object';
import AnalyticsMixin from 'wqxr-web-client/mixins/analytics';
import { module, test } from 'qunit';

module('Unit | Mixin | analytics', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let AnalyticsObject = EmberObject.extend(AnalyticsMixin);
    let subject = AnalyticsObject.create();
    assert.ok(subject);
  });

  test('willTransition saves previous url', function(assert) {
    let AnalyticsObject = EmberObject.extend(AnalyticsMixin);
    let subject = AnalyticsObject.create({
      dataPipeline: {}
    });
    subject.willTransition();
    assert.equal(subject.get('dataPipeline.currentReferrer'), location.toString(), 'dataPipeline should have currentReferrer should current url');
  });
});
