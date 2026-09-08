# Sprint 3 Review — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Sprint Goal (from `sprint-3-plan.md`):** CC-005/006's three Three Amigos Scenarios
(`06-three-amigos.md` Feature 3) Green, backed by a stub `IPositionQualificationPort` — real
Anthropic SDK-backed evaluation explicitly deferred.

---

## Information Radiator Status

Verified genuinely Green on `phase/career-coach/03-qualify-positions` (not yet merged to `main`;
re-run live during this Review, not taken on developer say-so) — real specs against the real
system, not mocks:

| Layer                | Evidence                                         | Result                       |
| -------------------- | ------------------------------------------------ | ---------------------------- |
| Domain               | `nx test career-coach-domain --coverage`         | 17/17 unit tests             |
| Application          | `nx test career-coach-application --coverage`    | 15/15 unit tests             |
| Infrastructure       | `nx test career-coach-infrastructure --coverage` | 13/13 unit tests             |
| Feature (UI)         | `nx test career-coach-feature-list --coverage`   | 19/19 component tests        |
| API                  | `nx test career-coach-api --coverage`            | 13/13 tests                  |
| Domain-tier Cucumber | `nx run career-coach-domain-e2e:cucumber`        | 8/8 Scenarios, 43/43 steps   |
| HTTP-Domain Cucumber | `nx run career-coach-api-e2e:cucumber`           | 14/14 Scenarios, 52/52 steps |

All 14 tasks in `sprint-3-plan.md` (1-12, including 6a/10a) are Green.

## Stories Demoed

- **CC-005 — Qualify a Sourced Position Against My Requirements**: `PositionFeedComponent` gains a
  "Qualify" action on each `Sourced` row. `POST /positions/:positionId/qualify` (behind
  `RequireUserIdGuard`, `userId` from `AuthenticatedUserId()` only) loads the Position and the
  caller's own `StrategyPlan`, runs `QualifyPositionCommand` through the stub
  `IPositionQualificationPort`, and transitions the Position to `Qualified` (all requirements met)
  or `Rejected` (a stated reason, e.g. failing a hard remote-only requirement) — surfaced in the UI
  as a badge + reason. Domain-tier Scenarios "Qualify a Position that matches all requirements" and
  "Reject a Position that fails a hard requirement" — both Green.
- **CC-006 — Refine a Qualification Up to 3 Passes**: an ambiguous match resolves to `Qualified`
  within a simulated 2nd pass (`passesUsed` on `QualificationVerdict` reflects this), and no 4th
  pass is ever attempted — the state machine (`Sourced` → `Qualified`|`Rejected`) rejects any
  transition attempt from a non-`Sourced` status. Domain-tier Scenario "Refine a borderline
  Position across up to 3 passes" — Green.

**Accepted as Green, with the same explicit scope caveat as Sprint 2**: what's Green this Sprint is
the full pipeline (domain → UI) proven correct against a deterministic stub adapter whose fixture
verdicts reproduce the three Three Amigos Scenarios exactly. Real Anthropic SDK-backed evaluation
of a Position's free-text `Requirement`s against `RequirementSet` — the actual NLP reasoning
Architecture Design scoped this service around — is a deliberately separate, not-yet-started piece
of work, confirmed before Sprint Planning was accepted (same boundary-swap pattern as Sprint 1's
persistence and Sprint 2's sourcing).

## Specification Gaps Identified During Review

None new. The Sprint 2 Retrospective's action item (ask what Zero-Trust means for _this_ story's
shape, not default to a cross-user template) was applied directly in Sprint Planning rather than
surfacing as a review-time gap: `Position` still has no owner, but qualifying one always resolves
the caller's _own_ `StrategyPlan` via `userId`, never a param — Task 10a's new HTTP-Domain Scenario
("a caller's own Strategy Plan is always used for qualification, regardless of any other userId
supplied") covers exactly this boundary and is Green.

## Stakeholder Feedback (Founder, verbatim from session)

- Confirmed the stub-adapter scope decision (deterministic fixture verdicts, no live Anthropic
  calls) before Sprint Planning was accepted — same reasoning as Sprint 2: keep the Sprint to
  what's buildable and testable now, flag the live-API cost/reasoning risk as its own future,
  explicitly-scoped piece of work rather than attempting it live in-session.
- On the post-Sprint compliance findings: accepted all as the same already-decided categories
  from Sprints 1-2 (hardcoded dev-fixture auth, missing DOM-HTTP-Domain UI test, ATDD
  scenario-title naming, commit-message format) rather than re-opening any of them — the one new
  finding (`positionId` path param has no explicit validation pipe) accepted as low-severity and
  consistent with the rest of this controller's existing parameter handling, not fixed this Sprint.

## Carried / Deferred (not stories — infrastructure gaps, tracked separately)

- Real Anthropic SDK-backed `QualificationService` implementation (this Sprint's own explicit
  scope boundary — see Sprint Goal above)
- Real Playwright-driven `PositionSourcingPort` implementation (carried from Sprint 2)
- Real TypeDB persistence (Sprint 1's Provision Environment Pillar 2 deferral, still carried)
- Full platform-iam/api-gateway Bearer-token auth wiring (parking lot, pending)
- DOM-HTTP-Domain Cucumber/Screenplay UI smoke test, now covering `PositionFeedComponent`'s
  Qualify action too (parking lot, `#architecture`, updated 2026-07-25)
- `positionId` path param validation pipe (new, low severity — compliance pass finding)
- Repo-wide sweep of ATDD Scenario-title "I CAN"/"I CANNOT" naming convention (spans Sprint 2's
  scenarios too, not new to this Sprint)

None of the above block CC-005/006's committed Sprint Goal being genuinely Green — they are
follow-on infrastructure and a deliberately out-of-scope reasoning-engine boundary, not unmet
acceptance criteria for what this Sprint actually committed to.
