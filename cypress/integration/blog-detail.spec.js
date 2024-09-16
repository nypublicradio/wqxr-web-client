describe('Blog detail page', () => {
  ['false'].forEach(fastbootStatus => {
    it(`displays the blog detail page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/blogs/wqxr-blog/`, fastbootStatus);

      cy.visit(`/blogs/wqxr-blog/?fastboot=${fastbootStatus}`);
      cy.location('pathname').should('eq', '/blogs/wqxr-blog/');
      cy.get('.channel-title').should('contain', 'WQXR Blog');

      cy.waitForApplication();
      cy.wait('@listenlive-api');
    });
  });
})
