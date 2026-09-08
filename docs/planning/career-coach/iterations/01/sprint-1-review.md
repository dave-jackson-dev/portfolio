# Sprint 1 Review — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Sprint Goal (from `sprint-1-plan.md`):** CC-001–CC-003 (Complete My Intake Interview, Receive My
Strategy Plan, Revise My Plan When Circumstances Change) Green end-to-end.

---

## Information Radiator Status

Verified genuinely Green on `main` post-merge (PR [#526](https://github.com/dave-jackson-dev/singularity/pull/526)) — not the phase branch, not mocks:

| Layer                | Evidence                                         | Result                                                        |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| Domain               | `nx test career-coach-domain --coverage`         | 9/9 unit tests                                                |
| Application          | `nx test career-coach-application --coverage`    | 7/7 unit tests                                                |
| Infrastructure       | `nx test career-coach-infrastructure --coverage` | 3/3 unit tests                                                |
| Feature (UI)         | `nx test career-coach-feature-list --coverage`   | 10/10 component tests                                         |
| API                  | `nx test career-coach-api --coverage`            | 10/10 tests (guard, controller ownership checks)              |
| Domain-tier Cucumber | `nx run career-coach-domain-e2e:cucumber`        | 3/3 Scenarios                                                 |
| HTTP-Domain Cucumber | `nx run career-coach-api-e2e:cucumber`           | 7/7 Scenarios (incl. 2 cross-user access-control regressions) |

All 20 tasks in `09-sprint-1-plan.md` (Phases A–E) are Green.

## Stories Demoed

- **CC-001 — Complete My Intake Interview**: `IntakeInterviewComponent` collects location, salary
  range, company size, tech stack, and open-ended best-practice answers; `POST /strategy-plan`
  builds the Strategy Plan from those answers via `BuildStrategyPlanCommand`. Domain-tier Cucumber
  Scenario "Complete the intake interview" — Green.
- **CC-002 — Receive My Strategy Plan**: `StrategyPlanComponent` renders the built plan (read-only
  fact display); `GET /strategy-plan` returns the `StrategyPlanDto`. Domain-tier Scenario "Receive
  the Strategy Plan built from intake" — Green.
- **CC-003 — Revise My Plan When Circumstances Change**: "Revise Plan" action re-opens the intake
  form pre-filled with current values; `PATCH /strategy-plan` applies the revision via
  `ReviseStrategyPlanCommand`, recording a revision note and updating `updatedAt`. Domain-tier
  Scenario "Revise the Strategy Plan when circumstances change" — Green.

**Accepted as Green.** No story has a failing scenario; none carried.

## Specification Gaps Identified During Review

Per "verify Green means genuinely Green," a post-Sprint-1 compliance pass
(`node tools/compliance/run-compliance-review.mjs`) surfaced one real specification gap the
original Three Amigos Gherkin didn't cover: **the `/strategy-plan` endpoints had no
authorization scenarios** — any caller could act on any user's Strategy Plan via a spoofable
`userId` in the request body/query. This is exactly the "Zero Trust" requirement the Definition of
Ready calls out (`agents/methodologies/scrum-development-sprints.md` §Definition of Ready item 2)
that the original workshop scenarios missed for this feature. Fixed within Sprint 1's own scope
(not carried): `RequireUserIdGuard` + ownership checks, with 2 new regression Scenarios
("A caller cannot read another user's Strategy Plan", "A caller cannot build a Strategy Plan on
another user's behalf") added to `career-coach-api-e2e` — see `06-three-amigos.md` as the doc to
amend with these as new specification scenarios before Sprint 2, so this gap doesn't silently
repeat for `Position`/`Application`.

## Stakeholder Feedback (Founder, verbatim from session)

- Chose the **lightweight `X-User-Id` header guard** over building full platform-iam/api-gateway
  integration this sprint — explicit call to keep Sprint 1 scoped to what BMC/Architecture Design
  actually committed to, not silently expand into a new integration project.
- Chose to **defer the DOM-HTTP-Domain UI Cucumber test** rather than build a one-off standalone
  proxy workaround — explicit preference for tracking real infrastructure gaps in the parking lot
  over improvised shortcuts that create new unreviewed precedent.
- Explicitly declined rewriting already-pushed commit history for cosmetic ADR-015/ADR-012 format
  fixes — accepted the historical commit style on this branch rather than a risky force-push.

## Carried / Deferred (not stories — infrastructure gaps, tracked separately)

- Real TypeDB persistence (in-memory only, Provision Environment Pillar 2 — deliberate, not a defect)
- Full platform-iam/api-gateway Bearer-token auth wiring (`docs/sessions/parking-lot.tasks.md`, pending)
- DOM-HTTP-Domain Cucumber/Screenplay UI smoke test (`docs/sessions/parking-lot.tasks.md`, `#architecture`, 2026-07-24)

None of the above block CC-001–CC-003 being genuinely Green — they are follow-on infrastructure,
not unmet acceptance criteria for this Sprint's committed stories.
