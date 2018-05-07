import { camelizeKeys } from 'wqxr-web-client/helpers/camelize-keys';
import { module, test } from 'qunit';

module('Unit | Helper | camelize-keys', function() {
  // Replace this with your real tests.
  test('it camelizes keys', function(assert) {
    let result = camelizeKeys([{ 'foo-bar': true, foo_baz: true }]);
    assert.deepEqual(result, {fooBar: true, fooBaz: true});
  });
});
