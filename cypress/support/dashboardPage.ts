// ============================================================================
// Page Object: DashboardPage
// Focus: Layout bits (sidebar, Employees link), basic page assertions
// ============================================================================

export class DashboardPage {
  // ==========================================================================
  // ASSERTIONS
  // ==========================================================================

  /** Assert the Employees link is present/visible (desktop layout) */
  assertEmployeesLinkVisible() {
    cy.contains('a', 'Employees', { timeout: 5000 }).should('be.visible');
  }

  /** Assert the Employees link is not usable in mobile layout:
   *  - if it’s not in the DOM: pass
   *  - if it’s in the DOM but hidden: also a pass
   */
  assertEmployeesLinkHidden() {
    cy.get('body').then(($body) => {
      // Use jQuery to search DOM without creating a Cypress command subject
      const $el = $body.find('a:contains("Employees")');

      if ($el.length === 0) {
        // Truly not in the DOM
        expect($el.length, 'Employees link not present in DOM').to.eq(0);
      } else {
        // Present but should be hidden in mobile layout
        const isVisible = Cypress.$($el).is(':visible');
        expect(isVisible, 'Employees link should be hidden').to.eq(false);
      }
    });
  }

  /**
   * Convenience method: verify that we’re on the dashboard.
   */
  verifyOnDashboard() {
    cy.url().should('include', '/dashboard');
    cy.log('✅ Checked the URL to confirm on the dashboard page ✅');
  }

  // ==========================================================================
  // SELECTORS / GETTERS
  // ==========================================================================

  /**
   * Gets the <a> link for 'Employees' in the sidebar navigation.
   * Allow a timeout in order for sidebar to load.
   */
  get employeesLink() {
    return cy.contains('a', 'Employees', { timeout: 5000 });
  }
}

// Export instance for easy import
export const dashboardPage = new DashboardPage();
