import {
  click,
  fillIn,
  find,
  findAll,
  currentURL,
  visit,
  blur
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import config from 'wqxr-web-client/config/environment';
import { Response } from 'ember-cli-mirage';

module('Acceptance | profile', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('unauthenticated visiting /profile', async function(assert) {
    await visit('/profile');

    assert.equal(currentURL(), '/login');
  });

  test('authenticated visiting /profile', async function(assert) {
    authenticateSession({access_token: 'foo'});
    server.create('user');

    await visit('/profile');

    assert.equal(currentURL(), '/profile');
  });

  test('can view & update attrs', async function(assert) {
    const FIRST = 'zzzzz';
    const LAST = 'xxxxx';
    const USER = 'yyyyy';
    const EMAIL = 'wwwww@ww.ww';
    const PW = '1234567890';
    let {
      given_name,
      family_name,
      preferred_username,
      email
    } = server.create('user');

    server.post(`${config.authAPI}/v1/session`, (schema, {requestBody}) => {
      let body = requestBody.split('&').map(s => ({[s.split('=')[0]]: s.split('=')[1]}));
      assert.equal(decodeURIComponent(body.findBy('username').username), email);
      assert.equal(body.findBy('password').password, PW);
      return {access_token: 'secret', expires_in: 3600, token_type: 'bearer'};
    });

    server.patch(`${config.authAPI}/v1/user`, (schema, request) => {
      assert.equal(request.requestHeaders.authorization, 'Bearer secret');
      assert.deepEqual(JSON.parse(request.requestBody), {
        given_name: FIRST,
        family_name: LAST,
        preferred_username: USER,
        email: EMAIL
      });

      return {
        data: {
          type: 'user',
          id: '1',
          attributes: JSON.parse(request.requestBody)
        }
      };
    });

    authenticateSession({access_token: 'secret'});
    await visit('/profile');

    assert.equal(find('input[name=fullName]').value, `${given_name} ${family_name}`, 'displays old fullname');
    assert.equal(find('input[name=preferredUsername]').value, preferred_username, 'displays old username');
    assert.equal(find('input[name=email]').value, email, 'displays old email');
    assert.equal(find('input[name=password]').value, '********', 'displays password asterisks');
    await click('.nypr-basic-info [data-test-selector="nypr-card-button"]');
    await fillIn('input[name=givenName]', FIRST);
    await fillIn('input[name=familyName]', LAST);
    await fillIn('input[name=preferredUsername]', USER);
    await fillIn('input[name=email]', EMAIL);

    await click('input[name=email]');
    await fillIn('input[name=confirmEmail]', EMAIL);

    await click('.nypr-basic-info [data-test-selector="save"]');

    await fillIn('[name=passwordForEmailChange]', PW);
    await click('[data-test-selector=check-pw]');
    assert.ok(find('.alert-success'), 'shows flash message');
    assert.equal(find('input[name=fullName]').value, `${FIRST} ${LAST}`, 'displays new fullname');
    assert.equal(find('input[name=preferredUsername]').value, USER, 'displays new username');
    assert.equal(find('input[name=email]').value, EMAIL, 'displays new email');
    assert.equal(find('input[name=password]').value, '********', 'displays password asterisks');
  });

  test('using bad password to update email shows error', async function(assert) {
    const EMAIL = 'wwwww@ww.ww';
    const PW = '1234567890';

    server.create('user');
    server.post(`${config.authAPI}/v1/session`, () => {
      return new Response(401, {}, {
        "error": {
          "code": "UnauthorizedAccess",
          "message": "Incorrect username or password."
        }
      });
    });

    authenticateSession(this.application, {access_token: 'foo'});
    await visit('/profile');

    await click('.nypr-basic-info [data-test-selector="nypr-card-button"]');

    await fillIn('input[name=email]', EMAIL);
    await blur('input[name=email]');

    await fillIn('input[name=confirmEmail]', EMAIL);
    await blur('input[name=confirmEmail]');

    await click('.nypr-basic-info [data-test-selector="save"]');

    await fillIn('[name=passwordForEmailChange]', PW);
    await blur('[name=passwordForEmailChange]');

    await click('[data-test-selector=check-pw]');
    assert.ok(find('.nypr-input-error'));
    assert.equal(find('.nypr-input-error').textContent.trim(), 'Incorrect username or password.');
    assert.equal(find('#passwordForEmailChange').value, PW, 'old password should still be there');
  });

  test('can update password', async function(assert) {
    const OLD = '1234567890';
    const NEW = '0987654321';
    server.create('user');
    server.post(`${config.authAPI}/v1/password`, (schema, request) => {
      let body = JSON.parse(request.requestBody);
      assert.equal(request.requestHeaders.authorization, 'Bearer foo');
      assert.equal(request.requestHeaders['content-type'], 'application/json');
      assert.deepEqual(body, {old_password: OLD, new_password: NEW});
    });

    authenticateSession({access_token: 'foo'});
    await visit('/profile');

    await click('.nypr-password-card [data-test-selector="nypr-card-button"]');

    await fillIn('input[name=currentPassword]', OLD);
    await fillIn('input[name=newPassword]', NEW);

    await click('.nypr-password-card [data-test-selector="save"]');

    assert.ok(find('.alert-success'), 'shows flash message');
  });

  test('trying to update with incorrect password shows error', async function(assert) {
    const OLD = '1234567890';
    const NEW = '0987654321';
    server.create('user');
    server.post(`${config.authAPI}/v1/password`, () => {
      return new Response(401, {}, {
        "error": {
          "code": "UnauthorizedAccess",
          "message": "Incorrect username or password."
        }
      });
    });

    authenticateSession({access_token: 'foo'});
    await visit('/profile');

    await click('.nypr-password-card [data-test-selector="nypr-card-button"]');

    await fillIn('input[name=currentPassword]', OLD);
    await blur('input[name=currentPassword]');
    await fillIn('input[name=newPassword]', NEW);
    await blur('input[name=newPassword]');

    await click('.nypr-password-card [data-test-selector="save"]');

    assert.ok(find('[data-test-selector=save]'), 'form should not be in editing state');
    assert.equal(find('.nypr-input-error').textContent.trim(), 'This password is incorrect.');
    assert.equal(find('.nypr-input-helplink').textContent.trim(), 'Forgot password?');
    assert.equal(find('input[name=currentPassword]').value, OLD, 'old password should still be there');
    assert.equal(find('input[name=newPassword]').value, NEW, 'new password should still be there');
  });

  test('can disable account', async function(assert) {
    server.create('bucket', {slug: 'wqxr-home'});
    assert.expect(1);

    server.create('user');
    server.create('bucket', {slug: 'wqxr-home'});
    server.delete(`${config.authAPI}/v1/user`, (schema, {requestHeaders}) => {
      assert.equal(requestHeaders.authorization, 'Bearer foo');
    });

    authenticateSession({access_token: 'foo'});
    await visit('/profile');

    await click('[data-test-selector="disable-account"]');

    await click('[data-test-selector="do-disable"]');

    await click('[data-test-selector="confirm-disable"]');
  });

  test('shows pending email', async function(assert) {
    server.create('user');
    authenticateSession({access_token: 'foo'});

    server.get(`${config.membershipAPI}/v1/emails/is-verified/`, () => {
      return new Response(200, {}, {data: {is_verified: false}});
    });
    await visit('/profile');

    assert.ok(find('.nypr-account-pending'), 'pending message shows');
  });

  test('creating email from fb account', async function(assert) {
    const EMAIL = 'foo@bar.baz';
    server.create('user', 'facebook');
    authenticateSession({access_token: 'foo'});

    await visit('/profile');
    await click('span + button');

    assert.equal(find('.nypr-account-modal-title').textContent.trim(), 'Enter Your Email');

    await fillIn('input[name=connectEmail]', EMAIL);
    await fillIn('input[name=connectEmailConfirmation]', EMAIL);
    await click('[data-test-selector="enter-email"]');

    assert.equal(find('.nypr-account-modal-title').textContent.trim(), 'Check Your Email');
  });

  test('resend verification email when authenticated via username/password', async function(assert) {
    // Logged in username/password user
    server.create('user');
    authenticateSession({access_token: 'secret'});
    // Account is pending verification
    server.get(`${config.membershipAPI}/v1/emails/is-verified/`, () => {
      return new Response(200, {}, {data: {is_verified: false}});
    });

    let requests = [];
    server.get(`${config.authAPI}/v1/confirm/resend-attr`, (schema, request) => {
      requests.push(request);
      return new Response(200);
    });

    await visit('/profile');

    await click('.resend-button');
    assert.equal(requests.length, 1, 'it should call resend api url once');
    assert.equal(requests[0].requestHeaders["authorization"], "Bearer secret", 'it should send an auth token');
    assert.strictEqual(requests[0].requestHeaders["x-provider"], undefined, 'it should not send a provider header');
  });

  test('resend verification email when authenticated via facebook', async function(assert) {
    const PW = 'abcdef123456';
    // Logged in facebook user with connected email account
    server.create('user', 'connected');
    authenticateSession({access_token: 'secret', provider: 'facebook-connect'});
    // Account is pending verification because they changed their email address
    server.get(`${config.membershipAPI}/v1/emails/is-verified/`, () => {
      return new Response(200, {}, {data: {is_verified: false}});
    });

    let requests = [];
    server.get(`${config.authAPI}/v1/confirm/resend-attr`, (schema, request) => {
      requests.push(request);
      return new Response(200);
    });

    await visit('/profile');

    await click('.resend-button');
    await fillIn('[name=passwordForVerifyEmail]', PW);
    await click('[data-test-selector=check-pw-verify]');
    assert.equal(requests.length, 1, 'it should call resend api url once');
    assert.equal(requests[0].requestHeaders["authorization"], "Bearer secret", 'it should send an auth token');
    assert.strictEqual(requests[0].requestHeaders["x-provider"], undefined, 'it should not send a provider header');
  });

  test('resend verification email when authenticated via facebook fails on bad password', async function(assert) {
    const PW = 'abcdef123456';
    // Logged in facebook user with connected email account
    server.create('user', 'connected');
    authenticateSession({access_token: '123456', provider: 'facebook-connect'});
    // Account is pending verification because they changed their email address
    server.get(`${config.membershipAPI}/v1/emails/is-verified/`, () => {
      return new Response(200, {}, {data: {is_verified: false}});
    });
    // Unauthorized / Bad password
    server.post('/v1/session', {}, 401);

    let requests = [];
    server.get(`${config.authAPI}/v1/confirm/resend-attr`, (schema, request) => {
      requests.push(request);
      return new Response(200);
    });

    await visit('/profile');

    await click('.resend-button');
    await fillIn('[name=passwordForVerifyEmail]', PW);
    await click('[data-test-selector=check-pw-verify]');
    assert.equal(requests.length, 0, 'it should not call resend api url');
  });

  test('resend set password email when have not set a password yet', async function(assert) {
    // Logged in facebook user
    let user = server.create('user', 'facebook');
    authenticateSession({access_token: '123456', provider: 'facebook-connect'});
    // Account is pending verification because they just created an email account and hasn't set a password yet
    server.get(`${config.membershipAPI}/v1/emails/is-verified/`, () => {
      return new Response(200, {}, {data: {is_verified: false}});
    });

    let resendRequests = [];
    server.get(`${config.authAPI}/v1/confirm/resend-attr`, (schema, request) => {
      resendRequests.push(request);
      return new Response(200);
    });
    let setTempPasswordRequests = [];
    server.post(`${config.authAPI}/v1/password/send-temp`, (schema, request) => {
      setTempPasswordRequests.push(request);
      return new Response(200);
    });

    await visit('/profile');

    await click('.resend-button');
    assert.equal(resendRequests.length, 0, 'it should not call resend api url');
    assert.equal(setTempPasswordRequests.length, 1, 'it should call the send-temp api url once');
    assert.equal(JSON.parse(setTempPasswordRequests[0].requestBody).email, user.email, 'it should call the send-temp api url with the users email address');
  });

  test('logged in with fb account shows manage link', async function(assert) {
    server.create('user', 'facebook', {facebookId: '1234'});
    authenticateSession({access_token: 'foo'});

    await visit('/profile');

    assert.equal(findAll('.nypr-social-connect__link').length, 1);
  });
});
