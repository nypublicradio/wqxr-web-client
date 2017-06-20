import { test } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import { Response } from 'ember-cli-mirage';
import 'wqxr-web-client/tests/helpers/with-feature';
import { authenticateSession, currentSession } from 'wqxr-web-client/tests/helpers/ember-simple-auth';
import dummySuccessProviderFb from 'wqxr-web-client/tests/helpers/torii-dummy-success-provider-fb';
import dummyFailureProvider from 'wqxr-web-client/tests/helpers/torii-dummy-failure-provider';
import { registerMockOnInstance } from 'wqxr-web-client/tests/helpers/register-mock';

moduleForAcceptance('Acceptance | signup', {
  beforeEach() {
    server.create('stream');
  }
});

test('visiting /signup', function(assert) {
  visit('/signup');

  andThen(() => {
    assert.equal(currentURL(), '/signup');
  });
});

test("can't visit /signup when authenticated", function(assert) {
  server.create('bucket', {slug: 'wqxr-home'});
  server.create('user');
  authenticateSession(this.application, {access_token: 'foo'});

  visit('/signup');

  andThen(() => {
    assert.equal(currentURL(), '/');
  });
});

test('Sign up button is visible at load', function(assert) {
  visit('/signup');

  andThen(() => assert.equal(find('button[type=submit]:contains(Sign up)').length, 1));
});

test('Submitting the sign up form shows the thank you screen', function(assert) {
  server.create('user');
  visit('/signup');

  fillIn('input[name=given_name]', 'jane');
  fillIn('input[name=family_name]', 'doe');
  fillIn('input[name=email]', 'foo@example.com');
  fillIn('input[name=emailConfirmation]', 'foo@example.com');
  fillIn('input[name=typedPassword]', 'password1234567');
  click('button[type=submit]:contains(Sign up)');

  andThen(() => {
    assert.equal(find('.account-form-heading').text().trim(), 'Thanks for signing up!');
  });
});

test('Sign up with Facebook button is visible at load', function(assert) {
  withFeature('socialAuth');
  visit('/signup');

  andThen(() => assert.equal(find('button:contains(Sign up with Facebook)').length, 1));
});

test('Successful facebook login redirects', function(assert) {
  server.create('bucket', {slug: 'wqxr-home'});
  let user = server.create('user');
  registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
  withFeature('socialAuth');
  visit('/signup');

  click('button:contains(Sign up with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.ok(currentSession(this.application).get('isAuthenticated'), 'Session is authenticated');
    assert.equal(find('.user-nav-greeting').text().trim(), user.given_name);
    assert.equal(find('.user-nav-avatar > img').attr('src'), user.picture);
  });
});

test('Facebook login with no email shows alert', function(assert) {
  server.create('user');
  registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummySuccessProviderFb);
  server.get('/v1/session', () => {
    return new Response(400, {}, { "errors": {
      "code": "MissingAttributeException",
      "message": "A provider account could not be created because one or more attributes were not available from the provider. Permissions may have been declined.",
      "values": ["email"] }
    });
  });

  withFeature('socialAuth');
  visit('/signup');

  click('button:contains(Sign up with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/signup');
    assert.equal(find('.alert-warning').text().trim(), "Unfortunately, we can't authorize your account without permission to view your email address.");
    assert.ok(!currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });
});

test('Unsuccessful facebook login shows alert', function(assert) {
  registerMockOnInstance(this.application, 'torii-provider:facebook-connect', dummyFailureProvider);
  withFeature('socialAuth');
  visit('/signup');

  click('button:contains(Sign up with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/signup');
    assert.equal(find('.alert-warning').text().trim(), "We're sorry, but we weren't able to log you in through Facebook.");
    assert.ok(!currentSession(this.application).get('isAuthenticated'), 'Session is not authenticated');
  });
});
