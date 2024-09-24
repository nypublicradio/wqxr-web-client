// describe('404 page', () => {
//   ['false'].forEach(fastbootStatus => {
//     it(`displays the 404 page (fastboot=${fastbootStatus})`, () => {
//       cy.fastbootCheck(`/bad-path-that-should-404`, fastbootStatus, false);
//
//       cy.request({
//         url: `/bad-path-that-should-404/?fastboot=${fastbootStatus}`,
//         failOnStatusCode: false})
//       .should((response) => {
//         expect(response.status).to.eq(404)
//       });
//
//       cy.visit({
//         url: `/bad-path-that-should-404/?fastboot=${fastbootStatus}`,
//         failOnStatusCode: false});
//       cy.location('pathname').should('eq', '/bad-path-that-should-404/');
//       cy.get('.error-title').should('contain', "missing");
//
//       cy.waitForApplication();
//       cy.wait('@platform-events');
//     });
//   });
// })
