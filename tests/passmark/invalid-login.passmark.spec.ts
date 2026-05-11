import { expect, test } from '@playwright/test';
import { configure, runSteps } from 'passmark';

configure({
  ai: {
    gateway: 'openrouter',
  },
});

test.describe('Passmark natural language automation', () => {
  test.skip(!process.env.OPENROUTER_API_KEY, 'Set OPENROUTER_API_KEY in .env to run the Passmark test.');

  test('Test Case 3: Login User with incorrect email and password using Passmark', async ({ page }) => {
    test.setTimeout(90_000);

    await runSteps({
      page,
      userFlow: 'Automation Exercise invalid login',
      steps: [
        { description: 'Navigate to https://automationexercise.com' },
        { description: 'Verify that the home page is visible successfully' },
        { description: 'Click the Signup / Login button' },
        { description: 'Verify Login to your account is visible' },
        { description: 'Enter incorrect email in the login email field', data: { value: 'wrong-user@example.com' } },
        { description: 'Enter incorrect password in the login password field', data: { value: 'WrongPassword123!' } },
        { description: 'Click the Login button' },
      ],
      assertions: [
        { assertion: 'The page shows the error message Your email or password is incorrect!' },
      ],
      test,
      expect,
    });
  });
});
