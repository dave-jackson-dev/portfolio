import PouchDB from 'pouchdb';
import memoryAdapter from 'pouchdb-adapter-memory';
import type { WorkflowCommand, WorkflowCommandResult, WorkflowEnginePublicClient } from '@singularity/workflow-engine/public';
import type { PlatformEventForRecording, PortfolioWorkflowRecordingStore } from '../../../portfolio-workflow-recording/src/lib/portfolio-workflow-recording';

PouchDB.plugin(memoryAdapter);

const replayableCommands = new Set<WorkflowCommand>([
  'workflow init', 'workflow step start', 'workflow step complete', 'workflow step block', 'workflow resume', 'workflow handoff',
]);

export interface MacroCommand {
  command: WorkflowCommand;
  inputBindings: string[];
  input?: Record<string, unknown>;
  executionTarget: 'disposable-workspace';
}

export interface ApprovedWorkflowMacro {
  _id: string;
  documentType: 'workflow-macro';
  schemaVersion: '1.0';
  macroId: string;
  version: number;
  organizationId: string;
  status: 'approved';
  approvedBy: string;
  approvedAt: string;
  evidenceRecordingIds: string[];
  commands: MacroCommand[];
}

export interface MacroApprovalInput {
  macroId: string;
  organizationId: string;
  approvedBy: { kind: 'principal' | 'service-account'; id: string };
  approvedAt: string;
  evidenceRecordingIds: string[];
  commands: MacroCommand[];
}

function validateApproval(input: MacroApprovalInput) {
  if (input.approvedBy.kind !== 'principal' || !input.approvedBy.id) throw new Error('Only a human principal may approve a workflow macro');
  if (!input.macroId || !input.organizationId || input.evidenceRecordingIds.length === 0) throw new Error('A macro requires identity, organization, and recording evidence');
  if (input.commands.length === 0 || input.commands.some((command) => command.executionTarget !== 'disposable-workspace' || !replayableCommands.has(command.command))) {
    throw new Error('A macro may contain only replayable commands targeting a disposable workspace');
  }
}

export class PortfolioWorkflowMacroStore {
  private readonly db: PouchDB.Database<ApprovedWorkflowMacro>;

  constructor(name = `portfolio-workflow-macros-${Date.now()}`) {
    this.db = new PouchDB(name, { adapter: 'memory' });
  }

  async approve(input: MacroApprovalInput): Promise<ApprovedWorkflowMacro> {
    validateApproval(input);
    const rows = await this.db.allDocs({ include_docs: true, startkey: `workflow-macro:${input.macroId}:`, endkey: `workflow-macro:${input.macroId}:\uffff` });
    const version = rows.rows.length + 1;
    const macro: ApprovedWorkflowMacro = {
      _id: `workflow-macro:${input.macroId}:${version}`, documentType: 'workflow-macro', schemaVersion: '1.0',
      macroId: input.macroId, version, organizationId: input.organizationId, status: 'approved',
      approvedBy: input.approvedBy.id, approvedAt: input.approvedAt, evidenceRecordingIds: [...input.evidenceRecordingIds],
      commands: input.commands.map((command) => ({ ...command, inputBindings: [...command.inputBindings], input: command.input ? { ...command.input } : undefined })),
    };
    await this.db.put(macro);
    return macro;
  }

  async versions(macroId: string): Promise<ApprovedWorkflowMacro[]> {
    const rows = await this.db.allDocs({ include_docs: true, startkey: `workflow-macro:${macroId}:`, endkey: `workflow-macro:${macroId}:\uffff` });
    return rows.rows.flatMap((row) => row.doc ? [row.doc] : []).sort((left, right) => left.version - right.version);
  }

  async close() { await this.db.close(); }
}

/** The event transport invokes this adapter; it persists only through the Phase 02 reduction boundary. */
export function createPortfolioEventIngress(recordings: PortfolioWorkflowRecordingStore) {
  return Object.freeze({ ingest: (event: PlatformEventForRecording) => recordings.record(event) });
}

export async function replayApprovedMacro(
  client: WorkflowEnginePublicClient,
  macro: ApprovedWorkflowMacro,
  options: { correlationId: string; workspace: { id: string; disposable: boolean }; bindings: Record<string, unknown> },
): Promise<WorkflowCommandResult> {
  if (macro.status !== 'approved') throw new Error('Only an approved macro may be replayed');
  if (!options.workspace.disposable) throw new Error('Macro replay requires a disposable workspace');
  const commands = macro.commands.map((step) => {
    if (!replayableCommands.has(step.command)) throw new Error(`Macro command is not replayable: ${step.command}`);
    const bindings = Object.fromEntries(step.inputBindings.map((key) => [key, options.bindings[key]]).filter(([, value]) => value !== undefined));
    return { command: step.command, input: { ...(step.input ?? {}), ...bindings } };
  });
  return client.execute({
    contractVersion: '1.0', command: 'workflow macro replay', correlationId: options.correlationId, workflowId: options.workspace.id,
    input: { replay: { workspace: options.workspace, commands } },
  });
}
