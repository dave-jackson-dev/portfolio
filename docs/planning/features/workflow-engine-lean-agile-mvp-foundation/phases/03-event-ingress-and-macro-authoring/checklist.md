# Phase 03 — Event Ingress and Macro Authoring Checklist

**Status:** Complete

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/03-event-ingress-and-macro-authoring`

- [x] Route approved events through the Phase 02 recording/reduction boundary.
- [x] Add human-principal macro approval and immutable versioned macro identifiers.
- [x] Restrict macro recipes to an explicit replay command allowlist and disposable workspaces.
- [x] Prove replay dispatches fresh public commands rather than historical events.
- [x] Add immutable macro-version lineage and Service Account approval-denial coverage.
- [x] Align macro schema/fixtures with the authoring projection.
- [x] Add a provider-backed replay compatibility test through the public `workflow macro replay` command (Singularity PR #1021, merge commit `393ed6e4`).

## Validation evidence

- `npm run test:bdd` — 20 scenarios, 60 steps passed.
- `npm run test:workflow-contract` — approved macro, delegated event, and redacted recording fixtures passed; 28 contract source files checked.
