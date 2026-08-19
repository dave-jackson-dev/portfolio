# Phase 02 — PouchDB Recording Model Checklist

**Status:** In progress

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/02-pouchdb-recording-model`

- [x] Add a Portfolio-owned PouchDB recorder with a memory-backed test configuration.
- [x] Persist only allowlisted, reduced event fields and reject every unapproved type before write.
- [x] Make event delivery idempotent by stable event identity.
- [x] Add deterministic snapshot export, integrity verification, and restore coverage.
- [x] Align the Phase 00 JSON schemas and sanitized fixtures to the implemented recording projection.
- [ ] Add PouchDB indexes and retention/purge behavior.
- [ ] Add conflict/retry and recovery fixtures for durable runtime storage.

## Validation evidence

- `npm run test:bdd` — 12 scenarios, 36 steps passed.
- `npm run test:workflow-contract` — approved macro, delegated event, and redacted recording fixtures passed; 27 contract source files checked.
