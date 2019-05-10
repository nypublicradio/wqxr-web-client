// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('disableMirage', () => {
  cy.window().then(win => {
    win.localStorage.disableMirage = true;
  });
});

Cypress.Commands.add('skipAnimation', () => {
  cy.window().then(win => {
    win.localStorage.skipAnimation = true;
  });
});

// Get the correct (visible/non-deleted) version of the navlink
Cypress.Commands.add('getNavLink', navLinkText => {
  cy.get(`.show-header > div:not(.hidden):first a:contains('${navLinkText}'):first`);
});

Cypress.Commands.add('routeForFlatPage', (flatPageUrl, content=`<p class='flat-page'>Test Flat Page</p>`) => {
  cy.route(`/api/v3/flatpages/?filter[url]=${flatPageUrl}&filter[site]=16`,
  {
    data: [{
      type: 'flat-page',
      id: '12345',
      attributes: {
        url: flatPageUrl,
        title: 'Flat Page',
        content,
        'enable-comments': false,
        'template-name': '',
        'registration-required': false
      }
    }]
  });
});

Cypress.Commands.add('routeForChunk', (slug, content='<p>Test Chunk</p>') => {
  cy.route(`/api/v3/chunks/${slug}/`,
  {
    data: {
      type: 'chunk',
      id: '12345',
      attributes: {
        slug,
        content,
      }
    }
  });
});

Cypress.Commands.add('fastbootCheck', (path = '/', fastbootStatus = true) => {
  cy.setCookie('ember-simple-auth-session', '{"authenticated":{}}');
  cy.request({
    url: `${path}/?fastboot=${fastbootStatus}`,
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3"
    }
  }).then((response) => {
    if (fastbootStatus == 'true') {
      expect(response.body.includes('class="header-ad-wrapper"')).to.be.true;
    } else {
      expect(response.body.includes('class="header-ad-wrapper"')).to.be.false;
    }
  });
  cy.clearCookie('ember-simple-auth-session');
});

Cypress.Commands.add('waitForApplication', () => {
  cy.wait([
    '@chunks-wqxr-global',
    '@browser-id',
  ], {timeout: '10000'});
});

Cypress.Commands.add('waitForHomepage', () => {
  cy.wait([
    '@buckets-wqxr-home-api',
    '@chunks-wqxr-wartop-home',
    '@chunks-wqxr-membership-home'
  ]);
});

Cypress.Commands.add('waitForShowDetail', () => {
  cy.wait(['@channel-listing-api', '@channel-shows-api', '@buckets-api'])
});

Cypress.Commands.add('waitForShows', () => {
  cy.wait(['@story-api', '@buckets-featured-shows-api']);
});

Cypress.Commands.add('waitForTeam', () => {
  cy.wait('@shows-the-team-api');
});

Cypress.Commands.add('waitForPeople', () => {
  cy.wait('@people-api');
});


Cypress.Commands.add('mockApi', () => {
  //** If an api response isn't specifically defined further below, default is to return a 404 **//
  cy.route({url: '/api/**', status: 404, response: {"errors":[{"status":"404","source":{"pointer":"/data/attributes/detail"},"detail":"Not found."}]}})

  //** Flat pages **/
  cy.route({url: '/api/v3/flatpages/**', status: 404, response: {"errors":[{"status":"404","source":{"pointer":"/data/attributes/detail"},"detail":"Not found."}]}})
  .as('flatpage-api');

  //** Home Page **//
  cy.route({url: '/api/v3/chunks/wqxr-global/**', status: 404, response: {"errors":[{"status":"404","source":{"pointer":"/data/attributes/detail"},"detail":"Not found."}]}})
    .as('chunks-wqxr-global');
  cy.route(
      '/api/v3/buckets/wqxr-home/**',
      'fixture:v3/buckets/wqxr-home',
    )
    .as('buckets-wqxr-home-api');
  cy.route(
      '/api/v3/chunks/wqxr-wartop-home/**',
      'fixture:v3/chunks/wqxr-wartop-home',
    )
    .as('chunks-wqxr-wartop-home');
  cy.route(
      '/api/v3/chunks/wqxr-membership-home',
      'fixture:v3/chunks/wqxr-membership-home',
    )
    .as('chunks-wqxr-membership-home');

  //** Show Listing **//
  cy.route('/api/v3/shows/**', 'fixture:v3/shows').as('story-api');

  //** Show Detail **//
  cy.route(
      '/api/v3/channel/shows/*/*/**',
      'fixture:v3/channel/shows/__show/recent_stories')
    .as('channel-listing-api');

  cy.route('/api/v3/channel/shows/*', 'fixture:v3/channel/shows/__show')
    .as('channel-shows-api');

  cy.route(
      '/api/v3/buckets/*-shows-you-might-like/**',
      'fixture:v3/buckets/__show-shows-you-might-like')
    .as('buckets-api');

  cy.route({url: '/api/v3/chunks/*-show-callout', status: 404, response: {}})
    .as('callout-api');

  cy.route(
      '/api/v3/channel/shows/*/the-team/1**',
      'fixture:v3/channel/shows/__show/the-team')
    .as('shows-the-team-api');

  //** Series Page **//
  cy.route('/api/v3/channel/series/**',
    'fixture:v3/channel/series/__series')
  .as('series-api');

  //** Events Page **//
  cy.route({url: '/api/v3/chunks/*-listenlive', status: 404, response: {}})
    .as('listenlive-api');

  //** Story Detail **//
  cy.route('/api/v3/story/*/',
    'fixture:v3/story/__story')
  .as('story-api');
  cy.route(
      '/api/v3/story/wqxr-presents-19-19-artists-watch-upcoming-year/**',
      'fixture:v3/story/wqxr-presents-19-19-artists-watch-upcoming-year')
    .as('full-bleed-story-api');
  cy.route(
      '/api/v3/story/wqxr-presents-19-19-artists-collaborations-upcoming-year/**',
      'fixture:v3/story/wqxr-presents-19-19-artists-collaborations-upcoming-year')
    .as('imagegrid-story-api');
  cy.route('/api/v3/shows/*/**',
    'fixture:v3/shows/__show')
    .as('show-api');
  cy.route('/api/v1/list/comments/**',
           'fixture:v1/comments/__story-list-comments')
    .as('story-comments-api');
  cy.route('/api/v3/story/related/**',
           'fixture:v3/story/__story-related')
    .as('story-related-api');
  cy.route(
      '/api/v3/buckets/articles-**-imagegrid/**',
      'fixture:v3/buckets/__story-articles-imagegrid')
    .as('imagegrid-buckets-api');


  //** People **//
  cy.route(
    '/api/v3/person/**',
    'fixture:v3/person/__person')
  .as('person-api');

  //** Streams **//
  cy.route(
    '/api/v1/list/streams/**',
    'fixture:v1/streams/streams-list')
  .as('streams-api');

  //** Whatson **//
  cy.route(
    '/api/v1/whats_on/**',
    'fixture:v1/whatson/whatson')
  .as('whatson-api');

  //** Playlist **//
  cy.route(
    '/api/v3/wqxr_djangopages/playlist-daily/**',
    'fixture:playlist-daily.html')
  .as('playlist-api');

  //** Schedule **//
  cy.route(
    '/api/v3/wqxr_djangopages/schedule/**',
    'fixture:schedule.html')
  .as('schedule-api');

  //** Events **//
  cy.route(
    '/api/v3/wqxr_djangopages/events/**',
    'fixture:events.html')
  .as('events-api');

  //** Videos **//
  cy.route(
    '/api/v3/wqxr_djangopages/videos/**',
    'fixture:videos.html')
  .as('videos-api');

  //** Analytics**//
  cy.route('GET', /browser_id/, {
    "browser_id": "123",
    "user_id": "",
    "id": "123",
    "cookie1234567890": 1
  }).as('browser-id');
  cy.route('POST', /(listened|viewed)$/, { "success": true }).as('platform-events');
  cy.route('POST', /api\/most/, {"success": true}).as('legacy-platform');

  //** Auth **//
  cy.route('GET', /is_logged_in/, {
    "isAuthenticated": false
  }).as('is-logged-in');

  cy.route('auth/v1/confirm/sign-up**', {
    "errors": {
      "code": "UserNotFoundException",
      "message": "Username/client id combination not found."
    }
  }).as('validate-api')

  //** Script Loader **//
  cy.route(
    '/api/v1/dynamic-script-loader/**',
    'fixture:blank.js')
  .as('script-loader');
});
