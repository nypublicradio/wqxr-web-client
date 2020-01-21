import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | onboarding-message', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{jukebox-onboarding-message}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#jukebox-onboarding-message}}
        template block text
      {{/jukebox-onboarding-message}}
    `);

    assert.dom('[data-test-element="title"]').hasText('You\'re invited...');
    assert.dom('[data-test-element="body"]').hasText('...to our new, experimental WQXR.org! We want to hear what you think.');
    assert.dom('[data-test-element="button"]').hasText('Visit The New WQXR.org');
  });
});
