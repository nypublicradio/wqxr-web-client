describe('Signup page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the signup page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/signup`, fastbootStatus);

      cy.visit(`/signup?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@platform-events');
    });
  });
})
