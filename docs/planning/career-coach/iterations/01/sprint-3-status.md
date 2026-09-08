# Sprint 3 Status — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

## Ceremonies

| Ceremony             | Status                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Sprint Planning      | ✅ Complete, founder-accepted 2026-07-25 — [sprint-3-plan.md](sprint-3-plan.md)                   |
| Daily Standup        | Logged 2026-07-25                                                                                 |
| Sprint Review        | ✅ Complete, founder-accepted 2026-07-25 — [sprint-3-review.md](sprint-3-review.md)               |
| Sprint Retrospective | ✅ Complete, founder-accepted 2026-07-25 — [sprint-3-retrospective.md](sprint-3-retrospective.md) |

## Standups

### 2026-07-25

- **Yesterday:** Sprint 2 closed (Review + Retrospective accepted, `stop-scrum-sprint-iteration`
  popped, PR #528 merged).
- **Today:** Sprint 3 planned and committed — CC-005/006 (Qualify Positions), stub qualification
  adapter, 14 tasks (12 + 6a/10a). Implemented all 14 tasks (domain → application → domain-tier
  Cucumber → infrastructure → API → HTTP-Domain Cucumber → UI) via ATDD, each task's spec/scenario
  confirmed failing (or absent) before implementation. 64/64 unit/component tests + 22 Cucumber
  Scenarios (8 domain-tier, 14 HTTP-Domain) green. Lint (0 errors)/test/build all green across all
  8 touched career-coach projects (domain, application, infrastructure, api, domain-e2e, api-e2e,
  feature-list, careerCoachUi).
- **Impediments:** None. One latent test-isolation gap found and fixed along the way — see Task 6a
  entry below.

## Task Progress (against `sprint-3-plan.md`)

| Task                                        | Status                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 (extend `Position` entity)                | ✅ Green                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2 (`IPositionQualificationPort`)            | ✅ Green                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 3 (extend `IPositionRepository`)            | ✅ Green                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 4 (domain unit tests)                       | ✅ Green — 17/17 `career-coach-domain` tests                                                                                                                                                                                                                                                                                                                                                                                 |
| 5 (`QualifyPositionCommand`/Handler)        | ✅ Green                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 6 (application unit tests)                  | ✅ Green — 15/15 `career-coach-application` tests                                                                                                                                                                                                                                                                                                                                                                            |
| 6a (domain-tier Cucumber, Feature 3)        | ✅ Green — 8/8 Scenarios (5 existing + 3 new). Found and fixed a latent cross-Scenario state-leak gap: the shared in-memory repositories were never cleared between Scenarios, so positionId `POS-2201` (reused across Sprint 2's and Sprint 3's fixtures) collided across Feature files. Fixed with a `Before`-hook `store.clear()` — safe since every Given step re-establishes its own preconditions via a real dispatch. |
| 7 (extend `InMemoryPositionRepository`)     | ✅ Green — 13/13 `career-coach-infrastructure` tests                                                                                                                                                                                                                                                                                                                                                                         |
| 8 (`StubPositionQualificationAdapter`)      | ✅ Green — fixture verdicts matching the three Scenarios exactly                                                                                                                                                                                                                                                                                                                                                             |
| 9 (`PositionController` qualify endpoint)   | ✅ Green                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 10 (controller smoke tests)                 | ✅ Green — 13/13 `career-coach-api` tests                                                                                                                                                                                                                                                                                                                                                                                    |
| 10a (HTTP-Domain Cucumber additions)        | ✅ Green — 14/14 Scenarios (10 existing + 4 new)                                                                                                                                                                                                                                                                                                                                                                             |
| 11 (`PositionFeedComponent` Qualify action) | ✅ Green                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 12 (component smoke tests)                  | ✅ Green — 19/19 `career-coach-feature-list` tests                                                                                                                                                                                                                                                                                                                                                                           |

**All 14 tasks (1-12, including 6a/10a) are Green.** CC-005/006 work end-to-end: a Sourced
Position can be qualified against the caller's own Strategy Plan, transitioning to
Qualified/Rejected with a stated reason, surfaced in the Position Feed UI. Persistence remains
in-memory (Sprint 1's Provision Environment Pillar 2 deferral, carried forward, not
re-litigated). Real Anthropic SDK-backed evaluation remains explicitly deferred, per
`sprint-3-plan.md`'s Sprint Goal — a deterministic stub adapter stands in, same boundary-swap
pattern as Sprint 2's sourcing.

**Compliance pass (2026-07-25)**: `node tools/compliance/run-compliance-review.mjs` — 6/8 pass
(architecture, security, standards, code-quality, ux, database); atdd and process fail, but on
the same already-decided categories as Sprints 1-2, not new decisions:

- **Process (high)**: `PositionFeedComponent`'s new Qualify action has no DOM-HTTP-Domain
  Cucumber test — the identical, already-parking-lot-tracked gap covering
  `IntakeInterviewComponent`/`StrategyPlanComponent`/`PositionFeedComponent`'s existing actions
  (no live-API path exists yet for career-coach's UI); parking lot entry updated to cover the
  Qualify action too.
- **Process (medium)**: domain-tier Cucumber spec (Task 6a) landed after the domain/application
  code (Tasks 1-6) — this is `sprint-3-plan.md`'s own task ordering, unchanged since Sprint 1/2;
  true Red-Green TDD happened at the unit-test level (Task 4/6) before implementation.
- **ATDD (low, 9 findings)**: Scenario titles across `position-api.feature`/`qualify-positions.feature`
  don't all use "I CAN"/"I CANNOT" prefixes — a pre-existing, systemic naming-convention gap
  spanning Sprint 2's scenarios too, not something introduced this Sprint; a repo-wide sweep is a
  separate future item, not a per-sprint fix.
- **Security (low, new)**: `positionId` path param has no explicit validation pipe. Low severity,
  consistent with the rest of this controller's parameter handling; not fixed this Sprint.
- **Standards (medium)**: commit messages use "Sprint N Tasks X-Y" rather than ADR-015's
  "Phase N Item M" format — same convention Sprint 1/2 also used; not a new deviation.
