describe('Streams page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the streams page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/streams`, fastbootStatus);

      cy.visit(`/streams?fastboot=${fastbootStatus}`);
      cy.waitForApplication();
    });
  });
})
