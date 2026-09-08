# Sprint 4 Review — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Sprint Goal (from `sprint-4-plan.md`):** CC-007/008's two Three Amigos Scenarios
(`06-three-amigos.md` Feature 4) Green, backed by a stub `IRequirementRefinementPort` — real
Anthropic SDK-backed refinement explicitly deferred.

---

## Information Radiator Status

Verified genuinely Green on `phase/career-coach/04-give-feedback-refine-requirements` (not yet
merged; re-run with `--skip-nx-cache` during this Review, not taken on developer say-so):

| Layer                | Evidence                                         | Result                       |
| -------------------- | ------------------------------------------------ | ---------------------------- |
| Domain               | `nx test career-coach-domain --coverage`         | 20/20 unit tests             |
| Application          | `nx test career-coach-application --coverage`    | 19/19 unit tests             |
| Infrastructure       | `nx test career-coach-infrastructure --coverage` | 15/15 unit tests             |
| Feature (UI)         | `nx test career-coach-feature-list --coverage`   | 25/25 component tests        |
| API                  | `nx test career-coach-api --coverage`            | 14/14 tests                  |
| Domain-tier Cucumber | `nx run career-coach-domain-e2e:cucumber`        | 10/10 Scenarios, 55/55 steps |
| HTTP-Domain Cucumber | `nx run career-coach-api-e2e:cucumber`           | 18/18 Scenarios, 80/80 steps |

All 14 tasks in `sprint-4-plan.md` (1-11, including 5a/8a) are Green.

## Stories Demoed

- **CC-007 — Review Positions and Give Feedback**: `PositionFeedComponent` gains Approve/Reject
  actions on each `Qualified` row. Approving calls `POST /positions/:positionId/feedback` with
  `{approved: true}` — recorded on the Position, no downstream effect. Rejecting opens an inline
  note field (per `07-ux-design.md`); submitting posts `{approved: false, note}`. Domain-tier
  Scenario "Approve a Qualified Position without changing requirements" — Green.
- **CC-008 — Update My Requirements from Feedback**: rejection feedback with a note calls
  `IRequirementRefinementPort.refine` on the caller's own Requirement Set and saves the revision.
  `StrategyPlanComponent`'s existing revision banner (built in Sprint 1, unchanged this Sprint)
  displays the resulting `revisionNote`, now attributed to the triggering Position
  (`"<note> (from feedback on <positionId>)"`) so the cross-reference `07-ux-design.md` calls for
  is satisfied without any UI-layer change. Domain-tier Scenario "Reject a Qualified Position and
  refine a requirement" — Green.

**Accepted as Green, with the same explicit scope caveat as Sprints 2-3**: what's Green this
Sprint is the full pipeline (domain → UI) proven correct against a deterministic stub adapter
whose fixture mapping reproduces the one Scenario that actually revises the Requirement Set.
Real Anthropic SDK-backed refinement of arbitrary free-text feedback is a deliberately separate,
not-yet-started piece of work, confirmed before Sprint Planning was accepted.

**Notable finding this Sprint, not in the original task list**: writing the HTTP-Domain Zero-Trust
Scenario (Task 8a) surfaced that `GiveFeedbackOnPositionHandler` saved Position feedback _before_
checking the caller's StrategyPlan existed — unlike `QualifyPositionHandler`'s established
precondition-before-mutation ordering. Fixed via a genuine Red-Green cycle (a handler-spec
assertion confirmed Red first) rather than patched silently; this is exactly the kind of gap
real HTTP-level Scenario-writing catches that unit tests alone did not.

## Specification Gaps Identified During Review

None new. Zero-Trust boundary coverage was scoped correctly at Sprint Planning time (own-
`StrategyPlan`-only, same shape as Sprint 3) and Task 8a's new HTTP-Domain Scenario
("Feedback always resolves the RequirementSet from the caller's own StrategyPlan...") covers it —
confirmed Green, not found as a review-time gap.

## Stakeholder Feedback (Founder, verbatim from session)

- Confirmed the stub-adapter scope decision (deterministic fixture mapping, no live Anthropic
  calls) before Sprint Planning was accepted — same reasoning as Sprints 2-3.
- On the post-Sprint compliance findings: accepted the security/standards/ATDD/process findings
  as the same already-decided categories from Sprints 1-3, plus confirmed two are false positives
  from the known triple-dot diff-drift issue (Developer Portal commits pulled in via this
  session's `dev`/`main` sync merges under ADR-064) rather than real findings against this
  Sprint's own work. The one genuine new finding (missing `aria-label` on the rejection-note
  input) was fixed immediately in-session, not deferred.

## Carried / Deferred (not stories — infrastructure gaps, tracked separately)

- Real Anthropic SDK-backed `RequirementRefinementService` implementation (this Sprint's own
  explicit scope boundary — see Sprint Goal above)
- Real Anthropic SDK-backed `QualificationService` implementation (carried from Sprint 3)
- Real Playwright-driven `PositionSourcingPort` implementation (carried from Sprint 2)
- Real TypeDB persistence (Sprint 1's Provision Environment Pillar 2 deferral, still carried)
- Full platform-iam/api-gateway Bearer-token auth wiring (parking lot, pending)
- DOM-HTTP-Domain Cucumber/Screenplay UI smoke test, now covering `PositionFeedComponent`'s
  Approve/Reject actions too (parking lot, `#architecture`, same gap as Sprints 1-3)
- `PositionFeedComponent`'s outer `<div>` has no ARIA landmark role (new, low severity —
  compliance ux-review finding, consistent with existing sibling components' same pattern)
- Repo-wide sweep of ATDD Scenario-title "I CAN"/"I CANNOT" naming convention (spans Sprints 2-3's
  scenarios too, not new to this Sprint)
- Batch review of the accumulating low-severity compliance backlog before Sprint 5/6 (Sprint 3
  Retrospective action item, still open)

None of the above block CC-007/008's committed Sprint Goal being genuinely Green — they are
follow-on infrastructure and a deliberately out-of-scope reasoning-engine boundary, not unmet
acceptance criteria for what this Sprint actually committed to.
