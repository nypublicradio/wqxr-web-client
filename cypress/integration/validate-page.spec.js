describe('Validate page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the validate daily page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/validate`, fastbootStatus);

      cy.visit(`/validate?fastboot=${fastbootStatus}`);

      // DFP banner add
      cy.get('.header-ad-wrapper').should('exist');

      cy.waitForApplication();
      cy.wait('@validate-api');
      cy.wait('@platform-events');
    });
  });
})
