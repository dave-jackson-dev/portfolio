import {
  REPLAYABLE_WORKFLOW_COMMANDS,
  WorkflowMacroStore,
  createWorkflowEventIngress,
  replayApprovedWorkflowMacro,
  validateWorkflowMacroApproval,
} from '@singularity/workflow-engine/public';
import type { WorkflowCommand, WorkflowCommandResult, WorkflowEnginePublicClient } from '@singularity/workflow-engine/public';
import type { PlatformEventForRecording, PortfolioWorkflowRecordingStore } from '../../../portfolio-workflow-recording/src/lib/portfolio-workflow-recording';

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

export class PortfolioWorkflowMacroStore extends WorkflowMacroStore {
  async approve(input: MacroApprovalInput): Promise<ApprovedWorkflowMacro> {
    return super.approve(input) as Promise<ApprovedWorkflowMacro>;
  }

  async versions(macroId: string): Promise<ApprovedWorkflowMacro[]> {
    return super.versions(macroId) as Promise<ApprovedWorkflowMacro[]>;
  }
}

export const createPortfolioEventIngress = (recordings: PortfolioWorkflowRecordingStore) =>
  createWorkflowEventIngress(recordings);

export async function replayApprovedMacro(
  client: WorkflowEnginePublicClient,
  macro: ApprovedWorkflowMacro,
  options: { correlationId: string; workspace: { id: string; disposable: boolean }; bindings: Record<string, unknown> },
): Promise<WorkflowCommandResult> {
  return replayApprovedWorkflowMacro(client, macro, options);
}

export { REPLAYABLE_WORKFLOW_COMMANDS, validateWorkflowMacroApproval };
