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
    test.setTimeout(180_000);

    await runSteps({
      page,
      userFlow: 'Automation Exercise invalid login',
      steps: [
        { description: 'Navigate to https://automationexercise.com and verify the home page is visible' },
        { description: 'Click the Signup / Login button and verify Login to your account is visible' },
        {
          description: 'Enter incorrect login credentials and click the Login button',
          data: {
            email: 'wrong-user@example.com',
            password: 'WrongPassword123!',
          },
        },
      ],
      test,
    });

    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  });
});
