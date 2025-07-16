// homepage.cy.js

describe('Homepage', () => {
  it('should load and display the main heading', () => {
    cy.visit('http://localhost:3000');
    // Adjust selector/text as needed for your homepage
    cy.contains('button', 'Button').should('be.visible');
  });
}); 