import { Given, Then, When } from '@cucumber/cucumber';

async function recordingModule() {
  const modulePath = '../../libs/portfolio-workflow-recording/src/lib/portfolio-workflow-recording.ts';
  return import(modulePath);
}

function event(type = 'workflow.step.completed') {
  return {
    eventId: '6f154798-1bbc-43e9-804c-1169d56a4a9', type, version: 2, occurredAt: '2026-08-19T12:00:00.000Z',
    workflowId: 'workflow-recording-fixture', organizationId: 'org-portfolio-demo', correlationId: 'recording-correlation-fixture',
    payload: { stepId: 'evidence', status: 'completed', evidenceReference: 'evidence:fixture:1', authorization: 'must-not-persist' },
  };
}

Given('an empty Portfolio PouchDB recording store', async function () {
  const { PortfolioWorkflowRecordingStore } = await recordingModule();
  this.recordingStore = new PortfolioWorkflowRecordingStore(`bdd-recording-${Date.now()}-${Math.random()}`);
});

When('an allowlisted workflow event is delivered twice', async function () {
  this.firstRecording = await this.recordingStore.record(event());
  this.secondRecording = await this.recordingStore.record(event());
});

Then('the recording contains one redacted event', async function () {
  const recording = await this.recordingStore.recording('workflow-recording-fixture', 'recording-correlation-fixture');
  if (this.firstRecording.duplicate || !this.secondRecording.duplicate || recording.events.length !== 1 || 'authorization' in recording.events[0].payload || recording.events[0].redaction !== 'fields-removed') {
    throw new Error('Expected one redacted, idempotent event recording');
  }
  await this.recordingStore.close();
});

When('an unapproved event is delivered', async function () {
  try { await this.recordingStore.record(event('identity.user-signed-in')); } catch (error) { this.recordingError = error; }
});

Then('the recording event is rejected and no recording is created', async function () {
  if (!(this.recordingError instanceof Error) || !this.recordingError.message.includes('not approved')) throw new Error('Expected rejected event');
  try { await this.recordingStore.recording('workflow-recording-fixture', 'recording-correlation-fixture'); } catch { await this.recordingStore.close(); return; }
  throw new Error('Rejected event must not create a recording');
});

When('an allowlisted workflow event is recorded and snapshotted', async function () {
  await this.recordingStore.record(event());
  this.snapshot = await this.recordingStore.exportSnapshot();
  await this.recordingStore.close();
});

Then('the snapshot restores the same logical recording', async function () {
  const { PortfolioWorkflowRecordingStore } = await recordingModule();
  const restored = new PortfolioWorkflowRecordingStore(`bdd-restored-${Date.now()}-${Math.random()}`);
  await restored.restoreSnapshot(this.snapshot);
  const recording = await restored.recording('workflow-recording-fixture', 'recording-correlation-fixture');
  if (recording.events.length !== 1 || recording.events[0].eventId !== '6f154798-1bbc-43e9-804c-1169d56a4a9') throw new Error('Expected restored recording');
  await restored.close();
});

When('an expired and a current allowlisted event are recorded', async function () {
  await this.recordingStore.record({ ...event(), eventId: '6f154798-1bbc-43e9-804c-1169d56a4a1', occurredAt: '2026-08-01T12:00:00.000Z' });
  await this.recordingStore.record({ ...event(), eventId: '6f154798-1bbc-43e9-804c-1169d56a4a2', occurredAt: '2026-08-19T12:00:00.000Z' });
  this.purgedCount = await this.recordingStore.purgeExpired(new Date('2026-08-19T12:00:00.000Z'));
});

Then('retention removes only the expired recording event', async function () {
  const recording = await this.recordingStore.recording('workflow-recording-fixture', 'recording-correlation-fixture');
  if (this.purgedCount !== 1 || recording.events.length !== 1 || recording.events[0].eventId !== '6f154798-1bbc-43e9-804c-1169d56a4a2') {
    throw new Error('Expected one retained current event after retention purge');
  }
  await this.recordingStore.close();
});

When('an allowlisted event identity is reused with different retained content', async function () {
  await this.recordingStore.record(event());
  try {
    await this.recordingStore.record({ ...event(), payload: { stepId: 'evidence', status: 'blocked', evidenceReference: 'evidence:fixture:1' } });
  } catch (error) {
    this.recordingError = error;
  }
});

Then('the conflicting recording event is rejected without overwrite', async function () {
  const recording = await this.recordingStore.recording('workflow-recording-fixture', 'recording-correlation-fixture');
  if (!(this.recordingError instanceof Error) || !this.recordingError.message.includes('collision') || recording.events[0].payload.status !== 'completed') {
    throw new Error('Expected event collision to preserve the original recording');
  }
  await this.recordingStore.close();
});
