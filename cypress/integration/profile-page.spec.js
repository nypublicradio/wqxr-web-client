describe('Profile page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the profile page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/profile`, fastbootStatus);

      cy.visit(`/profile?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@platform-events');
    });
  });
})
