describe('Settings page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the settings page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/settings`, fastbootStatus);

      cy.visit(`/settings?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@platform-events')
    });
  });
})
