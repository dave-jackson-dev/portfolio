# Phase 04 — Lean-Agile MVP Workflow Completion Checklist

> ⚠️ **Repointed 2026-09-08.** This is a **completed phase record**. Every *Singularity* reference in
> it was rewritten to *LeanAgileOS* by the upstream repoint
> ([ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md)); the work it
> describes was carried out when the upstream was `singularity`. Package names in code
> (`@singularity/*`) were deliberately **not** renamed — ADR-002 §4.

> **Ownership moved:** The reusable Lean-Agile MVP package, generic specifications, and the
> canonical historical copy of this document now live in [LeanAgileOS Phase 21](https://github.com/dave-jackson-dev/lean-agile-os/blob/dev/docs/planning/lean-agile-os/features/resumable-workflow-steps/phases/21-live-product-pilot-and-extraction-decision/evidence/portfolio-lean-agile-mvp-foundation/phases/04-lean-agile-mvp-workflow-completion/checklist.md).
> This Portfolio copy remains as a consumer-side forwarding and integration record.

**Status:** Complete

**Branch:** `phase/workflow-engine-lean-agile-mvp-foundation/04-lean-agile-mvp-workflow-completion`

- [x] Make transition gates validate unique immutable evidence references.
- [x] Preserve human pivot/persevere decision metadata in immutable transition history.
- [x] Provide a read-only workflow projection for later activity-feed consumers.
- [x] Add representative persevere and evidence-rejection Cucumber scenarios.
- [x] Add a representative pivot-to-revised-hypothesis projection scenario.
- [x] Establish the Lean-Agile MVP workflow-record requirement for Phase 05 onward without fabricating retroactive runtime history.
- [x] Add the nine ordered Lean-Agile MVP workshops as child workflows with immutable, versioned artifact outputs.
- [x] Track artifact inputs and transitively reopen downstream workshop consumers when a finding invalidates an artifact.

## Validation evidence

- Portfolio `npm run test:bdd` — 17 consumer/integration scenarios, 49 steps passed.
- LeanAgileOS `npm run test --prefix libs/lean-agile-mvp/workflow` — 3 unit tests, 8 Cucumber
  scenarios / 24 steps, and the isolated package-consumer test passed.
- `npm run test:workflow-contract` — approved macro, delegated event, and redacted recording fixtures passed; 30 contract source files checked.
