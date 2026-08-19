# Phase 00 — Charter and Contract Freeze Checklist

**Feature:** [Workflow Engine and Lean-Agile MVP Foundation](../../workflow-engine-lean-agile-mvp-foundation.feature.md)

**Status:** In progress

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/00-charter-contract-freeze`

## Goal

Freeze the public boundary Portfolio will consume before any runtime adapter, PouchDB store, or
Lean-Agile MVP workflow is implemented. The boundary must give Portfolio a genuine second-consumer
integration while keeping Singularity's proprietary agents, skills, prompts, private knowledge, and
execution history out of this public repository.

## Work items

- [x] Establish the phase branch, checklist, and decision record.
- [x] Inventory the existing Workflow Engine plan's supported consumer boundary: programmatic
      Nest module/factory, CQRS commands and queries, JSON envelopes, and PouchDB-owned state.
- [x] Record the Portfolio boundary rule: consume commands/queries and versioned envelopes only;
      never import PouchDB repositories or Singularity source paths.
- [x] Reconcile the provider's exported command catalogue with its executable command paths.
- [x] Approve matching Portfolio and Singularity ADRs that name the public contract, its owner,
      and the excluded proprietary surfaces. Runtime compatibility evidence remains pending.
- [x] Agree the contract versioning policy, compatibility window, command/query JSON envelope,
      stable error codes, and correlation/causation identifiers.
- [x] Resolve the activity-projection identity gap with `PlatformEventEnvelope` v2: mandatory
      actor, separate source, optional delegation, and explicit projection audience mapping.
- [x] Define the `MacroRecording` and `WorkflowMacro` schemas, identity/revision semantics,
      redaction fields, retention rules, and public fixture policy.
- [x] Define the first event allowlist and field-level payload classification for records eligible
      to enter the Portfolio recorder.
- [x] Define the Lean-Agile MVP extension state machine: hypothesis, experiment, evidence,
      outcome, and pivot-or-persevere decision gate.
- [x] Define encrypted runtime PouchDB storage, runtime-secret injection, backup/restore, and
      container image-content rules.
- [x] Author the initial executable contract-level Cucumber scenarios for macro approval,
      delegated attribution, disposable replay, and private-import exclusion.
- [x] Add and pass a dependency-free compatibility-fixture validator for the v2 delegated event,
      approved disposable-workspace macro, allowlist, and private-import exclusion.
- [x] Validate the provider-side public module/factory baseline against the v1 request/result
      contract. The provider test exercises supported command dispatch and contract-version
      rejection.
- [x] Agree the two-repository PR sequence, compatibility test location, and integration-test
      owners.

## Contract inventory recorded

| Surface | Portfolio may use | Portfolio must not use |
| --- | --- | --- |
| Workflow lifecycle | Versioned commands, queries, documented JSON result envelopes, and a published module/factory or service adapter | Internal application handlers, domain objects, or source-path imports |
| Persistence | Contract-provided snapshots/audit/projection results | PouchDB repositories, database paths, raw revisions, or direct stores owned by another service |
| Event ingress | Approved, versioned `PlatformEventEnvelope` messages via an adapter | Database reads, unallowlisted payloads, or browser-supplied principal/organization scope |
| Lean-Agile MVP | Portfolio-owned extension definitions and evidence rules | Singularity agents, skills, prompts, private knowledge, model configuration, or execution history |

## Exit gate

The phase is complete only when both repositories approve the ADR pair and the Portfolio thin
adapter's contract test proves that it compiles/runs through the public surface with no private
imports or proprietary artifacts. The provider module/factory baseline is now available; the
Portfolio adapter is Phase 01 work.
