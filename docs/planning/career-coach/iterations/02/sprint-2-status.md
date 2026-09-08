# Sprint 2 Status — Career Coach Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Running Green-status radiator for Sprint 2. Updated as work progresses, per
`start-scrum-sprint-iteration` Step 7._

> **Branch:** `phase/career-coach/14-qualification-breakdown` · **Started:** 2026-08-13
> **Length:** unboxed — runs until the Sprint Goal is Green (SP2, continuing SP-2 precedent)

## Ceremonies

| Ceremony             | Status                                             |
| -------------------- | -------------------------------------------------- |
| Sprint Planning      | ✅ Complete — `sprint-2-plan.md` (🔴 not ported from `singularity`) |
| Daily Standup        | ✅ Single-session sprint — 2026-08-13              |
| Sprint Review        | ⬜ Not started                                     |
| Sprint Retrospective | ⬜ Not started                                     |

## Sprint Goal status

| Capability                                                    | Tier        | Status       |
| ------------------------------------------------------------- | ----------- | ------------ |
| **2a-S3** — sourcing pass completed when one board fails      | HTTP-Domain | ✅ **Green** |
| **2a-S6** — sourcing pass refused for misconfigured board     | HTTP-Domain | ✅ **Green** |
| **2b-S2** — discovery pass blocked by anti-bot (stub)         | Domain      | ✅ **Green** |
| **Item 4** — description store + salary extraction shipped    | n/a (infra) | ✅ **Green** |
| **C-3b** — qualification agent emits per-requirement outcomes | HTTP-Domain | ✅ **Green** |
| **H1/H3** — browser spike observation recorded                | n/a (spike) | ✅ **Green** |

## Task board

### Phase E — Sourcing Pass Outcome

| Task | Description                                                                 | Status  |
| ---- | --------------------------------------------------------------------------- | ------- |
| E-1  | `SourcingPassOutcome` domain entity + value objects                         | ✅ Done |
| E-2  | Schema type + apply + `SourcingPassOutcomeRepository` port + in-memory impl | ✅ Done |
| E-3  | Persist outcome in `ScheduledSourcingJob` + `TriggerSourcingPassHandler`    | ✅ Done |
| E-4  | `SourcingPassDto` + `GetLatestSourcingPassQuery` + handler                  | ✅ Done |
| E-5  | Angular `sourcing-pass-outcome` component                                   | ✅ Done |
| E-6  | Cucumber 2a-S3, 2a-S6 (HTTP-Domain); 2b-S2 (Domain, stub)                   | ✅ Done |
| E-7  | Retro: extract shared qualification fixture map                             | ✅ Done |

### Phase F — Description Store + Salary Extraction

| Task | Description                                                     | Status  |
| ---- | --------------------------------------------------------------- | ------- |
| F-1  | CouchDB design doc + Nouveau index; `PositionDescription` shape | ✅ Done |
| F-2  | `PositionDescriptionRepository` port + CouchDB implementation   | ✅ Done |
| F-3a | Greenhouse: per-job description fetch                           | ✅ Done |
| F-3b | Lever: `Crawl-delay: 1` (1 000 ms between fetches)              | ✅ Done |
| F-4  | Salary extraction heuristic from description text               | ✅ Done |
| F-5  | `PositionDto` + `ListPositionsQuery` serve description + salary | ✅ Done |
| F-6  | Tests (unit + salary extraction spec)                           | ✅ Done |

### Phase G — PromptOS A/B Harness + C-3b

| Task | Description                                                                 | Status                                                         |
| ---- | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| G-1  | Fixed test battery (10 Position + RequirementSet pairs)                     | ✅ Done                                                        |
| G-2  | `tools/career-coach-ab-harness/index.mjs` (Cerebras, REPETITIONS=3, temp=0) | ✅ Done                                                        |
| G-3  | `npm run career-coach-ab` added to `package.json`                           | ✅ Done                                                        |
| G-4  | Revise `position-qualification-agent.md` to emit `requirementOutcomes`      | ✅ Done                                                        |
| G-5  | Run harness; baseline 100%, proposed 100%, +0.0% delta, outcomes 10/10      | ✅ Done — evidence in `evidence/phase-g-ab-harness-results.md` |
| G-6  | PromptOS conformance: 0 blocking violations                                 | ✅ Done                                                        |

### Phase D — Browser Automation Spike (carry-over)

| Task | Description                                                             | Status                       |
| ---- | ----------------------------------------------------------------------- | ---------------------------- |
| D-1  | Read ToS and robots.txt for target site                                 | ✅ Done — cleared 2026-08-13 |
| D-2  | Founder gate                                                            | ✅ Confirmed — 2026-08-13    |
| D-3  | Drive `https://job-boards.greenhouse.io/remotecom` once with Playwright | ✅ Done 2026-08-13           |
| D-4  | Write the observation                                                   | ✅ Done 2026-08-13           |
| D-5  | Update the Hypothesis Register (H1 and H3)                              | ✅ Done 2026-08-13           |

## Standups

**2026-08-13** — Single-session sprint. All phases completed in one session:
Phases E (Sourcing Pass Outcome), D (Browser Spike), F (Description Store), G (A/B Harness + C-3b).
All 36 HTTP-Domain and 18 Domain Cucumber scenarios green.
