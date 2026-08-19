import { Given, Then, When } from '@cucumber/cucumber';

Given('an injected public Workflow Engine client', async function () {
  const adapterModule = '../../libs/portfolio-workflow-adapter/src/lib/portfolio-workflow-adapter.ts';
  const { createPortfolioWorkflowAdapter } = await import(adapterModule);
  this.requests = [];
  const client = {
    execute: async (request: any) => {
      this.requests.push(request);
      return {
        envelopeVersion: '1.0.0',
        correlationId: request.correlationId,
        command: request.command,
        workflowId: request.workflowId ?? null,
        schemaVersion: '1.0.0',
        resultStatus: 'success',
        data: { created: true },
      };
    },
  };
  this.portfolioWorkflowAdapter = createPortfolioWorkflowAdapter(client);
});

When('Portfolio starts a Lean-Agile MVP workflow', async function () {
  await this.portfolioWorkflowAdapter.startLeanAgileMvpWorkflow({
    workflowId: 'workflow-portfolio-fixture',
    correlationId: 'correlation-portfolio-fixture',
    initiativeId: 'initiative-portfolio-fixture',
    organizationId: 'org-portfolio-demo',
    principalId: 'principal-portfolio-demo',
  });
});

Then('the public client receives the versioned workflow-init request', function () {
  if (this.requests.length !== 1) throw new Error('Expected exactly one public Workflow Engine request');
  const request = this.requests[0] as { contractVersion: string; command: string; workflowId?: string; input: { project?: string } };
  if (request.contractVersion !== '1.0' || request.command !== 'workflow init') throw new Error('Expected a v1 workflow-init request');
  if (request.workflowId !== 'workflow-portfolio-fixture' || request.input.project !== 'portfolio') {
    throw new Error('Expected Portfolio workflow identity and project context');
  }
});
