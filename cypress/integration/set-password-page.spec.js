describe('Set password page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the set password page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/set-password`, fastbootStatus);

      cy.visit(`/set-password?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
    });
  });
})
