import { WorkflowRecordingStore } from '@singularity/workflow-engine/public';

export const MACRO_RECORDING_SCHEMA_VERSION = '1.0' as const;

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

export class PortfolioWorkflowRecordingStore extends WorkflowRecordingStore {
  constructor(options: string | { name?: string; prefix?: string } = `portfolio-workflow-recording-${Date.now()}`) {
    super(options);
  }
}
