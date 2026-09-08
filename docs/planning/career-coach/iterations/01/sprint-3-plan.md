# Sprint 3 Plan — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Activity:** Qualify Positions (Story Map Sprint 3 of 8)
**Stories:** CC-005 — Qualify a Sourced Position Against My Requirements; CC-006 — Refine a
Qualification Up to 3 Passes

---

## Sprint Goal

By the end of this Sprint, CC-005/006's three Three Amigos Scenarios (`06-three-amigos.md`
Feature 3) are Green:

1. **Qualify a Position that matches all requirements** — a `Sourced` Position becomes `Qualified`.
2. **Reject a Position that fails a hard requirement** — a `Sourced` Position becomes `Rejected`,
   with a stated reason.
3. **Refine a borderline Position across up to 3 passes** — an ambiguous match resolves to
   `Qualified` within 3 passes, and no 4th pass is attempted.

**Explicit scope decision (following the same boundary-swap pattern as Sprint 1's persistence and
Sprint 2's sourcing):** the real `QualificationService` (Anthropic SDK-backed evaluation of a
Position against `StrategyPlan`'s `RequirementSet`, per `05-architecture-design.md`) is **not**
built this Sprint. `RequirementSet`'s `Requirement.description`/`passingStatuses` fields are
free-text — actually evaluating them against a Position needs real NLP reasoning, which is
exactly why AD scoped this service as Anthropic SDK-backed rather than a simple field comparison.
This Sprint builds the domain/application/infrastructure/API/UI layers behind a stub, deterministic
`IPositionQualificationPort` implementation whose fixture data reproduces the three Three Amigos
Scenarios exactly (POS-2201 Qualified, POS-2202 Rejected for failing remote-only, POS-2203
Qualified after a simulated 2nd pass). Real Anthropic-backed evaluation becomes its own
explicitly-scoped later piece of work — flagging this now rather than discovering it mid-sprint
avoids an unbudgeted live-API cost surprise.

**Zero-Trust data-ownership shape (per Sprint 2 Retrospective's action item — ask what Zero-Trust
means for _this_ story's shape, not default to a cross-user scenario):** `Position` itself has no
owner (unchanged from Sprint 2 — it's a shared sourced-positions list), but qualifying one always
reads the caller's _own_ `StrategyPlan` via their authenticated `userId` — never a body/query
param. The applicable boundary is the same "own resource only" shape Sprint 1 used for
`StrategyPlan`, applied here to which `RequirementSet` a qualification run is allowed to use.

## Task Breakdown

| #   | Task                                                                                                                                                                                                                                                                             | Layer                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1   | Extend `Position` entity — status becomes `Sourced \| Qualified \| Rejected`; add `rejectionReason?`; add `qualify()`/`reject(reason)` transition methods, both throwing unless current status is `Sourced` (AD4 state machine: `Sourced` → `Qualified`\|`Rejected` → `Pursued`) | Domain               |
| 2   | `IPositionQualificationPort` — abstract `evaluate(position, requirementSet): Promise<QualificationVerdict>`; `QualificationVerdict = { status: 'Qualified' \| 'Rejected'; reason?: string; passesUsed: number }` (up to 3, CC-006)                                               | Domain               |
| 3   | Extend `IPositionRepository` — add `findById(positionId): Promise<Position \| null>`                                                                                                                                                                                             | Domain               |
| 4   | Domain unit tests — `qualify()`/`reject()` transition rules (success from `Sourced`; throws from any other status), `QualificationVerdict` shape                                                                                                                                 | Domain               |
| 5   | `QualifyPositionCommand`/Handler — loads `Position` by id and the caller's `StrategyPlan` by `userId`, calls `IPositionQualificationPort.evaluate`, applies the resulting transition, saves                                                                                      | Application          |
| 6   | Application unit tests                                                                                                                                                                                                                                                           | Application          |
| 6a  | Domain-tier Cucumber for Three Amigos Feature 3 (3 Scenarios) — real `CommandBus`/`QueryBus`, real in-memory `PositionRepository`/`StrategyPlanRepository`, stub `PositionQualificationPort`                                                                                     | Domain-tier Cucumber |
| 7   | Extend `InMemoryPositionRepository` — add `findById`                                                                                                                                                                                                                             | Infrastructure       |
| 8   | `StubPositionQualificationAdapter` — deterministic fixture verdicts matching the three Scenarios exactly (no live Anthropic calls)                                                                                                                                               | Infrastructure       |
| 9   | `PositionController` — add `POST /positions/:positionId/qualify`, behind `RequireUserIdGuard`, `userId` sourced only from `AuthenticatedUserId()` (Zero Trust — never a body param)                                                                                              | API                  |
| 10  | Controller smoke tests                                                                                                                                                                                                                                                           | API                  |
| 10a | HTTP-Domain Cucumber additions to `position-api.feature` — the 3 qualification Scenarios plus a Zero-Trust Scenario ("a caller's own Strategy Plan is always used for qualification, regardless of any other userId supplied")                                                   | HTTP-Domain Cucumber |
| 11  | Extend `PositionFeedComponent` — "Qualify" action on each `Sourced` row; render `Qualified`/`Rejected` badge + reason, per `07-ux-design.md`'s Position Feed mockup                                                                                                              | Feature (UI)         |
| 12  | Component smoke tests                                                                                                                                                                                                                                                            | Feature (UI)         |

Persistence remains in-memory (same Provision Environment Pillar 2 deferral carried since Sprint
1, not re-litigated).

## Definition of Ready check (per `scrum-development-sprints.md`)

- [x] "I CAN" capability statements — CC-005/006 in `03-user-story-map.md`
- [x] Given-When-Then specs (match, hard-requirement rejection, multi-pass refinement) —
      `06-three-amigos.md` Feature 3
- [x] Zero Trust boundary — Task 10a's new Scenario applies this Sprint's own data-ownership shape
      (own-`StrategyPlan`-only), not a generic cross-user template — per the Sprint 2 Retrospective
      action item
- [x] Domain model references use Ubiquitous Language (`Position`, `Qualified`, `Rejected`,
      `QualificationService`, `RequirementSet`)
- [x] Golden Thread: story title "Qualify Positions" = feature name "Qualify Positions" = command
      `QualifyPositionCommand`
