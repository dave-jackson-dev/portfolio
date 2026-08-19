import type { LeanAgileMvpTransitionRecord, StartLeanAgileMvpWorkflowInput, WorkflowCommandResult } from '../../../portfolio-workflow-adapter/src/lib/portfolio-workflow-adapter';

export type LeanAgileMvpState = 'hypothesis' | 'experiment' | 'evidence' | 'outcome' | 'pivot' | 'persevere';

export interface MvpActor {
  kind: 'principal' | 'service-account';
  id: string;
}

export interface LeanAgileMvpWorkflow {
  workflowId: string;
  correlationId: string;
  initiativeId: string;
  organizationId: string;
  state: LeanAgileMvpState;
  hypothesis: string;
  evidenceReferences: string[];
  history: Array<{ from: LeanAgileMvpState; to: LeanAgileMvpState; actor: MvpActor; evidenceReferences: string[]; recordedAt: string }>;
}

export interface LeanAgileMvpTransition {
  to: LeanAgileMvpState;
  actor: MvpActor;
  evidenceReferences?: string[];
  hypothesis?: string;
  recordedAt?: string;
}

export interface LeanAgileMvpValidation {
  valid: boolean;
  errors: string[];
}

export interface LeanAgileMvpProjection {
  workflowId: string;
  initiativeId: string;
  organizationId: string;
  state: LeanAgileMvpState;
  hypothesis: string;
  evidenceReferences: string[];
  allowedNextStates: LeanAgileMvpState[];
  decision: null | { outcome: 'pivot' | 'persevere'; principalId: string; recordedAt: string; evidenceReferences: string[] };
  terminal: boolean;
}

const allowedTransitions: Record<LeanAgileMvpState, LeanAgileMvpState[]> = {
  hypothesis: ['experiment'], experiment: ['evidence'], evidence: ['outcome'], outcome: ['pivot', 'persevere'], pivot: ['hypothesis'], persevere: [],
};

function validateEvidenceReferences(references: string[]) {
  return references.length > 0 && references.every((reference) => /^evidence:[^\s]+$/.test(reference)) && new Set(references).size === references.length;
}

export function validateLeanAgileMvpWorkflow(workflow: LeanAgileMvpWorkflow): LeanAgileMvpValidation {
  const errors: string[] = [];
  if (!workflow.hypothesis.trim()) errors.push('A workflow requires a testable hypothesis');
  if (workflow.history.some((entry) => !allowedTransitions[entry.from].includes(entry.to))) errors.push('Workflow history contains an invalid state transition');
  if (workflow.history.some((entry) => ['evidence', 'outcome', 'pivot', 'persevere'].includes(entry.to) && !validateEvidenceReferences(entry.evidenceReferences))) {
    errors.push('Evidence and decisions require unique immutable evidence references');
  }
  if (workflow.history.some((entry) => ['pivot', 'persevere'].includes(entry.to) && entry.actor.kind !== 'principal')) {
    errors.push('Only a human principal may record a pivot-or-persevere decision');
  }
  return { valid: errors.length === 0, errors };
}

export function projectLeanAgileMvpWorkflow(workflow: LeanAgileMvpWorkflow): LeanAgileMvpProjection {
  const decision = [...workflow.history].reverse().find((entry) => entry.to === 'pivot' || entry.to === 'persevere');
  return {
    workflowId: workflow.workflowId, initiativeId: workflow.initiativeId, organizationId: workflow.organizationId,
    state: workflow.state, hypothesis: workflow.hypothesis, evidenceReferences: [...workflow.evidenceReferences],
    allowedNextStates: [...allowedTransitions[workflow.state]], terminal: workflow.state === 'persevere',
    decision: decision ? { outcome: decision.to as 'pivot' | 'persevere', principalId: decision.actor.id, recordedAt: decision.recordedAt, evidenceReferences: [...decision.evidenceReferences] } : null,
  };
}

export interface PortfolioWorkflowStarter {
  startLeanAgileMvpWorkflow(input: StartLeanAgileMvpWorkflowInput): Promise<WorkflowCommandResult>;
  recordLeanAgileMvpTransition(record: LeanAgileMvpTransitionRecord): Promise<WorkflowCommandResult>;
}

export function createLeanAgileMvpWorkflow(input: StartLeanAgileMvpWorkflowInput & { hypothesis: string }): LeanAgileMvpWorkflow {
  if (!input.hypothesis.trim()) throw new Error('A Lean-Agile MVP workflow requires a testable hypothesis');
  return {
    workflowId: input.workflowId,
    correlationId: input.correlationId,
    initiativeId: input.initiativeId,
    organizationId: input.organizationId,
    state: 'hypothesis',
    hypothesis: input.hypothesis,
    evidenceReferences: [],
    history: [],
  };
}

export function transitionLeanAgileMvpWorkflow(workflow: LeanAgileMvpWorkflow, transition: LeanAgileMvpTransition): LeanAgileMvpWorkflow {
  if (!allowedTransitions[workflow.state].includes(transition.to)) throw new Error(`Invalid Lean-Agile MVP transition: ${workflow.state} -> ${transition.to}`);

  const evidenceReferences = transition.evidenceReferences ?? workflow.evidenceReferences;
  if (['evidence', 'outcome', 'pivot', 'persevere'].includes(transition.to) && !validateEvidenceReferences(evidenceReferences)) {
    throw new Error(`${transition.to} requires unique immutable evidence references`);
  }
  if (['pivot', 'persevere'].includes(transition.to) && transition.actor.kind !== 'principal') {
    throw new Error('Only an authorized human principal may record a pivot-or-persevere decision');
  }
  if (workflow.state === 'pivot' && transition.to === 'hypothesis' && !transition.hypothesis?.trim()) {
    throw new Error('A pivot must supply a revised testable hypothesis');
  }
  const hypothesis = workflow.state === 'pivot' && transition.to === 'hypothesis'
    ? transition.hypothesis!.trim()
    : workflow.hypothesis;

  return {
    ...workflow,
    state: transition.to,
    hypothesis,
    evidenceReferences,
    history: [...workflow.history, { from: workflow.state, to: transition.to, actor: transition.actor, evidenceReferences, recordedAt: transition.recordedAt ?? new Date().toISOString() }],
  };
}

export function createLeanAgileMvpExtension(starter: PortfolioWorkflowStarter) {
  return {
    async start(input: StartLeanAgileMvpWorkflowInput & { hypothesis: string }) {
      const result = await starter.startLeanAgileMvpWorkflow(input);
      if (result.resultStatus === 'error') return result;
      return { result, workflow: createLeanAgileMvpWorkflow(input) };
    },
    transition: transitionLeanAgileMvpWorkflow,
    async transitionAndRecord(workflow: LeanAgileMvpWorkflow, transition: LeanAgileMvpTransition) {
      const next = transitionLeanAgileMvpWorkflow(workflow, transition);
      const result = await starter.recordLeanAgileMvpTransition({
        workflowId: workflow.workflowId,
        correlationId: workflow.correlationId,
        from: workflow.state,
        to: next.state,
        actor: transition.actor,
        evidenceReferences: next.evidenceReferences,
        ...(next.hypothesis !== workflow.hypothesis ? { hypothesis: next.hypothesis } : {}),
      });
      return { result, workflow: result.resultStatus === 'success' ? next : workflow };
    },
  };
}
