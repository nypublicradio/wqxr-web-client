import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger } from 'ember-basic-dropdown/test-support/helpers';


module('Integration | Component | toggle-box', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      {{#toggle-box}} as |toggle|}}
        {{#toggle.trigger as |options|}}
          <span class="the-label">Toggle Box Label</span>
        {{/toggle.trigger}}

        {{#toggle.dropdown}}
          Dropdown Contents
        {{/toggle.dropdown}}
      {{/toggle-box}}
    `);

    await clickTrigger();
    assert.dom('.toggle-box__dropdown').hasText('Dropdown Contents');
  });
});
