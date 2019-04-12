describe('Tag detail page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the tag detail page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/tags/prince`, fastbootStatus);

      cy.visit(`/tags/prince?fastboot=${fastbootStatus}`);
      cy.waitForApplication();
    });
  });
})
