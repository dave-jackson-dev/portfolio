# Phase 03 — Event Ingress and Macro Authoring Checklist

**Status:** In progress

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/03-event-ingress-and-macro-authoring`

- [x] Route approved events through the Phase 02 recording/reduction boundary.
- [x] Add human-principal macro approval and immutable versioned macro identifiers.
- [x] Restrict macro recipes to an explicit replay command allowlist and disposable workspaces.
- [x] Prove replay dispatches fresh public commands rather than historical events.
- [x] Add immutable macro-version lineage and Service Account approval-denial coverage.
- [x] Align macro schema/fixtures with the authoring projection.
- [ ] Add a provider-backed replay compatibility test after the public replay command is accepted.

## Validation evidence

- Pending: `npm run test:bdd` and `npm run test:workflow-contract`.
