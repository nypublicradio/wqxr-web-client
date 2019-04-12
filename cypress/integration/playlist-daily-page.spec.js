describe('Playlist Daily page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the playlist daily page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/playlist-daily`, fastbootStatus);

      cy.visit(`/playlist-daily?fastboot=${fastbootStatus}`);
      cy.waitForApplication();
      cy.wait('@platform-events');
      cy.wait('@script-loader');
    });
  });
})
