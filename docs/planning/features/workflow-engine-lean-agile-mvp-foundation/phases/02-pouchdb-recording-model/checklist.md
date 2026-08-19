# Phase 02 — PouchDB Recording Model Checklist

> **Ownership moved:** The reusable Lean-Agile MVP package, generic specifications, and the
> canonical historical copy of this document now live in [Singularity Phase 21](https://github.com/dave-jackson-dev/singularity/blob/dev/docs/planning/singularity/features/resumable-workflow-steps/phases/21-live-product-pilot-and-extraction-decision/evidence/portfolio-lean-agile-mvp-foundation/phases/02-pouchdb-recording-model/checklist.md).
> This Portfolio copy remains as a consumer-side forwarding and integration record.

**Status:** Complete

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/02-pouchdb-recording-model`

- [x] Add a Portfolio-owned PouchDB recorder with a memory-backed test configuration.
- [x] Persist only allowlisted, reduced event fields and reject every unapproved type before write.
- [x] Make event delivery idempotent by stable event identity.
- [x] Add deterministic snapshot export, integrity verification, and restore coverage.
- [x] Align the Phase 00 JSON schemas and sanitized fixtures to the implemented recording projection.
- [x] Use deterministic event-ID keys for event lookup and add one-week retention/purge behavior.
- [x] Reject conflicting reuse of an event identity without overwriting the original immutable record.
- [x] Prove sanitized durable-store close/reopen recovery using a temporary local PouchDB prefix.

## Validation evidence

- `npm run test:bdd` — 15 scenarios, 45 steps passed.
- `npm run test:workflow-contract` — approved macro, delegated event, and redacted recording fixtures passed; 27 contract source files checked.
