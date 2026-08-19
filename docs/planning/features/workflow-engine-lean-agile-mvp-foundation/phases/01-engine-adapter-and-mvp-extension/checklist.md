# Phase 01 — Engine Adapter and MVP Extension Baseline Checklist

**Status:** In progress

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/01-engine-adapter-and-mvp-extension`

- [x] Create the Phase 01 branch, checklist, and summary.
- [x] Implement the Portfolio-owned Lean-Agile MVP state machine and transition invariants.
- [x] Require immutable evidence before evidence review and outcome decisions.
- [x] Restrict pivot-or-persevere decisions to a human principal.
- [x] Drive workflow creation through the existing injected public v1 client adapter.
- [x] Add executable BDD coverage for the happy path, Service Account decision rejection, and revised-pivot hypothesis requirement.
- [ ] Bind the Portfolio runtime composition root to the delivered package or hosted adapter.
- [ ] Add a real package/hosted-adapter compatibility test replacing the injected test client.
- [ ] Merge the engine-side immutable audit persistence and public transition mapping (`feat/workflow-engine-public-extension-transitions`) into Singularity `dev`.

## Validation evidence

- `npm run test:bdd` — 9 scenarios, 27 steps passed.
- `npm run test:workflow-contract` — approved macro fixture and 26 contract source files checked.
