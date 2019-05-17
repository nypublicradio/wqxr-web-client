describe('404 page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the 404 page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/sdfjklkskd`, fastbootStatus);

      cy.visit(`/sdfjklkskd?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@flatpage-api');
      cy.wait('@platform-events');
    });
  });
})
