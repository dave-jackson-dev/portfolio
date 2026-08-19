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
- The same plan assigns PouchDB authoritative workflow state/audit persistence and requires
  idempotent event handlers for safe changes-feed replay.
- Portfolio's feature plan prohibits direct cross-service datastore reads and limits event ingress
  to approved, versioned `PlatformEventEnvelope` messages.

## Open decisions

1. The exact package/service name and contract version (`v1`) for the public engine adapter.
2. The canonical JSON success/error envelope and stable error-code set.
3. The initial allowlisted event types and the field-level redaction schema.
4. Encryption mechanism, key-management boundary, and backup/restore operating model for the
   runtime PouchDB store.
5. Where cross-repository compatibility tests execute and which repository owns their fixtures.

## Risks and controls

| Risk | Control |
| --- | --- |
| A convenient source import couples Portfolio to private implementation | ADR and contract test reject private package/path imports. |
| Event payloads expose visitor or proprietary data | Explicit allowlist, field-level classification, redaction before persistence, and sanitized fixtures only. |
| Recorded events are mistaken for executable automation | Require macro input bindings, policy, human approval, immutable version, and command-based disposable replay. |
| PouchDB content enters a Docker image | Image audit permits only public baselines/sanitized fixtures; runtime data and keys are mounted/injected. |

## Next unchecked item

Draft the matching Portfolio and Singularity ADRs. They must declare the public boundary,
ownership, exclusions, and the versioning/compatibility process before the implementation of
Phase 01 begins.
