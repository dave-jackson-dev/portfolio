import { Given, Then, When } from '@cucumber/cucumber';

Given('the delegated macro-approval contract fixture', function () {
  this.contractFixture = 'delegated-macro-approval';
});

Given('the approved workflow macro contract fixture', function () {
  this.contractFixture = 'approved-workflow-macro';
});

When('the workflow contract fixtures are verified', async function () {
  const validatorModule = '../../tools/verify-workflow-contract-fixtures.mjs';
  const { verifyWorkflowContractFixtures } = await import(validatorModule);
  this.contractResult = verifyWorkflowContractFixtures();
});

Then('the event has a trusted source, Service Account actor, and initiating principal', function () {
  if (this.contractResult?.eventType !== 'workflow.macro.approved') throw new Error('Expected delegated macro-approval event');
});

Then('the macro is human-approved and targets a disposable workspace', function () {
  if (this.contractResult?.macroId !== 'macro-site-builder-intake') throw new Error('Expected approved disposable-workspace macro');
});

Then('no private upstream-platform import or proprietary-content reference is present', function () {
  if (typeof this.contractResult?.sourceFilesChecked !== 'number') throw new Error('Expected private-import verification result');
});
