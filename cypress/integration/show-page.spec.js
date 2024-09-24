describe('Show page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the shows page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/shows`, fastbootStatus);

      cy.visit(`/shows/?fastboot=${fastbootStatus}`);
      cy.waitForApplication();
    });
  });
})
