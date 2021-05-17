// https://docs.cypress.io/api/introduction/api.html

describe('lightGallery', () => {
    it('Should render captions', () => {
        cy.visit('/');
        cy.contains('h4', 'Photo by - Diego Guzmán');
    });
});
