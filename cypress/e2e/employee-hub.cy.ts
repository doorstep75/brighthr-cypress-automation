import { dashboardPage } from '../support/dashboardPage';
import {
	buildEmail,
	FIRST_NAMES,
	LAST_NAMES,
	pick,
} from '../support/data/namePool';
import { employeesPage } from '../support/employeesPage';
import {
	loginOnAuthDomain,
	visitLiteAndClickLogin,
} from '../support/loginPage';

describe('BrightHR Lite Employee tests', () => {
  beforeEach(() => {
    cy.log('ℹ️ Starting beforeEach steps with session caching ℹ️');

    // Wrap login steps in cy.session — this caches cookies/localStorage
    cy.session('brighthr-session', () => {
      visitLiteAndClickLogin();
      loginOnAuthDomain(Cypress.env('BRIGHTHR_EMAIL'), Cypress.env('BRIGHTHR_PW'));
      cy.url().should('include', '/dashboard');
    });

    // After session restore, go straight to dashboard
    cy.visit('/dashboard');
    cy.log('✅ Logged in and ready for test ✅');
  });

  it('991px mobile layout with kebab menu', () => {
    // set a viewport that triggers mobile display
    cy.log('🔎 Setting viewport to 991px so mobile view is displayed 🔍');
    cy.viewport(991, 800);
    // quick check to confirm it's on the dashboard before tests
    dashboardPage.verifyOnDashboard();

    // Employees link should NOT appear as sidebar on mobile view
    dashboardPage.assertEmployeesLinkHidden();
    cy.log('✅ Mobile view displayed | Employees link therefore hidden within kebab menu ✅');
    cy.log('✅ Mobile view check complete, moving onto the next test ✅');
  });

  it('992px desktop layout: Employees nav visible with side bar', () => {
    // set a viewport that triggers desktop display
    cy.log('🔎 Setting viewport to 992px so desktop view is displayed 🔍');
    cy.viewport(992, 800);
    dashboardPage.verifyOnDashboard();

    // Employees link should now be visible in desktop layout
    dashboardPage.employeesLink.should('be.visible');
    cy.log(
      '✅ Employees link visible | sidebar is correctly displayed to left side on desktop view ✅',
    );
    cy.log('✅ Desktop view check complete, moving onto the next test ✅');
  });

  it('Employees modal check for each field input', () => {
    // Confirm dashboard is in view
    dashboardPage.verifyOnDashboard();

    // Click employees sidebar
    dashboardPage.employeesLink.should('be.visible').click();
    cy.log('✅ Employees link is visible ✅');

    // confirm employee hub URL is visible
    cy.url().should('include', '/employee-hub');
    cy.log('✅ URL contains "employee-hub" to confirm we are on employee hub page ✅');

    // Open modal
    cy.log('ℹ️ Opening the Add employee modal ℹ️');
    employeesPage.openAddEmployeeModal();

    // Assertion: save is disabled
    employeesPage.assertSaveDisabled();
    cy.log('✅ Save new employee button present but disabled until mandatory fields populated ✅');
    // all employee input fields show as empty when first opened (bar start date)
    employeesPage.assertFieldsEmptyOrDefault();
    cy.log(
      '✅ All input fields start as empty other than start date containg "Select date" placeholder ✅',
    );
    // cancel is enabled and can be clicked
    employeesPage.assertCancelEnabled();

    // validation: mandatory fields change to red when empty and clicked away from
    employeesPage.validateFieldBordersRedOnBlur();
    cy.log('✅ Mandatory fields display red box when clicked away from and not populated ✅');
    cy.log(
      '✅ Add employee modal checks complete; all input fields are present; moving onto the next test ✅',
    );
  });

  it('Validation tests on mandatory fields | invalid email | >50 characters in first and last name fields | resolve validation errors', () => {
    cy.log('ℹ️ Starting from dashboard and opening the Add Employee modal ℹ️');
    dashboardPage.verifyOnDashboard();
    dashboardPage.employeesLink.should('be.visible').click();
    cy.url().should('include', '/employee-hub');
    employeesPage.openAddEmployeeModal();
    cy.log('✅ Opened the Employee Modal | adding invalid data next ✅');

    // Define invalid data
    const tooLong = 'A'.repeat(51);
    const invalidEmail = 'invalid.email@domain.';

    cy.log('ℹ️ Adding in invalid first name, last name and email | expecting validation flags ℹ️');
    employeesPage.typeInvalidNamesAndEmail(tooLong, invalidEmail);
    employeesPage.expectThreeRequiredRed();

    employeesPage.expectSaveDisabled();
    cy.log('✅ All invalid fields red; Save disabled ✅');

    cy.log('ℹ️ Addressing the error in mandatory email field ℹ️');
    employeesPage.makeEmailValidByTyping('o'); // now domain.co
    employeesPage.expectEmailNotRed();
    employeesPage.expectSaveDisabled();
    cy.log('✅ Email fixed; Save still disabled (name fields too long) ✅');

    cy.log('ℹ️ Addressing the error in last name field ℹ️');
    employeesPage.backspaceLastNameOnce();
    employeesPage.expectLastNameNotRed();
    employeesPage.expectSaveDisabled();
    cy.log('✅ Last name fixed; Save still disabled (first name too long) ✅');

    cy.log('ℹ️ Addressing the error in first name field ℹ️');
    employeesPage.backspaceFirstNameOnce();
    employeesPage.expectFirstNameNotRed();
    employeesPage.expectSaveEnabled();
    cy.log('✅ First name fixed; All required fields valid; Save now enabled ✅');

    cy.log('ℹ️ Confirm the checkbox can be toggled ℹ️');
    employeesPage.toggleRegistrationCheckbox();
    cy.log('✅ Checkbox can be toggled on or off (ticked/unticked ✅');
    cy.log('✅ Validation checks complete, moving onto the next test ✅');
  });

  it('happy path adds two employees (filling all fields) and verifies both appear in the employees list', () => {
    cy.log('ℹ️ Starting from dashboard and opening the Add Employee modal ℹ️');
    dashboardPage.verifyOnDashboard();

    // ---- Test data ----
    const emp1FirstName = pick(FIRST_NAMES);
    const emp1LastName = pick(LAST_NAMES);
    const emp1Email = buildEmail(emp1FirstName, emp1LastName);

    const emp2FirstName = pick(FIRST_NAMES);
    const emp2LastName = pick(LAST_NAMES);
    const emp2Email = buildEmail(emp2FirstName, emp2LastName);

    const phoneNumber = '07123456789';
    const jobTitle = 'Test Analyst';

    cy.log(`ℹ️ Created Emp1: ${emp1FirstName} ${emp1LastName} (${emp1Email}) ℹ️`);
    cy.log(`ℹ️ Created Emp2: ${emp2FirstName} ${emp2LastName} (${emp2Email}) ℹ️`);

    cy.log(`ℹ️ Ready to open Employees link, then open Add employee modal ℹ️`);
    dashboardPage.employeesLink.should('be.visible').click();
    cy.url().should('include', '/employee-hub');
    employeesPage.openAddEmployeeModal();

    cy.log(`ℹ️ Add employee modal opened; creating Employee 1 using all inputs ℹ️`);
    employeesPage.fillEmployeeForm({
      firstName: emp1FirstName,
      lastName: emp1LastName,
      email: emp1Email,
      phone: phoneNumber,
      jobTitle,
      startDay: 7, // pick 7th of visible month
    });
    cy.log(
      `ℹ️ Saving Employee 1; check success modal content; click add another for next Employee ℹ️`,
    );
    employeesPage.clickSave();
    employeesPage.assertSuccessModalFor(emp1FirstName);
    employeesPage.clickAddAnotherEmployee();

    cy.log(`ℹ️ Creating Employee 2 using all inputs ℹ️`);
    employeesPage.modalTitle.should('be.visible'); // fresh modal
    employeesPage.fillEmployeeForm({
      firstName: emp2FirstName,
      lastName: emp2LastName,
      email: emp2Email,
      phone: phoneNumber,
      jobTitle,
      startDay: 26, // pick 26th of visible month
    });
    cy.log(`ℹ️ Saving Employee 2; check success modal content ℹ️`);
    employeesPage.clickSave();
    employeesPage.assertSuccessModalFor(emp2FirstName);

    cy.log(`ℹ️ Close success modal and confirm redirected to employee hub page ℹ️`);
    employeesPage.closeSuccessModalOnly();
    employeesPage.assertOnEmployeeHubPage();
    cy.log('✅ Closed the modal and back on the Employee hub page ✅');

    cy.log(`ℹ️ Check that both employees were created and are listed on Employee hub page ℹ️`);
    employeesPage.assertEmployeesVisible([
      `${emp1FirstName} ${emp1LastName}`,
      `${emp2FirstName} ${emp2LastName}`,
    ]);

    cy.log('✅ Two employees added and listed successfully');
    cy.log('✅ Happy path of creating two employees is complete ✅');
    cy.log('🎉 All tests are complete 🎉');
  });
});
