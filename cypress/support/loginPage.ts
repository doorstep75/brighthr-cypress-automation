/**
 * Visits the BrightHR Lite landing page and clicks the "Log in" link.
 * This happens on the main sandbox-app origin.
 */
export const visitLiteAndClickLogin = () => {
  cy.visit('/lite'); // uses baseUrl from config
  cy.contains('a', 'Log in').click(); // takes you to sandbox-login domain
};

/**
 * Handles login inside the sandbox-login.brighthr.com origin.
 * Uses environment variables for credentials.
 */
export const loginOnAuthDomain = (email: string, password: string) => {
  cy.origin(
    'https://sandbox-login.brighthr.com',
    { args: { email, password } },
    ({ email, password }) => {
      cy.url().should('include', '/login'); // verify correct page
      cy.get('#username').type(email); // enter email
      cy.get('#password').type(password, { log: false }); // enter password, hidden in logs
      cy.get('#login').click(); // click Login button
      cy.url().should('include', '/dashboard'); // confirm redirected to dashboard
    },
  );
};
