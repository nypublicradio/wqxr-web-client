describe('Login page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the login page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/login`, fastbootStatus);

      cy.visit(`/login?fastboot=${fastbootStatus}`);
      
      cy.wait('@platform-events');
      cy.waitForApplication();
    });
  });
})
