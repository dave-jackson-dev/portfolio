# Sprint 4 Plan — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Activity:** Give Feedback & Refine Requirements (Story Map Sprint 4 of 8)
**Stories:** CC-007 — Review Positions and Give Feedback; CC-008 — Update My Requirements from
Feedback

---

## Sprint Goal

By the end of this Sprint, CC-007/008's two Three Amigos Scenarios (`06-three-amigos.md`
Feature 4) are Green:

1. **Reject a Qualified Position and refine a requirement** — feedback rejecting a `Qualified`
   Position with a note updates the caller's `StrategyPlan.RequirementSet`, and the next
   qualification pass for any `Sourced` Position uses the updated set.
2. **Approve a Qualified Position without changing requirements** — feedback approving a
   `Qualified` Position is recorded; the `RequirementSet` is unchanged.

**Explicit scope decision (following the same boundary-swap pattern as Sprints 1-3):** turning a
free-text feedback note ("I don't want fully remote without flexible PTO") into a structured
`RequirementSet` change is exactly the kind of NLP reasoning Architecture Design scoped as
Anthropic SDK-backed work (AD's `QualificationService` precedent), not a simple field mapping.
This Sprint builds a new `IRequirementRefinementPort` behind a stub, deterministic
`StubRequirementRefinementAdapter` whose fixture reproduces the one Scenario that actually
revises the `RequirementSet` exactly. Real Anthropic-backed refinement is deferred to the same
future piece of work as Sprint 3's real qualification evaluation — not built this Sprint.

**Scope note on the UX design's "Pursue doubles as approval" framing:** `07-ux-design.md`'s
Feature 4 section says the (not-yet-built) `Pursue` action is what records approval feedback,
reusing Sprint 5's own trigger rather than a separate control. Sprint 5 (`Pursue`, CC-009) hasn't
been built yet, so that reuse isn't available this Sprint. This Sprint builds a standalone
"Approve" action satisfying the Approve Scenario literally (`Position.giveFeedback(approved:
true)`, no status transition); Sprint 5 can later have `Pursue`'s handler call the same
`giveFeedback(true)` method internally instead of duplicating the approval-recording logic — a
forward-compatible reuse point, not a redesign, when that Sprint is planned.

**Naming note:** the existing `Position.reject(reason)` method (Sprint 3) is a _qualification-time_
transition (`Sourced` → `Rejected`, run by the `QualificationService`/its stub). This Sprint's
"reject" is a _feedback-time_ action on an already-`Qualified` Position that does not change
`Position.status` — modeled as a distinct `Position.giveFeedback(approved, note?)` method, not a
second overload of `reject()`, to avoid conflating two different domain concepts that happen to
share an English verb.

**Zero-Trust data-ownership shape (per Sprint 2/3 Retrospectives' action item — ask what
Zero-Trust means for _this_ story's shape):** giving feedback on a Position always reads/revises
the caller's _own_ `StrategyPlan` via authenticated `userId` — the same "own resource only" shape
Sprint 3 applied to qualification, applied here to which `RequirementSet` a feedback-driven
revision is allowed to touch.

## Task Breakdown

| #   | Task                                                                                                                                                                                                                                                     | Layer                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1   | Extend `Position` entity — add `feedback?: { approved: boolean; note?: string }`; add `giveFeedback(approved, note?)`, throwing unless current status is `Qualified`                                                                                     | Domain               |
| 2   | `IRequirementRefinementPort` — abstract `refine(currentRequirementSet: RequirementSet, feedbackNote: string): Promise<RequirementSet>`                                                                                                                   | Domain               |
| 3   | Domain unit tests — `giveFeedback()` transition rules (success from `Qualified`; throws from any other status), feedback shape                                                                                                                           | Domain               |
| 4   | `GiveFeedbackOnPositionCommand`/Handler — loads `Position` by id, calls `giveFeedback`; if rejecting with a note, loads the caller's `StrategyPlan` by `userId`, calls `IRequirementRefinementPort.refine`, calls `StrategyPlan.revise(...)`, saves both | Application          |
| 5   | Application unit tests                                                                                                                                                                                                                                   | Application          |
| 5a  | Domain-tier Cucumber for Three Amigos Feature 4 (2 Scenarios) — real `CommandBus`, real in-memory `PositionRepository`/`StrategyPlanRepository`, stub `RequirementRefinementPort`                                                                        | Domain-tier Cucumber |
| 6   | `StubRequirementRefinementAdapter` — deterministic fixture matching the one Scenario that revises the `RequirementSet` exactly (no live Anthropic calls)                                                                                                 | Infrastructure       |
| 7   | `PositionController` — add `POST /positions/:positionId/feedback`, behind `RequireUserIdGuard`, `userId` sourced only from `AuthenticatedUserId()` (Zero Trust — never a body param)                                                                     | API                  |
| 8   | Controller smoke tests                                                                                                                                                                                                                                   | API                  |
| 8a  | HTTP-Domain Cucumber additions to `position-api.feature` — the 2 feedback Scenarios plus a Zero-Trust Scenario ("a caller's own Strategy Plan is always used for requirement refinement, regardless of any other userId supplied")                       | HTTP-Domain Cucumber |
| 9   | Extend `PositionFeedComponent` — "Approve"/"Reject" feedback actions on each `Qualified` row (reject opens an inline feedback-note field per `07-ux-design.md`)                                                                                          | Feature (UI)         |
| 10  | Extend `StrategyPlanComponent` — revision banner showing the revised `RequirementSet` and which Position's feedback prompted it, per `07-ux-design.md`'s Strategy Plan mockup                                                                            | Feature (UI)         |
| 11  | Component smoke tests                                                                                                                                                                                                                                    | Feature (UI)         |

No repository extensions needed — `IPositionRepository.findById`/`.save` (Sprint 3) and
`IStrategyPlanRepository.findByUserId`/`.save` (Sprint 1) already cover this Sprint's needs.
Persistence remains in-memory (same Provision Environment Pillar 2 deferral carried since Sprint
1, not re-litigated).

## Definition of Ready check (per `scrum-development-sprints.md`)

- [x] "I CAN" capability statements — CC-007/008 in `03-user-story-map.md`
- [x] Given-When-Then specs (reject-with-refinement, approve-without-change) —
      `06-three-amigos.md` Feature 4
- [x] Zero Trust boundary — Task 8a's new Scenario applies this Sprint's own data-ownership shape
      (own-`StrategyPlan`-only, same shape as Sprint 3), not a generic cross-user template
- [x] Domain model references use Ubiquitous Language (`Position`, `Feedback`, `StrategyPlan`,
      `RequirementSet`, `RequirementRefinementService`)
- [x] Golden Thread: story title "Give Feedback & Refine Requirements" = feature name "Give
      Feedback and Refine Requirements" = command `GiveFeedbackOnPositionCommand`
