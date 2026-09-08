# Sprint 5 Review — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Sprint Goal (from `sprint-5-plan.md`):** CC-009/010's three Three Amigos Scenarios
(`06-three-amigos.md` Feature 5) Green, backed by a stub `IApplicationSubmissionPort` — real
Anthropic SDK-backed field/cover-letter drafting explicitly deferred.

---

## Information Radiator Status

Verified genuinely Green on `phase/career-coach/05-apply-to-positions` (not yet merged; re-run
with `--skip-nx-cache` during this Review, not taken on developer say-so):

| Layer                | Evidence                                         | Result                         |
| -------------------- | ------------------------------------------------ | ------------------------------ |
| Domain               | `nx test career-coach-domain --coverage`         | 25/25 unit tests               |
| Application          | `nx test career-coach-application --coverage`    | 29/29 unit tests               |
| Infrastructure       | `nx test career-coach-infrastructure --coverage` | 23/23 unit tests               |
| Feature (UI)         | `nx test career-coach-feature-list --coverage`   | 36/36 component tests          |
| API                  | `nx test career-coach-api --coverage`            | 18/18 tests                    |
| Domain-tier Cucumber | `nx run career-coach-domain-e2e:cucumber`        | 13/13 Scenarios, 71/71 steps   |
| HTTP-Domain Cucumber | `nx run career-coach-api-e2e:cucumber`           | 22/22 Scenarios, 103/103 steps |

All 19 tasks in `sprint-5-plan.md` (1-19, including 10a/15a) are Green.

## Stories Demoed

- **CC-009 — Choose Which Positions to Pursue**: `PositionFeedComponent` gains a "Pursue" action
  on each `Qualified` row (alongside the existing Approve/Reject feedback controls). Clicking it
  dispatches `PursuePositionCommand` (`Position` transitions `Qualified` → `Pursued`, AD4's state
  machine). Domain-tier Scenario "Choose a Qualified Position to pursue" — Green.
- **CC-010 — Prepare My Application for Review and Submit**: the same click chains straight into
  `PrepareApplicationCommand` (a new `Application` aggregate is created with status `Prepared`,
  its fields drafted by the stub `IApplicationSubmissionPort`), then navigates to the new
  `/application-review/:positionId` route. `ApplicationReviewComponent` shows Full
  Name/Resume/Cover Letter and AD3's hybrid-submission callout ("submitting uses your own
  account... not an autonomous action"), with a "Submit Application" button that dispatches
  `SubmitApplicationCommand`. Domain-tier Scenarios "Prepare an Application for review" and
  "Submit the prepared Application myself" — both Green.

**Accepted as Green, with the same explicit scope caveat as Sprints 2-4**: what's Green this
Sprint is the full pipeline (domain → UI) proven correct against a deterministic stub adapter.
Real Anthropic SDK-backed field/cover-letter drafting is a deliberately separate, not-yet-started
piece of work, confirmed before Sprint Planning was accepted — same boundary-swap pattern as
Sprints 1-4.

**New aggregate, new architecture pattern proven**: this is the first Sprint to introduce a third
aggregate (`Application`, per AD2) rather than extend `Position`/`StrategyPlan` — the pattern held
without needing new conventions (a new port, a new repository, a new controller, all following
the exact shape of the existing three).

**Two notable findings this Sprint, not in the original task list**:

1. `nx build career-coach-api` failed against the new `ApplicationController` until its
   dependency libs were rebuilt first — a recurrence of Sprint 3's already-documented
   webpack-resolves-via-`dist/` gotcha, now hit on a genuinely new aggregate's first build.
2. Writing Task 15a's HTTP-Domain Scenarios surfaced a real, previously-invisible gap:
   `career-coach-api-e2e` had no per-Scenario repository reset (unlike `domain-e2e`, fixed in
   Sprint 3 for the identical class of bug). It was invisible for four Sprints because no prior
   Scenario performed a non-reversible mutation on the shared fixture Positions —
   `Position.pursue()` is this suite's first one, and 3 previously-green Scenarios in
   `position-api.feature` broke for real the moment it was introduced. Fixed via a genuine
   Red-Green cycle (repository `clear()` methods, specs confirmed Red first) rather than working
   around the symptom.

## Specification Gaps Identified During Review

None new. Zero-Trust boundary coverage (only the Application's own owner can submit it) was
scoped correctly at Sprint Planning time — the first career-coach story checking ownership on the
target aggregate itself rather than a related `StrategyPlan` — and Task 15a's new HTTP-Domain
Scenario confirms it Green, not found as a review-time gap.

## Stakeholder Feedback (Founder, verbatim from session)

- Confirmed the stub-adapter scope decision (deterministic fixture fields, no live Anthropic
  calls, no literal-text assertions to match) before Sprint Planning was accepted — same
  reasoning as Sprints 2-4.
- Confirmed the UI-orchestration approach (one click chains two independent domain commands, per
  `07-ux-design.md`'s screen-flow diagram) rather than merging `Pursue`/`Prepare` into a single
  domain command — keeps AD2's aggregate boundary clean while still matching the UX design.
- On the post-Sprint compliance findings: accepted the security/standards/process findings as the
  same already-decided categories from Sprints 1-4, confirmed one is a diff-drift false positive
  (Sprint 4's own already-merged `fix:` commit reappearing under this phase branch's diff-vs-`main`
  scope, per ADR-064's `dev`/`main` cross-merge), and confirmed the `code-review` agent's "high"
  finding was a genuine false positive — verified empirically against two successful builds rather
  than taken on the agent's claim alone.

## Carried / Deferred (not stories — infrastructure gaps, tracked separately)

- Real Anthropic SDK-backed `ApplicationAutomationService` field/cover-letter drafting (this
  Sprint's own explicit scope boundary — see Sprint Goal above)
- Real Anthropic SDK-backed `RequirementRefinementService` implementation (carried from Sprint 4)
- Real Anthropic SDK-backed `QualificationService` implementation (carried from Sprint 3)
- Real Playwright-driven `PositionSourcingPort` implementation (carried from Sprint 2)
- Real TypeDB persistence (Sprint 1's Provision Environment Pillar 2 deferral, still carried)
- Full platform-iam/api-gateway Bearer-token auth wiring (parking lot, pending)
- DOM-HTTP-Domain Cucumber/Screenplay UI smoke test, now covering `PositionFeedComponent`'s
  Pursue action and the new `ApplicationReviewComponent` too (parking lot, `#architecture`, same
  gap as Sprints 1-4)
- Repo-wide sweep of ATDD Scenario-title "I CAN"/"I CANNOT" naming convention (spans Sprints 2-4's
  scenarios too, not new to this Sprint)
- Batch review of the accumulating low-severity compliance backlog before Sprint 5/6 (Sprint 3
  Retrospective action item — now genuinely due, this is Sprint 5)

None of the above block CC-009/010's committed Sprint Goal being genuinely Green — they are
follow-on infrastructure and a deliberately out-of-scope reasoning-engine boundary, not unmet
acceptance criteria for what this Sprint actually committed to.
