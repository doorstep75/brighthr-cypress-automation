# BrightHR Cypress Automation Demo

This project demonstrates automated end-to-end tests written in **Cypress** with **TypeScript**, focused on the **BrightHR Lite** environment.

It’s built to reflect real-world QA scenarios — modular, reusable, and clear.  
Each test uses a **Page Object Model (POM)** structure for maintainability and scalability.

---

## ⚙️ Tech Stack

- **Cypress** (TypeScript)
- **Node.js / npm**
- **Page Object Model (POM)** pattern for structure
- **Secure environment variable handling** for login credentials
- **Modular helper functions** for reusability and readability

---

## 🧩 Project Structure

```bash
BrightHR/
├── .vscode/
│   └── settings.json                → VS Code formatting settings (2 spaces)
├── docs/                            → Project documentation and QA notes
│   └── QA-BUGLOG.md                 → Log of test bugs/queries
├── cypress/
│   ├── e2e/                         → End-to-end test specs
│   │   ├── employee-hub.cy.ts       → Contains the core Employee hub tests
│   ├── fixtures/                    → Static test data (if required)
│   ├── support/
│   │   ├── employeesPage.ts         → Page Object: Employee modal actions/
│   │   ├── dashboardPage.ts         → Page Object: Dashboard layout & navigatio
│   │   ├── loginPage.ts             → Login and authentication helpers
│   │   ├── data/
│   │   │   └── namePool.ts          → Simple random name/email generators
│   │   └── commands.ts              → Custom Cypress commands (optional)
├── scripts/                         → utility scripts that run during install
│   └── setup-env.js                 → postinstall script runs a setup message
├── .prettierrc                      → Prettier formatting rules 
├── cypress.config.ts                → Main Cypress config file
├── cypress.env.example.json         → Example env vars (safe to share)
├── cypress.env.json                 → Local secrets file (ignored by Git)
├── package.json                     → Project dependencies and scripts
├── tsconfig.json                    → TypeScript compiler settings
└── .gitignore                       → Excludes secrets and generated files
```

---

## 🧰 Setup Instructions

### 🧩 Prerequisites

Before setting up the project, ensure you have the following installed and available:

- The project path/folder setup on your computer
- Git (for cloning repositories)
- Node.js (LTS version, includes npm)
- A code editor or IDE (note VS Code has been used throughout this project)

Confirm installation with:

```bash
git --version
node -v
npm -v 
```

### 1️⃣ Clone the repository

> Use terminal (or equivalent to navigate to your project folder)

```bash
git clone https://github.com/doorstep75/brighthr-cypress-automation.git
cd brighthr-cypress-automation
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Copy the example file and update it with your sandbox credentials:

#### Terminal command

```bash
cp cypress.env.example.json cypress.env.json
```

#### If not terminal command then copy or via explorer/finder/IDE

OR copy and rename **cypress.env.example.json** to **cypress.env.json** through your IDE

Then edit the new `cypress.env.json` file and add your sandbox login details:

```json
{
  "BRIGHTHR_EMAIL": "your.email@domain.com",
  "BRIGHTHR_PW": "yourPassword123!"
}
```

> ⚠️ Do **not** commit this file to GitHub.  
> It contains credentials and is already ignored via `.gitignore`.

### 4️⃣ Run Cypress in interactive mode (recommended)

```bash
npx cypress open
```

### Headless run (not recommended)

```bash
npx cypress run
```

## 🧪 Current Test Coverage

✅ Authentication & Session Handling
-Secure login via sandbox-auth domain
-Session caching using cy.session()

✅ Dashboard Tests
-Responsive layout checks (mobile vs desktop)
-Sidebar visibility verification

✅ Employee Hub & Add Employee Modal

- Field validation (inline red borders, disabled Save)
- Positive “happy path” flow for adding multiple employees
- Form completeness and modal state checks
- Success modal content verification

✅ Helpers & Utilities

- Dynamic data generators (namePool.ts)
- Shared form fill and assertion helpers

---

## 🛡️ Security Notes

- Sensitive credentials are stored locally in `cypress.env.json`, not in source control.
- The example file is for structure reference only.
- No secrets are included in Git history.

---

## 🧭 Recommended VS Code Extensions

- ✅ Cypress Helper
- ✅ ESLint / Prettier
- ✅ TypeScript Hero
- ✅ GitLens

## 🧹 Code Formatting and Linting

This project uses Prettier and VS Code workspace settings to keep formatting consistent. The .vscode folder has been allowed therefore to assist with demos.

### Configuration files

- .vscode/settings.json → sets 2-space indentation, format on save, and spaces instead of tabs
- .prettierrc → defines Prettier rules (2 spaces, single quotes, 100 char line width)

## ✅ Summary

This demo project is designed to showcase:

- Clean, readable TypeScript test automation
- Secure handling of environment variables
- Realistic test data and modular design
- Readable, maintainable TypeScript test code
- Best-practice Cypress structure suitable for enterprise QA

---

**Created by:** Darren Hall
**Role:** Senior Test Analyst / QA Engineer  
**Purpose:** Automation testing demonstration
