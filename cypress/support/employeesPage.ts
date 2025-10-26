// ============================================================================
// Page Object: EmployeesPage
// Focus: “Add employee” modal (fields, actions, and assertions)
// ============================================================================

export const errorColour = 'rgb(229, 26, 26)'; // Confirmed BrightHR validation red border

/** Shape for filling the add-employee form in one call. */
export interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  startDay?: number; // day-of-month for the visible calendar that becomes visible
}

export class EmployeesPage {
  // ==========================================================================
  // SELECTORS / GETTERS
  // ==========================================================================

  /** Primary “Add employee” button on the Employee Hub page. */
  get addEmployeeButton() {
    return cy.contains('button', 'Add employee', { timeout: 5000 });
  }

  /** Modal title: “Add new employee”. Used to confirm modal is open. */
  get modalTitle() {
    return cy.contains('h2', 'Add new employee', { timeout: 5000 });
  }

  /** Modal “Save new employee” button. */
  get saveButton() {
    return cy.contains('button', 'Save new employee', { timeout: 5000 });
  }

  /** Modal “Cancel” button. */
  get cancelButton() {
    return cy.contains('button', 'Cancel', { timeout: 5000 });
  }

  // -- Inputs ---------------------------------------------------------------
  get firstName() {
    return cy.get('#firstName');
  }
  get lastName() {
    return cy.get('#lastName');
  }
  get email() {
    return cy.get('#email');
  }
  get phoneNumber() {
    return cy.get('#phoneNumber');
  }
  get jobTitle() {
    return cy.get('#jobTitle');
  }
  get startDateBox() {
    return cy.get('#startDate', { timeout: 5000 });
  }
  get registrationCb() {
    return cy.get('#registrationEmail');
  }

  // ==========================================================================
  // ACTIONS (USER FLOWS)
  // ==========================================================================

  /**
   * Opens the “Add employee” modal and verifies it is visible.
   */
  openAddEmployeeModal() {
    this.addEmployeeButton.should('be.visible').click();
    this.modalTitle.should('be.visible');
  }

  /**
   * Types deliberately invalid values into the required fields
   * and triggers validation by blurring each field.
   */
  typeInvalidNamesAndEmail(tooLong: string, invalidEmail: string) {
    this.firstName.type(tooLong).blur();
    this.lastName.type(tooLong).blur();
    this.email.type(invalidEmail).blur();
  }

  /**
   * Makes the email valid by appending extra characters and blurring.
   */
  makeEmailValidByTyping(extra: string) {
    this.email.type(extra).blur();
  }

  /**
   * Edits last name by one character (backspace) and blurs.
   */
  backspaceLastNameOnce() {
    this.lastName.type('{backspace}').blur();
  }

  /**
   * Edits first name by one character (backspace) and blurs.
   */
  backspaceFirstNameOnce() {
    this.firstName.type('{backspace}').blur();
  }

  /**
   * Types only mandatory fields: first name, last name, email.
   */
  typeMandatoryFields(firstName: string, lastName: string, email: string) {
    this.firstName.clear().type(firstName);
    this.lastName.clear().type(lastName);
    this.email.clear().type(email);
  }

  /**
   * Types only optional fields when values are provided.
   */
  typeOptionalFields(phone?: string, jobTitle?: string) {
    if (phone) this.phoneNumber.clear().type(phone);
    if (jobTitle) this.jobTitle.clear().type(jobTitle);
  }

  /**
   * Fills the entire form (mandatory + optional + date if provided).
   */
  fillEmployeeForm(data: EmployeeData) {
    this.typeMandatoryFields(data.firstName, data.lastName, data.email);
    this.typeOptionalFields(data.phone, data.jobTitle);
    if (typeof data.startDay === 'number') {
      this.selectStartDateByDay(data.startDay); // you already have this helper
    }
  }

  /**
   * Clicks the “Add another employee” button on the success modal.
   */
  clickAddAnotherEmployee() {
    cy.contains('button', 'Add another employee', { timeout: 10000 }).should('be.visible').click();
  }

  /**
   * Selects a start date by day number (e.g., 7) in the currently visible month.
   * If you need a specific month/year, can extend this to navigate header controls.
   */
  selectStartDateByDay(day: number) {
    cy.log(`📅 Selecting start date (day): ${day}`);

    // Open the date picker via its inner trigger
    this.startDateBox
      .scrollIntoView()
      .find('[data-testid="input-selector"]')
      .click({ force: true });

    // Click a matching, enabled day in the panel
    cy.get('[data-testid="daypicker-panel"]', { timeout: 5000 })
      .should('be.visible')
      .within(() => {
        cy.get('.DayPicker-Day[aria-disabled="false"] .DayPicker-Day-Number')
          .contains(new RegExp(`^${day}$`))
          .click({ force: true });
      });

    cy.log(`✅ Start date selected: day ${day}`);
  }

  /**
   * Clicks “Save new employee”.
   */
  clickSave() {
    this.saveButton.should('be.enabled').click();
  }

  /**
   * Clicks the close (X) button on the success modal.
   */
  closeSuccessModalOnly() {
    cy.get('button[aria-label="Close modal"]', { timeout: 5000 }).should('be.visible').click();

    cy.log('✅ Closed the success modal');
  }

  /**
   * Toggles the “Send registration email” checkbox OFF then ON,
   * asserting the state each time.
   */
  toggleRegistrationCheckbox() {
    this.registrationCb.should('be.checked');
    cy.get('label[for="registrationEmail"]').click();
    this.registrationCb.should('not.be.checked');
    cy.get('label[for="registrationEmail"]').click();
    this.registrationCb.should('be.checked');
  }

  // ==========================================================================
  // ASSERTIONS (STATE / UI VERIFICATION)
  // ==========================================================================

  /**
   * Asserts Save button is visible and disabled.
   */
  assertSaveDisabled() {
    this.saveButton.should('be.visible').and('be.disabled');
  }

  /**
   * Asserts initial field values (empty or default) and checkbox is checked.
   */
  assertFieldsEmptyOrDefault() {
    this.firstName.should('have.value', '');
    this.lastName.should('have.value', '');
    this.email.should('have.value', '');
    this.phoneNumber.should('have.value', '');
    this.jobTitle.should('have.value', '');

    // Start date is a custom control; check the placeholder text
    this.startDateBox.scrollIntoView().should('be.visible').and('contain.text', 'Select date');

    // Checkbox default (checked)
    this.registrationCb.should('be.checked');
  }

  /**
   * Asserts Cancel button is visible and “clickable-looking”.
   */
  assertCancelEnabled() {
    this.cancelButton
      .should('be.visible')
      .and('not.be.disabled')
      .and('have.css', 'cursor', 'pointer');
  }

  /**
   * Asserts success modal shows correct content for the new employee
   * and expected actions (add another / Go to profile / Go to rotas)
   */
  assertSuccessModalFor(firstName: string) {
    cy.get('[role="dialog"]', { timeout: 5000 })
      .should('be.visible')
      .within(() => {
        // Header/title contains "Success"
        cy.contains('h1, h2, h3', /success/i).should('be.visible');

        // Body text includes "<firstName> added to BrightHR Lite"
        cy.contains(new RegExp(`${firstName}\\s+added\\s+to\\s+BrightHR\\s+Lite`, 'i')).should(
          'be.visible',
        );

        // Actions (button + two links)
        cy.contains('button', 'Add another employee').should('be.visible');
        cy.contains('a', 'Go to profile').should('be.visible');
        cy.contains('a', 'Go to rotas').should('be.visible');
      });

    cy.log('✅ Success modal verified (header, message, and action links/buttons)');
  }

  /**
   * Verifies the user is back on the Employee Hub page after closing a modal.
   */
  assertOnEmployeeHubPage() {
    cy.url().should('include', '/employee-hub');
    cy.contains('button', 'Add employee', { timeout: 5000 }).should('be.visible');
  }

  /**
   * Asserts that the given employee full names appear in the Employees list.
   * Accepts an array of names to verify.
   */
  assertEmployeesVisible(employeeNames: string[]) {
    employeeNames.forEach((fullName) => {
      cy.contains(fullName, { timeout: 5000 }).should('be.visible');
    });
  }

  // ==========================================================================
  // VALIDATION HELPERS (NEGATIVE / ERROR STATES)
  // ==========================================================================

  /**
   * Triggers blur on key input fields and checks for red border
   */
  validateFieldBordersRedOnBlur() {
    const redBorder = errorColour; // errorColour is at the top of the page

    const fields = ['#firstName', '#lastName', '#email'];

    fields.forEach((selector) => {
      cy.get(selector).focus().blur().should('have.css', 'border-color', redBorder);
    });
  }

  /**
   * Asserts all three required fields currently show the red error border.
   */
  expectThreeRequiredRed() {
    this.firstName.should('have.css', 'border-color', errorColour).and('be.visible');
    this.lastName.should('have.css', 'border-color', errorColour).and('be.visible');
    this.email.should('have.css', 'border-color', errorColour).and('be.visible');
  }

  /** Asserts email input is no longer red. */
  expectEmailNotRed() {
    this.email.should('not.have.css', 'border-color', errorColour);
  }

  /** Asserts last name input is no longer red. */
  expectLastNameNotRed() {
    this.lastName.should('not.have.css', 'border-color', errorColour);
  }

  /** Asserts first name input is no longer red. */
  expectFirstNameNotRed() {
    this.firstName.should('not.have.css', 'border-color', errorColour);
  }

  // ==========================================================================
  // SAVE STATE HELPERS
  // ==========================================================================

  /** Asserts Save is visible and disabled. */
  expectSaveDisabled() {
    this.saveButton.should('be.visible').and('be.disabled');
  }

  /** Asserts Save is visible and enabled. */
  expectSaveEnabled() {
    this.saveButton.should('be.visible').and('be.enabled');
  }
}

// Export instance for easy import
export const employeesPage = new EmployeesPage();
