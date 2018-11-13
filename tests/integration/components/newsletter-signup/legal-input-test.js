import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';

module('Integration | Component | newsletter-signup/legal-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{newsletter-signup/legal-input}}`);

    assert.dom('input[data-test-legal-input]').exists();
    assert.dom('label').hasText(
      'By submitting your information, you\'re agreeing to receive ' +
      'communications from New York Public Radio in accordance with our Terms of Use.'
    );
  });


  test('legal accepted', async function(assert) {
    await render(hbs`{{newsletter-signup}}`);

    assert.dom('[data-test-submit]').exists();
    assert.dom('input[data-test-legal-input]').isChecked();

    assert.dom('[data-test-submit]').isNotDisabled('with legal pre-checked, submit button is enabled');
  });

  test('legal not accepted', async function(assert) {
    await render(hbs`{{newsletter-signup}}`);

    // toggle legal checkbox to unchecked
    await click('[data-test-legal-label]');

    assert.dom('input[data-test-legal-input]').isNotChecked();
    assert.dom('[data-test-submit]').isDisabled('with legal un-checked, submit button is disabled');
  });

});
