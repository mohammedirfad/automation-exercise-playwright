# Automation Exercise Playwright Tests

TypeScript Playwright project for the Bug0 take-home assignment.

## What is automated

- Test Case 1: Register User
- Test Case 2: Login User with correct email and password
- Test Case 3: Login User with incorrect email and password
- Test Case 4: Logout User
- Test Case 5: Register User with existing email
- Passmark version of Test Case 3 in `tests/passmark/invalid-login.passmark.spec.ts`

## Setup

```bash
npm install
npx playwright install chromium
```

This local machine already has Chrome installed, so the config defaults to `PLAYWRIGHT_CHANNEL=chrome`. If you want Playwright's bundled Chromium instead, install the browser and set:

```bash
PLAYWRIGHT_CHANNEL=chromium
```

## Run Playwright tests

```bash
npx playwright test
```

## Run Passmark test

Ask the assignment provider for the OpenRouter key, then create `.env` from `.env.example`:

```bash
OPENROUTER_API_KEY=your_key_here
PLAYWRIGHT_CHANNEL=chrome
```

Run:

```bash
npm run test:passmark
```

Do not commit `.env` or any real API key.

## Passing screenshot

The passing test proof is saved at `screenshots/all-5-tests-passed.png`.

## Useful commands

```bash
npm test
npm run test:headed
npm run test:passmark
npm run report
```
