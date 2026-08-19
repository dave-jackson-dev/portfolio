export const WORKFLOW_ENGINE_CONTRACT_VERSION = '1.0' as const;

export type WorkflowCommand =
  | 'workflow init'
  | 'workflow status'
  | 'workflow step start'
  | 'workflow step complete'
  | 'workflow step block'
  | 'workflow resume'
  | 'workflow handoff'
  | 'workflow snapshot export'
  | 'workflow audit'
  | 'workflow projection rebuild'
  | 'workflow extension transition'
  | 'workflow macro replay';

export interface WorkflowCommandRequest {
  contractVersion: typeof WORKFLOW_ENGINE_CONTRACT_VERSION;
  command: WorkflowCommand;
  correlationId: string;
  workflowId?: string;
  input: Record<string, unknown>;
}

export interface WorkflowCommandSuccess {
  envelopeVersion: '1.0.0';
  correlationId: string;
  command: string;
  workflowId: string | null;
  schemaVersion: '1.0.0';
  resultStatus: 'success';
  data: unknown;
}

export interface WorkflowCommandFailure {
  envelopeVersion: '1.0.0';
  correlationId: string;
  resultStatus: 'error';
  error: { code: string; message: string };
}

export type WorkflowCommandResult = WorkflowCommandSuccess | WorkflowCommandFailure;

/**
 * An injected public-contract client. The composition root supplies the published Workflow Engine
 * module/factory or a transport adapter; Portfolio never imports a Singularity source path.
 */
export interface WorkflowEnginePublicClient {
  execute(request: WorkflowCommandRequest): Promise<WorkflowCommandResult>;
}

export interface StartLeanAgileMvpWorkflowInput {
  workflowId: string;
  correlationId: string;
  initiativeId: string;
  organizationId: string;
  principalId: string;
}

export interface LeanAgileMvpTransitionRecord {
  workflowId: string;
  correlationId: string;
  from: string;
  to: string;
  actor: { kind: 'principal' | 'service-account'; id: string };
  evidenceReferences: string[];
  hypothesis?: string;
}

export function createPortfolioWorkflowAdapter(client: WorkflowEnginePublicClient) {
  return Object.freeze({
    startLeanAgileMvpWorkflow(input: StartLeanAgileMvpWorkflowInput): Promise<WorkflowCommandResult> {
      return client.execute({
        contractVersion: WORKFLOW_ENGINE_CONTRACT_VERSION,
        command: 'workflow init',
        correlationId: input.correlationId,
        workflowId: input.workflowId,
        input: {
          project: 'portfolio',
          phase: 'lean-agile-mvp',
          initiativeId: input.initiativeId,
          organizationId: input.organizationId,
          principalId: input.principalId,
        },
      });
    },
    recordLeanAgileMvpTransition(record: LeanAgileMvpTransitionRecord): Promise<WorkflowCommandResult> {
      return client.execute({
        contractVersion: WORKFLOW_ENGINE_CONTRACT_VERSION,
        command: 'workflow extension transition',
        correlationId: record.correlationId,
        workflowId: record.workflowId,
        input: {
          transition: {
            extensionId: 'portfolio.lean-agile-mvp',
            extensionSchemaVersion: '1.0.0',
            from: record.from,
            to: record.to,
            actor: record.actor,
            evidenceReferences: record.evidenceReferences,
            ...(record.hypothesis ? { hypothesis: record.hypothesis } : {}),
          },
        },
      });
    },
  });
}
