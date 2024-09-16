describe('verify page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the verify daily page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/verify`, fastbootStatus);

      cy.visit(`/verify?fastboot=${fastbootStatus}`);
      
      cy.waitForApplication();
    });
  });
})
