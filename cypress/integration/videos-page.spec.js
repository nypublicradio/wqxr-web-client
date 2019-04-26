describe('Videos page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the videos page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/videos`, fastbootStatus);

      cy.visit(`/videos?fastboot=${fastbootStatus}`);
      
      cy.waitForApplication();
      cy.wait('@script-loader');
      cy.wait('@videos-api')
    });
  });
})
