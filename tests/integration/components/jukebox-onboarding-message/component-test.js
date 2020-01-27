import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | jukebox-onboarding-message', function(hooks) {
  setupRenderingTest(hooks);
  test('it renders', async function(assert) {
    await render(hbs`{{jukebox-onboarding-message}}`);
    assert.dom('[data-test-element="onboarding-title"]').hasText('You\'re invited...');
    assert.dom('[data-test-element="onboarding-body"]').hasText('...to our new, experimental WQXR.org! We want to hear what you think.');
    assert.dom('[data-test-element="onboarding-button"]').hasText('Visit The New WQXR.org');
  });
});
