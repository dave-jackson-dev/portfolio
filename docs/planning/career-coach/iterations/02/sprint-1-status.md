# Sprint 1 Status — Career Coach Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Running Green-status radiator for Sprint 1. Updated as work progresses, per
`start-scrum-sprint-iteration` Step 7._

> **Branch:** `phase/career-coach/14-qualification-breakdown` · **Started:** 2026-08-13
> **Length:** unboxed — runs until the Sprint Goal is Green (SP-2)

## Ceremonies

| Ceremony             | Status                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Sprint Planning      | ✅ Complete — [sprint-1-plan.md](sprint-1-plan.md)                                                |
| Daily Standup        | ✅ Entries logged across the Sprint's working sessions (below)                                    |
| Sprint Review        | ✅ Complete, founder-accepted 2026-08-13 — [sprint-1-review.md](sprint-1-review.md)               |
| Sprint Retrospective | ✅ Complete, founder-accepted 2026-08-13 — [sprint-1-retrospective.md](sprint-1-retrospective.md) |

## Sprint Goal status

| Capability                                                     | Tier        | Status       |
| -------------------------------------------------------------- | ----------- | ------------ |
| **2a-S5** — sourced when the board publishes no salary         | HTTP-Domain | ✅ **Green** |
| **F3-S1** — unknown salary qualified on its other requirements | Domain      | ✅ **Green** |
| **H1/H3** — browser discovery observation recorded             | n/a (spike) | 🔴 Not run   |

## Task board

### Phase B — salary badge + result count

| Task | Description                        | Status  |
| ---- | ---------------------------------- | ------- |
| B-1  | `salary not published` amber badge | ✅ Done |
| B-2  | Result count line above the feed   | ✅ Done |
| B-3  | Component tests for B-1 and B-2    | ✅ Done |
| B-4  | Cucumber 2a-S5 at HTTP-Domain tier | ✅ Done |
| B-5  | Cucumber for the badge at DOM tier | ✅ Done |

**Phase B complete.** Live evidence: [`evidence/sprint-1-position-feed.png`](evidence/sprint-1-position-feed.png)
— 171 real Positions, 168 badged, `Showing 171 of 171 sourced Positions`.

🔴 **Phase B also found two defects, both in the parking lot.** The first is fixed and is why B-5
took a UI rebuild to go green: three of the four career-coach API services called a prefix the
gateway does not serve, so the Position feed, Applications and Strategy Plan could not load
anything in the deployed shell. Every component test passed throughout — `HttpTestingController`
asserts whatever URL the service asks for. The second (a sourcing pass at real board volume
exhausting its own TypeDB connections) is recorded, not scheduled.

### Phase C — qualification per-requirement breakdown

| Task     | Description                                              | Status                  |
| -------- | -------------------------------------------------------- | ----------------------- |
| C-0      | `apply-schema.mjs` runner                                | ✅ Done (Provision Env) |
| C-1      | `QualificationVerdict.requirementOutcomes`               | ✅ Done                 |
| C-2      | Schema attribute + apply + repository read/write         | ✅ Done                 |
| **C-3a** | AI adapter forward-compatible plumbing, no prompt change | ✅ Done                 |
| **C-3b** | Revise the qualification agent prompt                    | ⏭️ **Sprint 2** (SP-1)  |
| C-4      | Stub adapter fixtures to the new shape                   | ✅ Done                 |
| C-5      | `PositionDto` + Qualification Result screen breakdown    | ✅ Done                 |
| C-6      | Cucumber F3-S1 at Domain tier + breakdown at DOM tier    | ✅ Done                 |

### Phase D — browser-automation spike

| Task | Description                                    | Status                               |
| ---- | ---------------------------------------------- | ------------------------------------ |
| D-1  | Read the candidate target's ToS and robots.txt | ⏭️ **Sprint 2** — founder gate (D-1) |
| D-2  | 🔴 **FOUNDER GATE**                            | ⏭️ **Sprint 2** — blocked on D-1     |
| D-3  | Drive the accepted target once                 | ⏭️ **Sprint 2** — blocked on D-2     |
| D-4  | Write the observation                          | ⏭️ **Sprint 2** — blocked on D-3     |
| D-5  | Update the Hypothesis Register                 | ⏭️ **Sprint 2** — blocked on D-4     |

## Standups

_(appended one entry per working day by `start-ceremony … daily-standup`)_
