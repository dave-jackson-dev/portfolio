# Phase 03 — Event Ingress and Macro Authoring Checklist

> ⚠️ **Repointed 2026-09-08.** This is a **completed phase record**. Every *Singularity* reference in
> it was rewritten to *LeanAgileOS* by the upstream repoint
> ([ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md)); the work it
> describes was carried out when the upstream was `singularity`. Package names in code
> (`@singularity/*`) were deliberately **not** renamed — ADR-002 §4.

> **Ownership moved:** The reusable Lean-Agile MVP package, generic specifications, and the
> canonical historical copy of this document now live in [LeanAgileOS Phase 21](https://github.com/dave-jackson-dev/lean-agile-os/blob/dev/docs/planning/lean-agile-os/features/resumable-workflow-steps/phases/21-live-product-pilot-and-extraction-decision/evidence/portfolio-lean-agile-mvp-foundation/phases/03-event-ingress-and-macro-authoring/checklist.md).
> This Portfolio copy remains as a consumer-side forwarding and integration record.

**Status:** Complete

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/03-event-ingress-and-macro-authoring`

- [x] Route approved events through the Phase 02 recording/reduction boundary.
- [x] Add human-principal macro approval and immutable versioned macro identifiers.
- [x] Restrict macro recipes to an explicit replay command allowlist and disposable workspaces.
- [x] Prove replay dispatches fresh public commands rather than historical events.
- [x] Add immutable macro-version lineage and Service Account approval-denial coverage.
- [x] Align macro schema/fixtures with the authoring projection.
- [x] Add a provider-backed replay compatibility test through the public `workflow macro replay` command (LeanAgileOS PR #1021, merge commit `393ed6e4`).

## Validation evidence

- `npm run test:bdd` — 20 scenarios, 60 steps passed.
- `npm run test:workflow-contract` — approved macro, delegated event, and redacted recording fixtures passed; 28 contract source files checked.
