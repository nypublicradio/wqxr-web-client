import Application from '@ember/application';
import { run } from '@ember/runloop';
import { initialize } from 'wqxr-web-client/instance-initializers/google-experiments';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';

module('Unit | Instance Initializer | google experiments', function(hooks) {
  hooks.beforeEach(function() {
    run(() => {
      this.application = Application.create();
      this.appInstance = this.application.buildInstance();
    });
  });

  hooks.afterEach(function() {
    run(this.appInstance, 'destroy');
    destroyApp(this.application);
  });

  // Replace this with your real tests.
  test('it calls the api to choose an experiment variation', function(assert) {
    let apiCalled = false;
    window.cxApi = { chooseVariation: () => {apiCalled = true;} };
    initialize(this.appInstance);

    assert.equal(apiCalled, true, 'it should call cxApi to choose a variation');
  });

  test('it runs ok in the absence of the google experiment script', function(assert) {
    delete window.cxApi;
    initialize(this.appInstance);
    assert.ok(true, 'it ran without error');
  });
});
