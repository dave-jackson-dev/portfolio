# Sprint 2 Review — Career Coach Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-08-13
**Sprint Goal (from `sprint-2-plan.md`):** Sourcing pass outcomes visible, descriptions stored
with extracted salary, qualification agent emitting per-requirement breakdowns, and the H1/H3
browser spike observed.

---

## Information Radiator Status

Verified Green on `phase/career-coach/14-qualification-breakdown` before close:

| Layer                | Evidence                                  | Result                  |
| -------------------- | ----------------------------------------- | ----------------------- |
| Domain               | `nx test career-coach-domain`             | 43/43                   |
| Application          | `nx test career-coach-application`        | 51/51                   |
| Infrastructure       | `nx test career-coach-infrastructure`     | 108/108                 |
| Feature (UI)         | `nx test career-coach-feature-list`       | 62/62                   |
| API                  | `nx test career-coach-api`                | 21/21                   |
| Domain-tier Cucumber | `nx run career-coach-domain-e2e:cucumber` | 18/18 (2b-S2 ✅)        |
| HTTP-Domain Cucumber | `nx run career-coach-api-e2e:cucumber`    | 36/36 (2a-S3, 2a-S6 ✅) |

## Sprint Goal verdict

| Capability                                                    | Status                                                                                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **2a-S3** — sourcing pass completed when one board fails      | ✅ **Green** — `SourcingPassOutcome.PartiallyCompleted`, board failures recorded                                                     |
| **2a-S6** — sourcing pass refused for misconfigured board     | ✅ **Green** — `SourcingPassOutcome.Refused`, provider named                                                                         |
| **2b-S2** — discovery pass blocked by anti-bot (stub)         | ✅ **Green** — Domain-tier, `StubDiscoverySourcingAdapter`, BLOCKED board recorded                                                   |
| **Item 4** — description store + salary extraction            | ✅ **Green** — `CouchDbPositionDescriptionRepository`, Greenhouse description fetch, Lever 1s crawl-delay, salary heuristic          |
| **C-3b** — qualification agent emits per-requirement outcomes | ✅ **Green** — A/B harness: baseline 100%, proposed 100%, +0.0% delta, outcomes present 10/10                                        |
| **H1/H3** — browser spike observation recorded                | ✅ **Green** — `job-boards.greenhouse.io/remotecom` reachable, HTTP 200, 225 jobs, reCAPTCHA scope limited to application submission |

**Sprint Goal: MET in full.** All six capabilities are Green. No story was carried.

## Stories / Features Demoed

**Phase E — Sourcing Pass Outcome:**

- `SourcingPassOutcome` domain entity persisted via `ISourcingPassOutcomeRepository` after every
  `SourcePositionsCommand` and `TriggerDiscoveryPassCommand` execution.
- `GET /positions/sourcing-pass` returns the latest pass outcome.
- `SourcingPassOutcomeComponent` Angular screen: shows Completed / PartiallyCompleted banner,
  per-board table with OK / FAILED / BLOCKED rows, and "View N new Positions" button.
- Refusal panel shown when `status === 'Refused'`, naming the invalid provider.
- 2a-S3 and 2a-S6 Green at HTTP-Domain tier (supertest against real NestJS + TypeDB).

**Phase D — Browser Spike (H1/H3):**

- Playwright drove `job-boards.greenhouse.io/remotecom` once, headless, unauthenticated.
- Result: HTTP 200, 1372 ms, 225 jobs counted, first title extracted. No CAPTCHA on listing page.
  reCAPTCHA present only on the application form — zero mitigation cost for listing-page reading.
- H1 and H3 validated. Hypothesis Register updated in `01-bmc.md`.
- Evidence: `evidence/phase-d-browser-spike-observation.md`.

**Phase F — Description Store + Salary Extraction:**

- `IPositionDescriptionRepository` port + `CouchDbPositionDescriptionRepository` (opt-in via
  `CAREER_COACH_COUCHDB_URL`; no-op when unset) + `InMemoryPositionDescriptionRepository` for tests.
- Greenhouse `fetchDescription()`: per-job GET to `/v1/boards/{token}/jobs/{id}`, HTML `content` stored.
- Lever `fetchPositions()` now sleeps 1000 ms before each request (respects `Crawl-delay: 1`).
- `extractSalary()`: regex heuristic over description text; fills `salaryRange` when the list
  endpoint omits it (every Greenhouse and Lever position so far).
- `PositionDto` gains `description?: string`; `ListPositionsHandler` reads from the description repo.
- 7-case salary extraction spec all pass.

**Phase G — PromptOS A/B Harness + C-3b:**

- `tools/career-coach-ab-harness/index.mjs` (`npm run career-coach-ab`): Cerebras `gpt-oss-120b`,
  10-case fixed battery, REPETITIONS=3, temperature=0.
- Baseline accuracy: 10/10 = 100.0%, outcomes present: 0/10.
- Proposed (C-3b): 10/10 = 100.0%, outcomes present: 10/10. Delta: +0.0%.
- `position-qualification-agent.md` promoted. Now emits `requirementOutcomes` per requirement.
- PromptOS conformance: 0 blocking violations.
- Evidence: `evidence/phase-g-ab-harness-results.md`.

**Retro action item (E-7):**

- `QUALIFICATION_FIXTURE_VERDICTS` extracted to `qualification-fixture-verdicts.ts`, imported by
  both `StubPositionQualificationAdapter` and `domain-e2e`'s `cucumber-world.ts`. Single source
  of truth — no more two-file edit to add a fixture.

## Defects Found During Sprint

None. The adapter interface change (`IPositionSourcingPort` → `SourcingResult`) caused cascading
updates across eight files, but all were clean compile-time breaks caught immediately by the test
suite — not runtime defects.

## Stakeholder Feedback

- Sprint ran in a single session; all committed stories Green at end of session.
- No scope changes were requested.
- No new items added to the product backlog during Sprint Review.
