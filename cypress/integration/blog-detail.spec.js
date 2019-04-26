describe('Blog detail page', () => {
  ['true','false'].forEach(fastbootStatus => {
    it(`displays the blog detail page (fastboot=${fastbootStatus})`, () => {
      cy.fastbootCheck(`/blogs/wqxr-blog`, fastbootStatus);

      cy.visit(`/blogs/wqxr-blog?fastboot=${fastbootStatus}`);

      cy.waitForApplication();      
      cy.wait('@listenlive-api');
    });
  });
})
