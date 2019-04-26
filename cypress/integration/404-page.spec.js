describe('404 page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the 404 page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/sdfjklkskd`, fastbootStatus);

      cy.visit(`/sdfjklkskd?fastboot=${fastbootStatus}`);
      
      cy.waitForApplication();
      cy.wait('@page-api');
      cy.wait('@script-loader');
      cy.wait('@platform-events');
    });
  });
})
