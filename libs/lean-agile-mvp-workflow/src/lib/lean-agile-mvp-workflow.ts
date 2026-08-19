import type { StartLeanAgileMvpWorkflowInput, WorkflowCommandResult } from '../../../portfolio-workflow-adapter/src/lib/portfolio-workflow-adapter';

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
  history: Array<{ from: LeanAgileMvpState; to: LeanAgileMvpState; actor: MvpActor; evidenceReferences: string[] }>;
}

export interface LeanAgileMvpTransition {
  to: LeanAgileMvpState;
  actor: MvpActor;
  evidenceReferences?: string[];
  hypothesis?: string;
}

export interface PortfolioWorkflowStarter {
  startLeanAgileMvpWorkflow(input: StartLeanAgileMvpWorkflowInput): Promise<WorkflowCommandResult>;
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
  const allowed: Record<LeanAgileMvpState, LeanAgileMvpState[]> = {
    hypothesis: ['experiment'],
    experiment: ['evidence'],
    evidence: ['outcome'],
    outcome: ['pivot', 'persevere'],
    pivot: ['hypothesis'],
    persevere: [],
  };
  if (!allowed[workflow.state].includes(transition.to)) throw new Error(`Invalid Lean-Agile MVP transition: ${workflow.state} -> ${transition.to}`);

  const evidenceReferences = transition.evidenceReferences ?? workflow.evidenceReferences;
  if (['evidence', 'outcome', 'pivot', 'persevere'].includes(transition.to) && evidenceReferences.length === 0) {
    throw new Error(`${transition.to} requires at least one immutable evidence reference`);
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
    history: [...workflow.history, { from: workflow.state, to: transition.to, actor: transition.actor, evidenceReferences }],
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
  };
}
