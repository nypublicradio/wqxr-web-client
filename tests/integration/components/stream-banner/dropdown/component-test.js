import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | stream-banner/dropdown', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('stream', { 'name': 'WQXR 105.9' });
    await render(hbs`{{stream-banner/dropdown activeStream=stream}}`);
    assert.dom('.stream-banner__active-stream').hasText('WQXR 105.9');
    assert.dom('.more-streams-label').hasText('');
  });
});
