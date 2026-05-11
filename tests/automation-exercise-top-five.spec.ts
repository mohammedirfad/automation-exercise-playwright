import { test } from '@playwright/test';
import { createRegistrationUser } from './fixtures/users';
import { AutomationExerciseApp } from './pages/AutomationExerciseApp';

test.describe('Automation Exercise top 5 test cases', () => {
  test('Test Case 1: Register User', async ({ page }, testInfo) => {
    const app = new AutomationExerciseApp(page);
    const user = createRegistrationUser(testInfo.title);

    await app.registerUser(user);
    await app.deleteAccount();
  });

  test('Test Case 2: Login User with correct email and password', async ({ page }, testInfo) => {
    const app = new AutomationExerciseApp(page);
    const user = createRegistrationUser(testInfo.title);

    await app.registerUser(user);
    await app.logout();
    await app.login(user.email, user.password);
    await app.expectLoggedInAs(user.name);
    await app.deleteAccount();
  });

  test('Test Case 3: Login User with incorrect email and password', async ({ page }, testInfo) => {
    const app = new AutomationExerciseApp(page);
    const user = createRegistrationUser(testInfo.title);

    await app.gotoHome();
    await app.openSignupLogin();
    await app.login(user.email, 'DefinitelyWrongPassword!');
    await app.expectLoginError();
  });

  test('Test Case 4: Logout User', async ({ page }, testInfo) => {
    const app = new AutomationExerciseApp(page);
    const user = createRegistrationUser(testInfo.title);

    await app.registerUser(user);
    await app.logout();
    await app.login(user.email, user.password);
    await app.deleteAccount();
  });

  test('Test Case 5: Register User with existing email', async ({ page }, testInfo) => {
    const app = new AutomationExerciseApp(page);
    const user = createRegistrationUser(testInfo.title);

    await app.registerUser(user);
    await app.logout();
    await app.startSignup({ name: `${user.name} Duplicate`, email: user.email });
    await app.expectExistingEmailError();
    await app.login(user.email, user.password);
    await app.deleteAccount();
  });
});
