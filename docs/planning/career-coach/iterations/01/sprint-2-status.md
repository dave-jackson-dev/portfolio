# Sprint 2 Status — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

## Ceremonies

| Ceremony             | Status                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Sprint Planning      | ✅ Complete, founder-accepted 2026-07-25 — [sprint-2-plan.md](sprint-2-plan.md)                   |
| Daily Standup        | ✅ 1 entry logged (below)                                                                         |
| Sprint Review        | ✅ Complete, founder-accepted 2026-07-25 — [sprint-2-review.md](sprint-2-review.md)               |
| Sprint Retrospective | ✅ Complete, founder-accepted 2026-07-25 — [sprint-2-retrospective.md](sprint-2-retrospective.md) |

## Standups

### 2026-07-25

- **Yesterday:** Sprint 1 closed (Review + Retrospective accepted, `stop-scrum-sprint-iteration`
  popped, PRs #526/#527 merged).
- **Today:** Sprint 2 planned and committed — CC-004 (Source Positions), stub sourcing adapter,
  13 tasks. Implemented all 13 tasks (domain → application → domain-tier Cucumber →
  infrastructure → API → HTTP-Domain Cucumber → UI) via ATDD, each task's spec confirmed failing
  before implementation. All 20 unit/component tests + 15 Cucumber Scenarios (5 domain-tier, 10
  HTTP-Domain) green. Lint/test/build all green across all 8 career-coach projects.
- **Impediments:** None.

## Task Progress (against `sprint-2-plan.md`)

| Task                                                  | Status                                             |
| ----------------------------------------------------- | -------------------------------------------------- |
| 1 (`Position` entity)                                 | ✅ Green                                           |
| 2 (`IPositionRepository` port)                        | ✅ Green                                           |
| 3 (`IPositionSourcingPort` port)                      | ✅ Green                                           |
| 4 (domain unit tests)                                 | ✅ Green — 13/13 `career-coach-domain` tests       |
| 5 (`SourcePositionsCommand`/Handler)                  | ✅ Green                                           |
| 6 (`ListPositionsQuery`/Handler)                      | ✅ Green                                           |
| 7 (application unit tests)                            | ✅ Green — 11/11 `career-coach-application` tests  |
| 7a (domain-tier Cucumber, Feature 2)                  | ✅ Green — 5/5 Scenarios (3 existing + 2 new)      |
| 8 (`InMemoryPositionRepository`)                      | ✅ Green — 7/7 `career-coach-infrastructure` tests |
| 9 (`StubPositionSourcingAdapter`)                     | ✅ Green — fixture data matching the UX mockup     |
| 10 (`PositionController`)                             | ✅ Green                                           |
| 11 (controller smoke tests)                           | ✅ Green — 12/12 `career-coach-api` tests          |
| 11a (HTTP-Domain Cucumber, incl. Zero-Trust scenario) | ✅ Green — 10/10 Scenarios (7 existing + 3 new)    |
| 12 (`PositionFeedComponent`)                          | ✅ Green                                           |
| 13 (component smoke tests)                            | ✅ Green — 16/16 `career-coach-feature-list` tests |

**All 13 tasks (1-13, including 7a/11a) are Green.** CC-004 works end-to-end: run a sourcing
pass → sourced Positions appear in the feed, de-duplicated across sites, behind Zero-Trust auth.
Persistence remains in-memory (Sprint 1's Provision Environment Pillar 2 deferral, carried
forward, not re-litigated). Real Playwright-driven automation against LinkedIn/job
boards/career sites remains explicitly deferred, per `sprint-2-plan.md`'s Sprint Goal — a stub
adapter stands in, same boundary-swap pattern as persistence.

**Compliance pass (2026-07-25)**: `node tools/compliance/run-compliance-review.mjs` — 6/8 pass
(architecture, standards, ux, atdd, process, database). The 2 failures are the exact same two
categories already decided and documented in Sprint 1, not new decisions:

- **Security (high)**: `PositionApiService` hardcodes the same dev-fixture `X-User-Id` as
  `StrategyPlanApiService` — inherent to the lightweight-guard approach chosen in Sprint 1, not
  further fixable without the deferred full platform-iam integration.
- **Code quality (high)**: `PositionFeedComponent` has no DOM-HTTP-Domain Cucumber test — same
  parking-lot-tracked gap as `IntakeInterviewComponent`/`StrategyPlanComponent` (no live-API path
  exists yet for career-coach's UI); parking lot entry updated to cover this component too.
