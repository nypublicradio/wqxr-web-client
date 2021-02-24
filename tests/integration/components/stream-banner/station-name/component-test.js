import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | stream-banner/station-name', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('activeStream', { 'name': 'WQXR 105.9' });
    await render(hbs`{{stream-banner/station-name}}`);
    assert.equal(this.element.textContent.trim(), 'WQXR 105.8');
  });
});
