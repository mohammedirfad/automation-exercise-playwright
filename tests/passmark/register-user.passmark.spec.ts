import { expect, test } from '@playwright/test';
import { configure, runSteps } from 'passmark';

configure({
  ai: {
    gateway: 'openrouter',
  },
});

test.describe('Passmark natural language automation', () => {
  test.skip(!process.env.OPENROUTER_API_KEY, 'Set OPENROUTER_API_KEY in .env to run the Passmark test.');

  test('Test Case 1: Register User using Passmark', async ({ page }) => {
    test.setTimeout(180_000);

    await runSteps({
      page,
      userFlow: 'Automation Exercise register user',
      steps: [
        { description: 'Navigate to http://automationexercise.com' },
        { description: 'Verify that the home page is visible successfully' },
        { description: 'Click the Signup / Login button' },
        { description: 'Verify New User Signup is visible' },
        { description: 'Enter a unique signup name', data: { value: '{{run.fullName}}' } },
        { description: 'Enter a unique signup email address', data: { value: '{{run.email}}' } },
        { description: 'Click the Signup button' },
        { description: 'Verify ENTER ACCOUNT INFORMATION is visible' },
        { description: 'Select title Mr' },
        { description: 'Enter password', data: { value: 'PassmarkTest-123!' } },
        { description: 'Select date of birth day 15, month June, year 1996' },
        { description: 'Select newsletter checkbox' },
        { description: 'Select special offers checkbox' },
        { description: 'Fill first name, last name, company, address, address2, country India, state Karnataka, city Bengaluru, zipcode 560001, and mobile number 9876543210' },
        { description: 'Click Create Account' },
        { description: 'Verify ACCOUNT CREATED is visible' },
        { description: 'Click Continue' },
        { description: 'Verify Logged in as username is visible' },
        { description: 'Click Delete Account' },
        { description: 'Verify ACCOUNT DELETED is visible' },
        { description: 'Click Continue' },
      ],
      assertions: [
        { assertion: 'The account deletion flow completed successfully and the user returned to the site.' },
      ],
      test,
      expect,
    });
  });
});
