import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | main-player/track-info', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{main-player/track-info composerName='Gioacchino Rossini' trackTitle='Guglielmo Tell: Selva opaca, deserta brughiera' }}`);
    assert.dom('[data-test-element="track-info-composer"]').hasText('Gioacchino Rossini');
    assert.dom('[data-test-element="track-info-title"]').hasText('Guglielmo Tell: Selva opaca, deserta brughiera');
  });
});
