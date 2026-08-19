import { Given, Then, When } from '@cucumber/cucumber';
import { createLeanAgileMvpExtension, createLeanAgileMvpWorkflow } from '@lean-agile-mvp/workflow';

Given('a Portfolio Lean-Agile MVP extension with an accepting public client', async function () {
  const adapterModulePath = '../../libs/portfolio-workflow-adapter/src/lib/portfolio-workflow-adapter.ts';
  const { createPortfolioWorkflowAdapter } = await import(adapterModulePath);
  this.publicRequests = [];
  const adapter = createPortfolioWorkflowAdapter({
    execute: async (request: unknown) => {
      this.publicRequests.push(request);
      return {
        envelopeVersion: '1.0.0',
        correlationId: 'mvp-recording-correlation',
        command: 'workflow extension transition',
        workflowId: 'mvp-recording-workflow',
        schemaVersion: '1.0.0',
        resultStatus: 'success',
        data: { recorded: true },
      };
    },
  });
  this.mvpExtension = createLeanAgileMvpExtension(adapter);
  this.mvpWorkflow = createLeanAgileMvpWorkflow({
    workflowId: 'mvp-recording-workflow',
    correlationId: 'mvp-recording-correlation',
    initiativeId: 'mvp-recording-initiative',
    organizationId: 'org-portfolio-demo',
    principalId: 'principal-portfolio-demo',
    hypothesis: 'A public transition reaches the engine contract.',
  });
});

When('the extension records an experiment transition', async function () {
  const result = await this.mvpExtension.transitionAndRecord(this.mvpWorkflow, {
    to: 'experiment',
    actor: { kind: 'principal', id: 'principal-portfolio-demo' },
  });
  this.mvpWorkflow = result.workflow;
});

Then('the public client receives the versioned MVP extension transition', function () {
  const request = this.publicRequests[0] as {
    command?: string;
    input?: {
      transition?: {
        extensionId?: string;
        extensionSchemaVersion?: string;
        from?: string;
        to?: string;
      };
    };
  };
  if (
    request?.command !== 'workflow extension transition'
    || request.input?.transition?.extensionId !== 'lean-agile-mvp'
    || request.input.transition.extensionSchemaVersion !== '1.0.0'
    || request.input.transition.from !== 'hypothesis'
    || request.input.transition.to !== 'experiment'
  ) {
    throw new Error('Expected a versioned Lean-Agile MVP public transition request');
  }
});
