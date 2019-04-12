describe('Story Page', () => {
  ['true','false'].forEach(fastbootStatus => {
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


      // Full Bleed template renders
      cy.fastbootCheck(`/story/wqxr-presents-19-19-artists-watch-upcoming-year`, fastbootStatus);

      cy.visit(`/story/wqxr-presents-19-19-artists-watch-upcoming-year?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait(['@full-bleed-story-api']);

      cy.url().should('contain', 'wqxr-presents-19-19-artists-watch-upcoming-year');

      cy.get('.full-bleed__hero')
        .should('exist');

      // Full Bleed template with imagegrid renders
      cy.fastbootCheck(`/story/wqxr-presents-19-19-artists-collaborations-upcoming-year`, fastbootStatus);
      cy.visit(`/story/wqxr-presents-19-19-artists-collaborations-upcoming-year?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait(['@imagegrid-story-api']);
      cy.wait(['@imagegrid-buckets-api']);

      cy.url().should('contain', 'wqxr-presents-19-19-artists-collaborations-upcoming-year');

      cy.get('.full-bleed__hero')
        .should('exist');
    });
  });
});
