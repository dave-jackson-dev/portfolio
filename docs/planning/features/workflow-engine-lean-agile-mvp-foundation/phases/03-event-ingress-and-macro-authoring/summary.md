# Phase 03 — Event Ingress and Macro Authoring Summary

> ⚠️ **Repointed 2026-09-08.** This is a **completed phase record**. Every *Singularity* reference in
> it was rewritten to *LeanAgileOS* by the upstream repoint
> ([ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md)); the work it
> describes was carried out when the upstream was `singularity`. Package names in code
> (`@singularity/*`) were deliberately **not** renamed — ADR-002 §4.

> **Ownership moved:** The reusable Lean-Agile MVP package, generic specifications, and the
> canonical historical copy of this document now live in [LeanAgileOS Phase 21](https://github.com/dave-jackson-dev/lean-agile-os/blob/dev/docs/planning/lean-agile-os/features/resumable-workflow-steps/phases/21-live-product-pilot-and-extraction-decision/evidence/portfolio-lean-agile-mvp-foundation/phases/03-event-ingress-and-macro-authoring/summary.md).
> This Portfolio copy remains as a consumer-side forwarding and integration record.

**Status:** Complete

The initial Phase 03 boundary deliberately does not replay event history. It first reduces approved
events through the Phase 02 recorder, then creates a separate approved macro version with explicit
input bindings and a disposable-workspace target. Replay calls the public Workflow Engine client
with new command envelopes only.

## Phase outcome

The generic Workflow Engine provider accepts the same replay contract through `workflow macro
replay` (LeanAgileOS PR #1021, merge commit `393ed6e4`). It requires a matching disposable
workspace and dispatches only the allowlisted fresh commands supplied by Portfolio.
