describe('Events page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the events page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/events`, fastbootStatus);

      cy.visit(`/events?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@events-api');
      cy.wait('@platform-events');
      cy.wait('@script-loader');
    });
  });
})
