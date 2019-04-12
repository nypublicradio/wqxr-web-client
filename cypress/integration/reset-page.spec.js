describe('reset page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the reset page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/reset`, fastbootStatus);

      cy.visit(`/reset?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@platform-events');
    });
  });
})
