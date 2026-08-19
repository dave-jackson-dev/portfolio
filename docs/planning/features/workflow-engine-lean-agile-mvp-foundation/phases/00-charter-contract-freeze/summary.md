# Phase 00 — Charter and Contract Freeze Summary

**Status:** In progress

**Started:** 2026-08-18

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/00-charter-contract-freeze`

## Decision record

Portfolio is a second consumer of the Workflow Engine through a public boundary, not by copying
or importing the Singularity implementation. The existing engine plan identifies a programmatic
Nest module/factory and CQRS commands/queries as the intended consumer surface; PouchDB is owned
behind that boundary. This phase will turn that intent into an approved, versioned contract.

The Lean-Agile MVP workflow is Portfolio-owned extension content. It will describe product
delivery states and evidence without importing agents, skills, prompts, model settings, private
knowledge, or execution history. Historical domain events remain audit evidence. A macro is a
separately approved command recipe and can run only in a disposable workspace.

## Evidence gathered

- The Singularity Workflow Engine plan states that its standalone application exposes a
  programmatic Nest module/factory and that consumers dispatch CQRS commands and queries rather
  than importing PouchDB repositories.
- The provider's exported command catalogue was reconciled with all command paths executable by
  `WorkflowApplicationService`, including initialization, resume, handoff, and snapshot export.
- The same plan assigns PouchDB authoritative workflow state/audit persistence and requires
  idempotent event handlers for safe changes-feed replay.
- Portfolio's feature plan prohibits direct cross-service datastore reads and limits event ingress
  to approved, versioned `PlatformEventEnvelope` messages.
- [Portfolio ADR-001](../../../../architecture/adr-001-workflow-engine-public-consumer-boundary.md)
  records the accepted consumer-side boundary and its prohibited dependency directions.
- Provider-owned Workflow Engine v1 command/result schemas and the v2 identity-aware event schema
  are checked in under Singularity `docs/contracts/workflow-engine/v1/`.
- Portfolio's `npm run test:workflow-contract` validates the sanitized delegated-event and macro
  fixtures, the initial allowlist, disposable-workspace replay rule, and private-import exclusion.
- Singularity's provider-side `createWorkflowEnginePublicAdapter` baseline passes its Node contract
  tests for supported v1 command dispatch and unsupported-version rejection.

## Open decisions

1. The concrete encryption provider/configuration and backup/restore runbook for the runtime
   PouchDB store.
2. The location and executable form of the shared compatibility fixture and test harness.

## Validation status

- `npm run test:workflow-contract` passes.
- `npm run test:bdd` passes on Node 24.19.0: 4 scenarios and 10 steps pass.
- `node --test libs/workflow-engine/public/index.spec.mjs` passes in Singularity: 2 tests pass.

## Risks and controls

| Risk | Control |
| --- | --- |
| A convenient source import couples Portfolio to private implementation | ADR and contract test reject private package/path imports. |
| Event payloads expose visitor or proprietary data | Explicit allowlist, field-level classification, redaction before persistence, and sanitized fixtures only. |
| Recorded events are mistaken for executable automation | Require macro input bindings, policy, human approval, immutable version, and command-based disposable replay. |
| PouchDB content enters a Docker image | Image audit permits only public baselines/sanitized fixtures; runtime data and keys are mounted/injected. |

## Next unchecked item

Implement the Portfolio thin adapter against the public v1 module/factory, then add the
cross-repository compatibility test that proves no private import is required.
