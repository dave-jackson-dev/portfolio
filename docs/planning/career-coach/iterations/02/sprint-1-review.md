# Sprint 1 Review — Career Coach Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-08-13
**Sprint Goal (from `09-sprint-1-plan.md`):** 2a-S5 (sourced with no salary) and F3-S1 (unknown
salary qualified on its other requirements) Green; browser-automation spike observation recorded
(H1/H3).

---

## Information Radiator Status

Verified Green on `phase/career-coach/14-qualification-breakdown` before close:

| Layer                | Evidence                                  | Result           |
| -------------------- | ----------------------------------------- | ---------------- |
| Domain               | `nx test career-coach-domain`             | all pass         |
| Application          | `nx test career-coach-application`        | 48/48            |
| Infrastructure       | `nx test career-coach-infrastructure`     | 101/101          |
| Feature (UI)         | `nx test career-coach-feature-list`       | 58/58            |
| API                  | `nx test career-coach-api`                | 21/21            |
| Domain-tier Cucumber | `nx run career-coach-domain-e2e:cucumber` | 17/17 (F3-S1 ✅) |
| HTTP-Domain Cucumber | `nx run career-coach-api-e2e:cucumber`    | 34/34            |

## Sprint Goal verdict

| Capability                                             | Status                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| **2a-S5** — sourced when the board publishes no salary | ✅ **Green** — `salary not published` badge + count line           |
| **F3-S1** — unknown salary qualified on requirements   | ✅ **Green** — `NotEvaluated` row + summary line + Domain Cucumber |
| **H1/H3** — browser discovery observation recorded     | ⏭️ **Carried to Sprint 2** — D-1 is a founder gate (ToS unread)    |

**Accepted as Green on Phases B and C.** Phase D (browser-automation spike) deferred — it is a
disposable spike by construction; the hypotheses H1 and H3 it answers have no Sprint 2 deliverable
depending on them.

## Stories Demoed

- **2a-S5 — Sourced when the board publishes no salary:** `salary not published` amber badge
  appears on position cards whose `salaryRange` is absent. Count line reads `Showing N of M sourced
Positions`. HTTP-Domain Cucumber 2a-S5 Scenario Green. Live screenshot: 171 Positions, 168
  badged, correct count.

- **F3-S1 — Unknown salary qualified on its other requirements:** `QualificationResultComponent`
  shows a per-requirement breakdown with three visual treatments — Met (green tick), Not met (red),
  and **Not evaluated** (amber dash). Summary line reads _"Qualified on N of M requirements. X
  could not be evaluated."_ DS-3 is now visible rather than hidden: a bare "Qualified" badge would
  have overstated what was verified. Domain-tier Cucumber F3-S1 Scenario Green.

## Defects Found During Sprint

- **B: career-coach API services called a wrong gateway prefix** — `HttpTestingController` asserted
  the URL the service asked for rather than the URL the gateway serves, so all component tests
  passed while every real page was broken. Fixed test-first before B-5. Regression in api-e2e.

- **B: sourcing pass at real board volume exhausts TypeDB connections** — recorded in parking lot,
  not scheduled. Infrastructure-layer defect; no user impact until the sourcing volume grows.
