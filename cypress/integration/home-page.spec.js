describe('Home page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the home page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/`, fastbootStatus);

      cy.visit(`/?fastboot=${fastbootStatus}`);
      cy.waitForHomepage();

      cy.location('pathname').should('eq', '/');

      // DFP banner add
      cy.get('.header-ad-wrapper').should('exist');
      // WQXR Nav
      cy.get('#site-chrome').should('exist');
      // Main Player
      cy.get('.main-player').should('exist');
      // Featured Story
      cy.get('.story_default').should('exist');
      // Newsletter Signup
      cy.get('.newsletter-signup').should('exist');
      // Footer
      cy.get('#footer').should('exist');

      cy.waitForApplication();
      cy.wait('@platform-events');
    });
  });
})
