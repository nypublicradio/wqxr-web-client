describe('Forgot page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the forgot page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/forgot`, fastbootStatus);
      
      cy.visit(`/forgot?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@platform-events');
    });
  });
})
