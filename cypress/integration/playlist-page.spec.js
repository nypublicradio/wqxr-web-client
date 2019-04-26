describe('Playlist page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the playlist page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/streams/new-sounds`, fastbootStatus);

      cy.visit(`/streams/new-sounds?fastboot=${fastbootStatus}`);

      cy.waitForApplication();
      cy.wait('@platform-events');
      cy.wait('@script-loader');
    });
  });
})
