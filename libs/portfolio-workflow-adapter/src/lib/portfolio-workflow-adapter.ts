import {
  WORKFLOW_ENGINE_PUBLIC_CONTRACT_VERSION,
  type ExtensionTransitionRecord,
  type StartWorkflowInput,
  type WorkflowCommandResult,
  type WorkflowEnginePublicClient,
  type WorkflowRecorder,
} from '@singularity/workflow-engine/public';

export function createPortfolioWorkflowAdapter(client: WorkflowEnginePublicClient): WorkflowRecorder {
  return Object.freeze({
    startWorkflow(input: StartWorkflowInput): Promise<WorkflowCommandResult> {
      return client.execute({
        contractVersion: WORKFLOW_ENGINE_PUBLIC_CONTRACT_VERSION,
        command: 'workflow init',
        correlationId: input.correlationId,
        workflowId: input.workflowId,
        input: {
          project: 'portfolio',
          ...input.metadata,
        },
      });
    },
    recordExtensionTransition(record: ExtensionTransitionRecord): Promise<WorkflowCommandResult> {
      return client.execute({
        contractVersion: WORKFLOW_ENGINE_PUBLIC_CONTRACT_VERSION,
        command: 'workflow extension transition',
        correlationId: record.correlationId,
        workflowId: record.workflowId,
        input: {
          transition: {
            extensionId: record.extensionId,
            extensionSchemaVersion: record.extensionSchemaVersion,
            from: record.from,
            to: record.to,
            actor: record.actor,
            evidenceReferences: record.evidenceReferences,
            ...(record.data ?? {}),
          },
        },
      });
    },
  });
}
