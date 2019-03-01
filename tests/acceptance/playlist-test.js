import { findAll, currentURL, visit } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';
import moment from 'moment';


module('Acceptance | playlist', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /streams/wqxr', async function(assert) {
    server.create('stream', {
      slug: 'wqxr',
      name: 'WQXR FM',
    });
    server.create('whats-on', {
      slug: 'wqxr',
      current_show: {
        show_title: 'Foo Show',
        title: 'Episode Foo',
        url: 'http://fooshow.com',
        end: "2016-09-15T13:00:15.542Z" // 9 am
      }
    });
    let date = moment().format('YYYY/MMM/DD').toLowerCase();
    server.create('django-page', {id: `playlist-daily/${date}/?scheduleStation=wqxr`});

    await visit('/streams/wqxr');

    assert.equal(currentURL(), `/playlist-daily/${date}?scheduleStation=wqxr`);
    assert.equal(findAll('.leaderboard-ad').length, 1, 'leaderboard is present');
  });
});
