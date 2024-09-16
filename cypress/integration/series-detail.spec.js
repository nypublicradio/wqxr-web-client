describe('Series detail page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the series detail page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/series/inventing-abstraction`, fastbootStatus);
      cy.visit(`/series/inventing-abstraction?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@series-api');
      cy.wait('@listenlive-api');
      cy.wait('@platform-events');
    });
  });
})
