import { createHash } from 'node:crypto';
import PouchDB from 'pouchdb';
import memoryAdapter from 'pouchdb-adapter-memory';

PouchDB.plugin(memoryAdapter);

export const MACRO_RECORDING_SCHEMA_VERSION = '1.0' as const;

const allowedEventTypes = new Set([
  'workflow.step.started', 'workflow.step.completed', 'workflow.step.blocked', 'workflow.step.resumed',
  'workflow.mvp.evidence-recorded', 'workflow.macro.approved', 'workflow.macro.replay-completed',
]);

export interface PlatformEventForRecording {
  eventId: string;
  type: string;
  version: number;
  occurredAt: string;
  workflowId: string;
  organizationId: string;
  correlationId: string;
  payload?: Record<string, unknown>;
}

export interface RecordedMacroEvent {
  eventId: string;
  type: string;
  version: number;
  occurredAt: string;
  redaction: 'none' | 'fields-removed';
  payload: Record<string, unknown>;
}

interface StoredRecordingEvent {
  _id: string;
  documentType: 'macro-recording-event';
  schemaVersion: typeof MACRO_RECORDING_SCHEMA_VERSION;
  workflowId: string;
  organizationId: string;
  correlationId: string;
  retainedEvent: RecordedMacroEvent;
  retention: 'one-week';
}

export interface MacroRecording {
  _id: string;
  documentType: 'macro-recording';
  schemaVersion: typeof MACRO_RECORDING_SCHEMA_VERSION;
  workflowId: string;
  organizationId: string;
  correlationId: string;
  recordedAt: string;
  events: RecordedMacroEvent[];
  retention: 'one-week';
}

function safePayload(event: PlatformEventForRecording): Record<string, unknown> {
  const payload = event.payload ?? {};
  const fields: Record<string, string[]> = {
    'workflow.step.started': ['stepId', 'status', 'evidenceReference'],
    'workflow.step.completed': ['stepId', 'status', 'evidenceReference'],
    'workflow.step.blocked': ['stepId', 'status', 'evidenceReference'],
    'workflow.step.resumed': ['stepId', 'status', 'evidenceReference'],
    'workflow.mvp.evidence-recorded': ['hypothesisReference', 'experimentReference', 'evidenceReference'],
    'workflow.macro.approved': ['macroId', 'macroVersion', 'approvalRecorded'],
    'workflow.macro.replay-completed': ['macroId', 'macroVersion', 'workspaceId', 'status'],
  };
  return Object.fromEntries(fields[event.type].flatMap((field) => payload[field] === undefined ? [] : [[field, payload[field]]]));
}

function reduce(event: PlatformEventForRecording): RecordedMacroEvent {
  if (!allowedEventTypes.has(event.type)) throw new Error(`Event type is not approved for Portfolio recording: ${event.type}`);
  if (!event.eventId || !event.workflowId || !event.organizationId || !event.correlationId) throw new Error('Recorded events require event, workflow, organization, and correlation identifiers');
  if (!Number.isInteger(event.version) || event.version < 1) throw new Error('Recorded events require a positive integer version');
  const payload = safePayload(event);
  return {
    eventId: event.eventId, type: event.type, version: event.version, occurredAt: event.occurredAt,
    redaction: Object.keys(payload).length === Object.keys(event.payload ?? {}).length ? 'none' : 'fields-removed', payload,
  };
}

function eventDocumentId(event: PlatformEventForRecording) {
  return `macro-recording-event:${event.eventId}`;
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== '_rev')
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export class PortfolioWorkflowRecordingStore {
  private readonly db: any;

  constructor(name = `portfolio-workflow-recording-${Date.now()}`) {
    this.db = new PouchDB(name, { adapter: 'memory' });
  }

  async record(event: PlatformEventForRecording): Promise<{ duplicate: boolean; event: RecordedMacroEvent }> {
    const retainedEvent = reduce(event);
    const document: StoredRecordingEvent = {
      _id: eventDocumentId(event), documentType: 'macro-recording-event', schemaVersion: MACRO_RECORDING_SCHEMA_VERSION,
      workflowId: event.workflowId, organizationId: event.organizationId, correlationId: event.correlationId,
      retainedEvent, retention: 'one-week',
    };
    try {
      await this.db.put(document);
      return { duplicate: false, event: retainedEvent };
    } catch (error: any) {
      if (error?.status !== 409) throw error;
      const existing = await this.db.get(document._id) as StoredRecordingEvent;
      if (canonical(existing) !== canonical(document)) {
        throw new Error(`Event ID collision with different retained content: ${event.eventId}`);
      }
      return { duplicate: true, event: existing.retainedEvent };
    }
  }

  async recording(workflowId: string, correlationId: string): Promise<MacroRecording> {
    const rows = await this.db.allDocs({ include_docs: true, startkey: 'macro-recording-event:', endkey: 'macro-recording-event:\uffff' });
    const events = rows.rows.map((row: any) => row.doc as StoredRecordingEvent)
      .filter((document) => document.workflowId === workflowId && document.correlationId === correlationId)
      .sort((left, right) => left.retainedEvent.occurredAt.localeCompare(right.retainedEvent.occurredAt));
    if (events.length === 0) throw new Error(`No recording exists for ${workflowId}/${correlationId}`);
    return {
      _id: `macro-recording:${workflowId}:${correlationId}`, documentType: 'macro-recording', schemaVersion: MACRO_RECORDING_SCHEMA_VERSION,
      workflowId, organizationId: events[0].organizationId, correlationId, recordedAt: events.at(-1)!.retainedEvent.occurredAt,
      events: events.map((document) => document.retainedEvent), retention: 'one-week',
    };
  }

  async exportSnapshot(): Promise<{ schemaVersion: '1.0'; integrity: string; documents: StoredRecordingEvent[] }> {
    const rows = await this.db.allDocs({ include_docs: true, startkey: 'macro-recording-event:', endkey: 'macro-recording-event:\uffff' });
    const documents = rows.rows.map((row: any) => {
      const { _rev, ...document } = row.doc as StoredRecordingEvent & { _rev: string };
      return document;
    });
    const integrity = createHash('sha256').update(JSON.stringify(documents)).digest('hex');
    return { schemaVersion: '1.0', integrity, documents };
  }

  async purgeExpired(now = new Date()): Promise<number> {
    const cutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const rows = await this.db.allDocs({ include_docs: true, startkey: 'macro-recording-event:', endkey: 'macro-recording-event:\uffff' });
    const expired = rows.rows.map((row: any) => row.doc as StoredRecordingEvent)
      .filter((document) => document.retention === 'one-week' && new Date(document.retainedEvent.occurredAt).getTime() < cutoff);
    if (expired.length) await this.db.bulkDocs(expired.map((document) => ({ _id: document._id, _rev: (document as any)._rev, _deleted: true })));
    return expired.length;
  }

  async restoreSnapshot(snapshot: { schemaVersion: '1.0'; integrity: string; documents: StoredRecordingEvent[] }) {
    const actual = createHash('sha256').update(JSON.stringify(snapshot.documents)).digest('hex');
    if (actual !== snapshot.integrity) throw new Error('Snapshot integrity verification failed');
    for (const document of snapshot.documents) {
      try { await this.db.put(document); } catch (error: any) { if (error?.status !== 409) throw error; }
    }
  }

  async close() { await this.db.close(); }
}
