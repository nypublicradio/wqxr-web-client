describe('Schedule page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the schedule page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/schedule`, fastbootStatus);

      cy.visit(`/schedule?fastboot=${fastbootStatus}`);
      
      cy.waitForApplication();
      cy.wait('@platform-events');
      cy.wait('@script-loader');
    });
  });
})
