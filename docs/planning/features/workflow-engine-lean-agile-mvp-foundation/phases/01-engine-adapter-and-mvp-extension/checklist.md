# Phase 01 — Engine Adapter and MVP Extension Baseline Checklist

> **Ownership moved:** The reusable Lean-Agile MVP package, generic specifications, and the
> canonical historical copy of this document now live in [Singularity Phase 21](https://github.com/dave-jackson-dev/singularity/blob/dev/docs/planning/singularity/features/resumable-workflow-steps/phases/21-live-product-pilot-and-extraction-decision/evidence/portfolio-lean-agile-mvp-foundation/phases/01-engine-adapter-and-mvp-extension/checklist.md).
> This Portfolio copy remains as a consumer-side forwarding and integration record.

**Status:** Complete

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/01-engine-adapter-and-mvp-extension`

- [x] Create the Phase 01 branch, checklist, and summary.
- [x] Implement the Portfolio-owned Lean-Agile MVP state machine and transition invariants.
- [x] Require immutable evidence before evidence review and outcome decisions.
- [x] Restrict pivot-or-persevere decisions to a human principal.
- [x] Drive workflow creation through the existing injected public v1 client adapter.
- [x] Add executable BDD coverage for the happy path, Service Account decision rejection, and revised-pivot hypothesis requirement.
- [x] Select VS Codium extension plus local sidecar as the Phase 01 delivery channel; defer hosted routing to Singularity Runtime Routing.
- [x] Retain the injected public client boundary for any future hosted Runtime Routing adapter; Portfolio does not import a sibling Singularity path.
- [x] Package and smoke-test the VSIX with a configured local sidecar executable.
- [x] Merge the engine-side immutable audit persistence and public transition mapping into Singularity `dev` (PR #1019, merge commit `dd21bf26`).

## Validation evidence

- `npm run test:bdd` — 9 scenarios, 27 steps passed.
- `npm run test:workflow-contract` — approved macro fixture and 26 contract source files checked.
- `npx vsce package --no-dependencies --out /tmp/workflow-engine-vscodium-0.1.0.vsix` — VSIX package produced successfully; the sidecar lifecycle test starts, restarts, and dispatches against the NestJS stdio host.
