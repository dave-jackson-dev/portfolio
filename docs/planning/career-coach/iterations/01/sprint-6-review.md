# Sprint 6 Review — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Sprint Goal (from `sprint-6-plan.md`):** CC-011/012's three Three Amigos Scenarios
(`06-three-amigos.md` Feature 6) Green — no new stub-adapter boundary this Sprint.

---

## Information Radiator Status

Verified genuinely Green on `phase/career-coach/06-track-my-applications` (not yet merged;
re-run with `--skip-nx-cache` during this Review, not taken on developer say-so):

| Layer                | Evidence                                         | Result                         |
| -------------------- | ------------------------------------------------ | ------------------------------ |
| Domain               | `nx test career-coach-domain --coverage`         | 33/33 unit tests               |
| Application          | `nx test career-coach-application --coverage`    | 38/38 unit tests               |
| Infrastructure       | `nx test career-coach-infrastructure --coverage` | 25/25 unit tests               |
| Feature (UI)         | `nx test career-coach-feature-list --coverage`   | 43/43 component tests          |
| API                  | `nx test career-coach-api --coverage`            | 21/21 tests                    |
| Domain-tier Cucumber | `nx run career-coach-domain-e2e:cucumber`        | 16/16 Scenarios, 91/91 steps   |
| HTTP-Domain Cucumber | `nx run career-coach-api-e2e:cucumber`           | 29/29 Scenarios, 134/134 steps |

All 13 tasks in `sprint-6-plan.md` (1-13, including 7a/10a) are Green.

## Stories Demoed

- **CC-011 — View My Application Status Across the Full Pipeline**: `ApplicationPipelineComponent`
  shows the current Application's stage against AD2's full pipeline
  (`Submitted → PhoneScreen → HiringManagerSubmission → Interview → FinalInterview → Offer/NoOffer`),
  plus an "Other Applications" list. Domain-tier Scenario "View the Application's current pipeline
  stage" — Green.
- **CC-012 — Receive an Update When an Application's Status Changes**: advancing an Application
  (self-reported, via "Advance to `<next stage>`") or rejecting it surfaces immediately in the
  Pipeline screen's notification banner and stage tracker. Domain-tier Scenarios "Application
  advances to PhoneScreen" and "Application is rejected directly from Submitted" — both Green,
  including the business rule that a rejection records _which_ stage it happened at
  (`rejectedAtStage`), not just a generic flag.

**No stub-adapter boundary this Sprint — confirmed correct, not just claimed.** Unlike Sprints
2-5, Domain Storytelling names no System Actor for Story 6 (`04-domain-storytelling.md`) — the
Application entity's own state machine drives the Pipeline, with no external integration to
defer. This Sprint's scope decisions (self-reported stage tracking, UI-layer-only notification —
no Notification aggregate) were made explicit in `sprint-6-plan.md` before implementation, not
discovered as gaps afterward.

**Two real defects found and fixed via genuine Red-Green cycles during the post-Sprint compliance
pass**, both confirmed with a failing spec/scenario before the fix:

1. `GET /applications/:positionId` had no ownership check — a real broken-access-control gap
   (any authenticated caller could fetch another user's Application). Fixed by threading `userId`
   through the query and treating a non-owned Application identically to "not found."
2. `GET /applications` (Task 9's list endpoint) had zero Cucumber coverage — a real gap against
   the mandatory smoke-test standard. Two new Scenarios added.

## Specification Gaps Identified During Review

None new beyond the two defects above (both found and fixed during implementation, not during
this Review). Zero-Trust boundary coverage for advance/reject was scoped correctly at Sprint
Planning time (same shape as Sprint 5's submit ownership check) and confirmed Green by Task 10a's
Scenarios.

## Stakeholder Feedback (Founder, verbatim from session)

- Confirmed the "no stub adapter, self-reported tracking, UI-layer notification" scope decisions
  before Sprint Planning was accepted — a genuinely different shape of decision than Sprints 2-5's
  boundary-swap pattern, reasoned through explicitly rather than defaulted to.
- On the post-Sprint compliance findings: the compliance tool was run twice this Sprint (before
  and after fixing the two real defects), and the two runs showed real inconsistency — the
  identical `CURRENT_USER_ID` hardcoded-auth pattern was scored low/high/critical across
  Sprints 4/5/6 with no code change to explain the swing, and one run's `code-review`/
  `process-review` agents both claimed the `pursue` endpoint had no smoke-test coverage when it
  demonstrably does (verified directly against `application-api.feature`). Confirmed findings
  empirically rather than trusting severity labels at face value — consistent with the pattern
  Sprint 5's Retrospective flagged, now observed a second time with a starker before/after
  contrast on the same PR.

## Carried / Deferred (not stories — infrastructure gaps, tracked separately)

- Real Anthropic SDK-backed `ApplicationAutomationService` field/cover-letter drafting (Sprint 5's
  own scope boundary, still carried)
- Real Anthropic SDK-backed `RequirementRefinementService` implementation (carried from Sprint 4)
- Real Anthropic SDK-backed `QualificationService` implementation (carried from Sprint 3)
- Real Playwright-driven `PositionSourcingPort` implementation (carried from Sprint 2)
- Real TypeDB persistence (Sprint 1's Provision Environment Pillar 2 deferral, still carried)
- Full platform-iam/api-gateway Bearer-token auth wiring (parking lot, pending)
- DOM-HTTP-Domain Cucumber/Screenplay UI smoke test, now covering `ApplicationPipelineComponent`
  too (parking lot, `#architecture`, same gap as Sprints 1-5)
- `positionId`/`applicationId` path param validation pipes (already-decided deferral, Sprint 3)
- Real employer/ATS integration for stage tracking (explicitly out of MVP scope, not merely
  deferred behind a stub port — this Sprint's own scope decision, see Sprint Goal above)
- Real push/email notification delivery (explicitly out of MVP scope — this Sprint's own scope
  decision)

None of the above block CC-011/012's committed Sprint Goal being genuinely Green — they are
follow-on infrastructure and deliberately out-of-scope integrations, not unmet acceptance
criteria for what this Sprint actually committed to.

## v1 Scope Complete

This is the last Sprint in `08-mvp-plan.md`'s v1 cut (Sprints 1-6, CC-001–CC-012). With this
Sprint Green, the full career-coach v1 golden path is real, tested, and demonstrable end to end:
intake → build Strategy Plan → source Positions → qualify → give feedback (refining requirements)
→ pursue → prepare & submit an Application → track it through the full pipeline. Sprints 7-8
(Interview Prep, Negotiation) remain deferred to Release 2 per the MVP Planning workshop's
original cut.
