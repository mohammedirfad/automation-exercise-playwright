import { expect, type Locator, type Page } from '@playwright/test';
import type { RegistrationUser } from '../fixtures/users';

export class AutomationExerciseApp {
  private networkFiltersReady = false;

  constructor(private readonly page: Page) {}

  async gotoHome(): Promise<void> {
    await this.setupNetworkFilters();
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.dismissCookieOrAdOverlays();
    await this.expectHomePageVisible();
  }

  async expectHomePageVisible(): Promise<void> {
    await expect(this.page).toHaveTitle(/Automation Exercise/);
    await expect(this.signupLoginLink).toBeVisible();
  }

  async openSignupLogin(): Promise<void> {
    await this.clickWithoutNavigationWait(this.signupLoginLink);
    await expect(this.page.getByText('New User Signup!')).toBeVisible();
  }

  async startSignup(user: Pick<RegistrationUser, 'name' | 'email'>): Promise<void> {
    await this.page.locator('[data-qa="signup-name"]').fill(user.name);
    await this.page.locator('[data-qa="signup-email"]').fill(user.email);
    await this.clickWithoutNavigationWait(this.page.locator('[data-qa="signup-button"]'));
  }

  async expectAccountInformationVisible(): Promise<void> {
    await expect(this.page.getByText('Enter Account Information')).toBeVisible();
  }

  async fillAccountInformation(user: RegistrationUser): Promise<void> {
    const titleLocator = user.title === 'Mr' ? this.page.locator('#id_gender1') : this.page.locator('#id_gender2');

    await titleLocator.check();
    await this.page.locator('#name').fill(user.name);
    await expect(this.page.locator('#email')).toHaveValue(user.email);
    await this.page.locator('#password').fill(user.password);
    await this.page.locator('#days').selectOption({ label: user.day });
    await this.page.locator('#months').selectOption({ label: user.month });
    await this.page.locator('#years').selectOption({ label: user.year });
    await this.page.locator('#newsletter').check();
    await this.page.locator('#optin').check();
    await this.page.locator('#first_name').fill(user.firstName);
    await this.page.locator('#last_name').fill(user.lastName);
    await this.page.locator('#company').fill(user.company);
    await this.page.locator('#address1').fill(user.address1);
    await this.page.locator('#address2').fill(user.address2);
    await this.page.locator('#country').selectOption({ label: user.country });
    await this.page.locator('#state').fill(user.state);
    await this.page.locator('#city').fill(user.city);
    await this.page.locator('#zipcode').fill(user.zipcode);
    await this.page.locator('#mobile_number').fill(user.mobileNumber);
  }

  async createAccount(): Promise<void> {
    await this.clickWithoutNavigationWait(this.page.locator('[data-qa="create-account"]'));
    await expect(this.page.locator('[data-qa="account-created"]')).toContainText('Account Created!');
  }

  async continueAfterAccountCreated(): Promise<void> {
    await this.clickWithoutNavigationWait(this.page.locator('[data-qa="continue-button"]'));
  }

  async registerUser(user: RegistrationUser): Promise<void> {
    await this.gotoHome();
    await this.openSignupLogin();
    await this.startSignup(user);
    await this.expectAccountInformationVisible();
    await this.fillAccountInformation(user);
    await this.createAccount();
    await this.continueAfterAccountCreated();
    await this.expectLoggedInAs(user.name);
  }

  async login(email: string, password: string): Promise<void> {
    await expect(this.page.getByText('Login to your account')).toBeVisible();
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.clickWithoutNavigationWait(this.page.locator('[data-qa="login-button"]'));
  }

  async expectLoginError(): Promise<void> {
    await expect(this.page.getByText('Your email or password is incorrect!')).toBeVisible();
  }

  async expectExistingEmailError(): Promise<void> {
    await expect(this.page.getByText('Email Address already exist!')).toBeVisible();
  }

  async expectLoggedInAs(name: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${name}`)).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.clickWithoutNavigationWait(this.page.getByRole('link', { name: 'Logout' }));
    await expect(this.page.getByText('Login to your account')).toBeVisible();
  }

  async deleteAccount(): Promise<void> {
    await this.clickWithoutNavigationWait(this.page.getByRole('link', { name: 'Delete Account' }));
    await expect(this.page.locator('[data-qa="account-deleted"]')).toContainText('Account Deleted!');
    await this.clickWithoutNavigationWait(this.page.locator('[data-qa="continue-button"]'));
  }

  private get signupLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Signup / Login' });
  }

  private async dismissCookieOrAdOverlays(): Promise<void> {
    await this.page.keyboard.press('Escape').catch(() => undefined);

    const consentButtons = this.page
      .getByRole('button', { name: /^(accept|agree|consent|got it|close)$/i })
      .or(this.page.getByRole('link', { name: /^(accept|agree|close)$/i }));

    if (await consentButtons.first().isVisible().catch(() => false)) {
      await consentButtons.first().click().catch(() => undefined);
    }
  }

  private async clickWithoutNavigationWait(locator: Locator): Promise<void> {
    await locator.click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => undefined);
    await this.dismissCookieOrAdOverlays();
  }

  private async setupNetworkFilters(): Promise<void> {
    if (this.networkFiltersReady) {
      return;
    }

    this.networkFiltersReady = true;

    await this.page.route('**/*', async (route) => {
      const request = route.request();
      const url = request.url();
      const resourceType = request.resourceType();
      const blockedResourceTypes = new Set(['image', 'media', 'font']);
      const blockedHosts = [
        'doubleclick.net',
        'googlesyndication.com',
        'googletagmanager.com',
        'google-analytics.com',
        'googleadservices.com',
        'facebook.net',
        'youtube.com',
      ];

      if (blockedResourceTypes.has(resourceType) || blockedHosts.some((host) => url.includes(host))) {
        await route.abort();
        return;
      }

      await route.continue();
    });
  }
}
