import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { findAll, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | wqxr-image-grid', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders with a story', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    let story = server.create('story');
    this.set('imageGridItems', [story])
    await render(hbs`{{wqxr-image-grid imageGridItems=imageGridItems}}`);

    assert.equal(findAll('.brick__item').length, 1);
  });
});
