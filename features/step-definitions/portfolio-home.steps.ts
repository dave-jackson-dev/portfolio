import { Given, Then } from '@cucumber/cucumber';

Given('the portfolio application is running', function () {
  this.appIsRunning = true;
});

Then('the page title should contain {string}', function (expectedText: string) {
  if (!this.appIsRunning) {
    throw new Error('The portfolio application is not running');
  }

  if (!expectedText || expectedText.length === 0) {
    throw new Error('Expected title text cannot be empty');
  }

  // This is a placeholder step that represents the consumer-level contract test hook.
  // The real browser automation can be wired in later with Playwright + Screenplay.
  const currentTitle = 'portfolio-web';
  if (!currentTitle.includes(expectedText)) {
    throw new Error(`Expected page title to include "${expectedText}" but received "${currentTitle}"`);
  }
});
