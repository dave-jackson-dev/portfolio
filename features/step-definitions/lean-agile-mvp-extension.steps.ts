import { Given, Then, When } from '@cucumber/cucumber';

async function extension() {
  const modulePath = '../../libs/lean-agile-mvp-workflow/src/lib/lean-agile-mvp-workflow.ts';
  return import(modulePath);
}

Given('a Portfolio Lean-Agile MVP workflow with a testable hypothesis', async function () {
  const { createLeanAgileMvpWorkflow } = await extension();
  this.mvpWorkflow = createLeanAgileMvpWorkflow({
    workflowId: 'mvp-workflow-fixture', correlationId: 'mvp-correlation-fixture', initiativeId: 'mvp-initiative-fixture',
    organizationId: 'org-portfolio-demo', principalId: 'principal-portfolio-demo', hypothesis: 'A guided Site Builder increases completed portfolio drafts.',
  });
});

When('an authorized principal starts the experiment', async function () {
  const { transitionLeanAgileMvpWorkflow } = await extension();
  this.mvpWorkflow = transitionLeanAgileMvpWorkflow(this.mvpWorkflow, { to: 'experiment', actor: { kind: 'principal', id: 'principal-portfolio-demo' } });
});

When('the experiment records immutable evidence', async function () {
  const { transitionLeanAgileMvpWorkflow } = await extension();
  this.mvpWorkflow = transitionLeanAgileMvpWorkflow(this.mvpWorkflow, { to: 'evidence', actor: { kind: 'service-account', id: 'sa-workflow-engine' }, evidenceReferences: ['evidence:site-builder-fixture:1'] });
});

When('the evidence is reviewed into an outcome', async function () {
  const { transitionLeanAgileMvpWorkflow } = await extension();
  this.mvpWorkflow = transitionLeanAgileMvpWorkflow(this.mvpWorkflow, { to: 'outcome', actor: { kind: 'principal', id: 'principal-portfolio-demo' } });
});

Then('the workflow state is outcome', function () {
  if (this.mvpWorkflow.state !== 'outcome') throw new Error('Expected MVP workflow outcome state');
});

Given('a Portfolio Lean-Agile MVP workflow ready for an outcome decision', async function () {
  const { createLeanAgileMvpWorkflow, transitionLeanAgileMvpWorkflow } = await extension();
  let workflow = createLeanAgileMvpWorkflow({
    workflowId: 'mvp-decision-fixture', correlationId: 'mvp-decision-correlation', initiativeId: 'mvp-decision-initiative',
    organizationId: 'org-portfolio-demo', principalId: 'principal-portfolio-demo', hypothesis: 'A measurable experiment can inform a decision.',
  });
  workflow = transitionLeanAgileMvpWorkflow(workflow, { to: 'experiment', actor: { kind: 'principal', id: 'principal-portfolio-demo' } });
  workflow = transitionLeanAgileMvpWorkflow(workflow, { to: 'evidence', actor: { kind: 'service-account', id: 'sa-workflow-engine' }, evidenceReferences: ['evidence:decision-fixture:1'] });
  this.mvpWorkflow = transitionLeanAgileMvpWorkflow(workflow, { to: 'outcome', actor: { kind: 'principal', id: 'principal-portfolio-demo' } });
});

When('a Service Account records a persevere decision', async function () {
  const { transitionLeanAgileMvpWorkflow } = await extension();
  try {
    transitionLeanAgileMvpWorkflow(this.mvpWorkflow, { to: 'persevere', actor: { kind: 'service-account', id: 'sa-workflow-engine' } });
  } catch (error) {
    this.mvpTransitionError = error;
  }
});

Then('the MVP transition is rejected', function () {
  if (!(this.mvpTransitionError instanceof Error) || !this.mvpTransitionError.message.includes('human principal')) {
    throw new Error('Expected Service Account decision to be rejected');
  }
});

When('an authorized principal returns a pivot without a revised hypothesis', async function () {
  const { transitionLeanAgileMvpWorkflow } = await extension();
  this.mvpWorkflow = transitionLeanAgileMvpWorkflow(this.mvpWorkflow, {
    to: 'pivot', actor: { kind: 'principal', id: 'principal-portfolio-demo' },
  });
  try {
    transitionLeanAgileMvpWorkflow(this.mvpWorkflow, {
      to: 'hypothesis', actor: { kind: 'principal', id: 'principal-portfolio-demo' },
    });
  } catch (error) {
    this.mvpTransitionError = error;
  }
});

Then('the MVP transition is rejected because a revised hypothesis is required', function () {
  if (!(this.mvpTransitionError instanceof Error) || !this.mvpTransitionError.message.includes('revised testable hypothesis')) {
    throw new Error('Expected pivot without a revised hypothesis to be rejected');
  }
});

Given('a Portfolio Lean-Agile MVP extension with an accepting public client', async function () {
  const adapterModulePath = '../../libs/portfolio-workflow-adapter/src/lib/portfolio-workflow-adapter.ts';
  const { createPortfolioWorkflowAdapter } = await import(adapterModulePath);
  const { createLeanAgileMvpExtension, createLeanAgileMvpWorkflow } = await extension();
  this.publicRequests = [];
  const adapter = createPortfolioWorkflowAdapter({
    execute: async (request: unknown) => {
      this.publicRequests.push(request);
      return {
        envelopeVersion: '1.0.0', correlationId: 'mvp-recording-correlation', command: 'workflow extension transition',
        workflowId: 'mvp-recording-workflow', schemaVersion: '1.0.0', resultStatus: 'success', data: { recorded: true },
      };
    },
  });
  this.mvpExtension = createLeanAgileMvpExtension(adapter);
  this.mvpWorkflow = createLeanAgileMvpWorkflow({
    workflowId: 'mvp-recording-workflow', correlationId: 'mvp-recording-correlation', initiativeId: 'mvp-recording-initiative',
    organizationId: 'org-portfolio-demo', principalId: 'principal-portfolio-demo', hypothesis: 'A public transition reaches the engine contract.',
  });
});

When('the extension records an experiment transition', async function () {
  const result = await this.mvpExtension.transitionAndRecord(this.mvpWorkflow, {
    to: 'experiment', actor: { kind: 'principal', id: 'principal-portfolio-demo' },
  });
  this.mvpWorkflow = result.workflow;
});

Then('the public client receives the versioned MVP extension transition', function () {
  const request = this.publicRequests[0] as { command?: string; input?: { transition?: { extensionId?: string; extensionSchemaVersion?: string; from?: string; to?: string } } };
  if (request?.command !== 'workflow extension transition' || request.input?.transition?.extensionId !== 'portfolio.lean-agile-mvp' || request.input.transition.extensionSchemaVersion !== '1.0.0' || request.input.transition.from !== 'hypothesis' || request.input.transition.to !== 'experiment') {
    throw new Error('Expected a versioned Lean-Agile MVP public transition request');
  }
});
