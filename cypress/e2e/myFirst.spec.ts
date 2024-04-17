describe('E2E Test', () => {
  beforeEach(() => {
    cy.task('resetDB');
    cy.task('seedDB');
    cy.visit('/');
  });
});
