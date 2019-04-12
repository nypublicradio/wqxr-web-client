describe('Show detail page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the show detail page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/shows/carnegie`, fastbootStatus);

      cy.visit(`/shows/carnegie?fastboot=${fastbootStatus}`);
      cy.waitForApplication();
    });
  });
})
