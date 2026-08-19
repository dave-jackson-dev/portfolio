import { Given, Then, When } from '@cucumber/cucumber';

async function macroModule() {
  const modulePath = '../../libs/portfolio-workflow-macros/src/lib/portfolio-workflow-macros.ts';
  return import(modulePath);
}

async function recordingModule() {
  const modulePath = '../../libs/portfolio-workflow-recording/src/lib/portfolio-workflow-recording.ts';
  return import(modulePath);
}

function event() {
  return { eventId: '7f154798-1bbc-43e9-804c-1169d56a4a9', type: 'workflow.mvp.evidence-recorded', version: 2,
    occurredAt: '2026-08-19T13:00:00.000Z', workflowId: 'workflow-macro-fixture', organizationId: 'org-portfolio-demo',
    correlationId: 'macro-correlation-fixture', payload: { hypothesisReference: 'hypothesis:1', experimentReference: 'experiment:1', evidenceReference: 'evidence:1', token: 'never-retain' } };
}

Given('a Portfolio macro recording ingress', async function () {
  const { PortfolioWorkflowRecordingStore } = await recordingModule();
  const { createPortfolioEventIngress } = await macroModule();
  this.recordingStore = new PortfolioWorkflowRecordingStore(`bdd-ingress-${Date.now()}-${Math.random()}`);
  this.ingress = createPortfolioEventIngress(this.recordingStore);
});

When('an allowlisted event enters the ingress', async function () {
  this.ingressResult = await this.ingress.ingest(event());
});

Then('the ingress retains only the redacted event evidence', async function () {
  const recording = await this.recordingStore.recording('workflow-macro-fixture', 'macro-correlation-fixture');
  if (this.ingressResult.duplicate || 'token' in recording.events[0].payload || recording.events[0].redaction !== 'fields-removed') throw new Error('Expected ingress redaction');
  await this.recordingStore.close();
});

Given('a Portfolio macro store with recorded evidence', async function () {
  const { PortfolioWorkflowMacroStore } = await macroModule();
  this.macroStore = new PortfolioWorkflowMacroStore(`bdd-macros-${Date.now()}-${Math.random()}`);
});

When('a human principal approves a macro recipe', async function () {
  this.macro = await this.macroStore.approve({ macroId: 'macro-site-builder-intake', organizationId: 'org-portfolio-demo',
    approvedBy: { kind: 'principal', id: 'principal-portfolio-demo' }, approvedAt: '2026-08-19T13:00:00.000Z',
    evidenceRecordingIds: ['macro-recording:workflow-macro-fixture:macro-correlation-fixture'],
    commands: [{ command: 'workflow init', inputBindings: ['projectName'], input: { project: 'portfolio' }, executionTarget: 'disposable-workspace' }],
  });
});

Then('the approved macro has immutable version one', async function () {
  if (this.macro.version !== 1 || this.macro.status !== 'approved' || this.macro._id !== 'workflow-macro:macro-site-builder-intake:1') throw new Error('Expected immutable approved macro version');
  await this.macroStore.close();
});

Given('an approved Portfolio macro and public workflow client', async function () {
  const { PortfolioWorkflowMacroStore } = await macroModule();
  this.macroStore = new PortfolioWorkflowMacroStore(`bdd-replay-${Date.now()}-${Math.random()}`);
  this.macro = await this.macroStore.approve({ macroId: 'macro-replay-fixture', organizationId: 'org-portfolio-demo',
    approvedBy: { kind: 'principal', id: 'principal-portfolio-demo' }, approvedAt: '2026-08-19T13:00:00.000Z', evidenceRecordingIds: ['macro-recording:fixture'],
    commands: [{ command: 'workflow init', inputBindings: ['projectName'], executionTarget: 'disposable-workspace' }],
  });
  this.replayRequests = [];
  this.publicClient = { execute: async (request: unknown) => { this.replayRequests.push(request); return { envelopeVersion: '1.0.0', correlationId: 'replay-correlation', command: 'workflow init', workflowId: 'workspace-disposable', schemaVersion: '1.0.0', resultStatus: 'success', data: {} }; } };
});

When('the macro is replayed into a disposable workspace', async function () {
  const { replayApprovedMacro } = await macroModule();
  await replayApprovedMacro(this.publicClient, this.macro, { correlationId: 'replay-correlation', workspace: { id: 'workspace-disposable', disposable: true }, bindings: { projectName: 'Portfolio demo' } });
});

Then('the client receives fresh replay commands and no historical event', async function () {
  const request = this.replayRequests[0] as { command?: string; workflowId?: string; input?: Record<string, unknown> };
  if (this.replayRequests.length !== 1 || request.command !== 'workflow init' || request.workflowId !== 'workspace-disposable' || request.input?.projectName !== 'Portfolio demo' || 'eventId' in (request.input ?? {})) throw new Error('Expected a fresh disposable command only');
  await this.macroStore.close();
});

When('a Service Account attempts macro approval', async function () {
  try {
    await this.macroStore.approve({ macroId: 'macro-denied-fixture', organizationId: 'org-portfolio-demo',
      approvedBy: { kind: 'service-account', id: 'sa-workflow-engine' }, approvedAt: '2026-08-19T13:00:00.000Z', evidenceRecordingIds: ['macro-recording:fixture'],
      commands: [{ command: 'workflow init', inputBindings: [], executionTarget: 'disposable-workspace' }],
    });
  } catch (error) { this.macroApprovalError = error; }
});

Then('macro approval is rejected', async function () {
  if (!(this.macroApprovalError instanceof Error) || !this.macroApprovalError.message.includes('human principal')) throw new Error('Expected Service Account macro approval to fail');
  await this.macroStore.close();
});

When('a human principal approves two macro versions', async function () {
  const approval = { macroId: 'macro-version-fixture', organizationId: 'org-portfolio-demo', approvedBy: { kind: 'principal' as const, id: 'principal-portfolio-demo' }, approvedAt: '2026-08-19T13:00:00.000Z', evidenceRecordingIds: ['macro-recording:fixture'], commands: [{ command: 'workflow init' as const, inputBindings: [], executionTarget: 'disposable-workspace' as const }] };
  await this.macroStore.approve(approval);
  await this.macroStore.approve({ ...approval, approvedAt: '2026-08-19T13:01:00.000Z' });
});

Then('both immutable macro versions are retained', async function () {
  const versions = await this.macroStore.versions('macro-version-fixture');
  if (versions.length !== 2 || versions[0]._id !== 'workflow-macro:macro-version-fixture:1' || versions[1]._id !== 'workflow-macro:macro-version-fixture:2') throw new Error('Expected immutable macro versions one and two');
  await this.macroStore.close();
});
