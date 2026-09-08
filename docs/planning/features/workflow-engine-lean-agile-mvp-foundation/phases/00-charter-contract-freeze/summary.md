# Phase 00 — Charter and Contract Freeze Summary

> ⚠️ **Repointed 2026-09-08.** This is a **completed phase record**. Every *Singularity* reference in
> it was rewritten to *LeanAgileOS* by the upstream repoint
> ([ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md)); the work it
> describes was carried out when the upstream was `singularity`. Package names in code
> (`@singularity/*`) were deliberately **not** renamed — ADR-002 §4.

> **Ownership moved:** The reusable Lean-Agile MVP package, generic specifications, and the
> canonical historical copy of this document now live in [LeanAgileOS Phase 21](https://github.com/dave-jackson-dev/lean-agile-os/blob/dev/docs/planning/lean-agile-os/features/resumable-workflow-steps/phases/21-live-product-pilot-and-extraction-decision/evidence/portfolio-lean-agile-mvp-foundation/phases/00-charter-contract-freeze/summary.md).
> This Portfolio copy remains as a consumer-side forwarding and integration record.

**Status:** Complete

**Started:** 2026-08-18

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/00-charter-contract-freeze`

## Decision record

Portfolio is a second consumer of the Workflow Engine through a public boundary, not by copying
or importing the LeanAgileOS implementation. The existing engine plan identifies a programmatic
Nest module/factory and CQRS commands/queries as the intended consumer surface; PouchDB is owned
behind that boundary. This phase will turn that intent into an approved, versioned contract.

The Lean-Agile MVP workflow was initially scoped here as Portfolio-owned extension content and was
subsequently extracted to the project-neutral `@lean-agile-mvp/workflow` package. It describes product
delivery states and evidence without importing agents, skills, prompts, model settings, private
knowledge, or execution history. Historical domain events remain audit evidence. A macro is a
separately approved command recipe and can run only in a disposable workspace.

## Evidence gathered

- The LeanAgileOS Workflow Engine plan states that its standalone application exposes a
  programmatic Nest module/factory and that consumers dispatch CQRS commands and queries rather
  than importing PouchDB repositories.
- The provider's exported command catalogue was reconciled with all command paths executable by
  `WorkflowApplicationService`, including initialization, resume, handoff, and snapshot export.
- The same plan assigns PouchDB authoritative workflow state/audit persistence and requires
  idempotent event handlers for safe changes-feed replay.
- Portfolio's feature plan prohibits direct cross-service datastore reads and limits event ingress
  to approved, versioned `PlatformEventEnvelope` messages.
- [Portfolio ADR-001](../../../../../architecture/adr-001-workflow-engine-public-consumer-boundary.md)
  records the accepted consumer-side boundary and its prohibited dependency directions.
- Provider-owned Workflow Engine v1 command/result schemas and the v2 identity-aware event schema
  are checked in under LeanAgileOS `docs/contracts/workflow-engine/v1/`.
- Portfolio's `npm run test:workflow-contract` validates the sanitized delegated-event and macro
  fixtures, the initial allowlist, disposable-workspace replay rule, and private-import exclusion.
- LeanAgileOS's provider-side `createWorkflowEnginePublicAdapter` baseline passes its Node contract
  tests for supported v1 command dispatch and unsupported-version rejection.
- `@singularity/workflow-engine` passes a clean external-consumer installation test. Its tarball
  has only six public runtime files and contains no extension, infrastructure, tests, agents,
  skills, prompts, or other proprietary content.
- Portfolio's `createPortfolioWorkflowAdapter` passes a BDD consumer test through an injected v1
  public client and imports no LeanAgileOS source path.
- Singularity ADR-088 (🔴 **not ported to `lean-agile-os`** — [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md) §5) establishes VS Codium plus a NestJS sidecar as a separate reference integration over the
  same public contract; Portfolio remains independent of editor and sidecar packages.

## Deferred implementation decisions

The concrete encryption provider/configuration, backup/restore runbook, and hosted/package delivery
mechanism are Phase 05/Phase 01 implementation decisions. They do not alter the Phase 00 public
boundary or its contract artifacts.

## Validation status

- `npm run test:workflow-contract` passes.
- `npm run test:bdd` passes on Node 24.19.0: 5 scenarios and 13 steps pass.
- `node --test libs/workflow-engine/public/index.spec.mjs` passes in LeanAgileOS: 2 tests pass.
- `npm run test:package-consumer` in `libs/workflow-engine` passes: a clean temporary consumer
  installs the generated tarball by package name and executes the public v1 contract.

## Risks and controls

| Risk | Control |
| --- | --- |
| A convenient source import couples Portfolio to private implementation | ADR and contract test reject private package/path imports. |
| Event payloads expose visitor or proprietary data | Explicit allowlist, field-level classification, redaction before persistence, and sanitized fixtures only. |
| Recorded events are mistaken for executable automation | Require macro input bindings, policy, human approval, immutable version, and command-based disposable replay. |
| PouchDB content enters a Docker image | Image audit permits only public baselines/sanitized fixtures; runtime data and keys are mounted/injected. |

## Next unchecked item

Start Phase 01 on a new phase branch: consume the delivered `@singularity/workflow-engine` package
or a hosted adapter from the Portfolio runtime, then replace the injected test double with that
real integration.
