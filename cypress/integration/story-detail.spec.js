// TODO: this should also run OK under Fastboot status in Cypress,
// but for reasons unclear as of this writing (2019-09-16),
// it does not.
describe('Full-bleed Story Page with Image Grid', () => {
  ['false'].forEach(fastbootStatus => {
    it(`loads a full-bleed story page with image grid (fastboot=${fastbootStatus})`, () => {
      // Full Bleed template with imagegrid renders

      cy.fastbootCheck(`/story/wqxr-presents-19-19-artists-collaborations-upcoming-year/`, fastbootStatus);
      cy.visit(`/?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.visit(`/story/wqxr-presents-19-19-artists-collaborations-upcoming-year/?fastboot=${fastbootStatus}`);

      cy.wait(['@imagegrid-story-api']);
      cy.wait(['@imagegrid-buckets-api']);

      cy.url().should('contain', 'wqxr-presents-19-19-artists-collaborations-upcoming-year');

      cy.get('.full-bleed__hero')
        .should('exist');
    });
  });
});

describe('Full-bleed Story Page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`loads a full-bleed story page (fastboot=${fastbootStatus})`, () => {
      // Full Bleed template renders
      cy.fastbootCheck(`/story/wqxr-presents-19-19-artists-watch-upcoming-year`, fastbootStatus);

      cy.visit(`/story/wqxr-presents-19-19-artists-watch-upcoming-year?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait(['@full-bleed-story-api']);

      cy.url().should('contain', 'wqxr-presents-19-19-artists-watch-upcoming-year');

      cy.get('.full-bleed__hero')
        .should('exist');

    });
  });
});

describe('Story Page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`loads a story page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/story/david-bowies-classical-impact-one-year-later`, fastbootStatus);

      cy.visit(`/story/david-bowies-classical-impact-one-year-later?fastboot=${fastbootStatus}`);
      cy.waitForApplication();

      cy.wait(['@story-api']);

      cy.url().should('contain', '/david-bowies-classical-impact-one-year-later');

      // Story Header
      cy.get('#storyHeader h1')
        .contains('David Bowie\'s Classical Music Impact, One Year Later');
      // Main Image

      cy.get('figure#image img')
        .invoke('attr', 'src')
        .should('include', 'david_bowie.jpg');
      // Byline
      cy.get('#byLine > a')
        .contains('James');
      // Share Buttons
      cy.get('.story-share-buttons > *')
        .should('have.length', 3);
    });
  });
});