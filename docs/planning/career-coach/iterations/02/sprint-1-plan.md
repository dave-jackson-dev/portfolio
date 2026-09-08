# Sprint 1 Plan (Ceremony Output) — Career Coach Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Sprint Planning ceremony output for Sprint 1. Because this is Sprint 1, this ceremony **confirms
and commits to** the task breakdown already produced by Workshop 9
([`09-sprint-1-plan.md`](09-sprint-1-plan.md)) rather than re-planning from scratch, per
`start-ceremony`'s registry._

> **Facilitated:** 2026-08-13 · **Attempt:** 1
> **Branch:** `phase/career-coach/14-qualification-breakdown`

## Sprint Goal

Unchanged from Workshop 9, and expressed in Green-capability terms rather than as a task list:

**By sprint end a Job Seeker CAN see, on real board data, which requirements a Position was judged
on and which could not be judged at all — and the project CAN state, from a recorded observation
rather than a decision, whether browser-driven discovery is viable.**

Green means: Feature 2a Scenario 5 (`sourced when the board publishes no salary`) and Feature 3
Scenario 1 (`unknown salary qualified on its other requirements`) pass, and H1/H3 acquire an
observation in the Hypothesis Register.

## Committed scope

Items **1, 2 and 5** of the v1 cut — Phases **B**, **C** and **D** of
[`09-sprint-1-plan.md`](09-sprint-1-plan.md). Phase A and task C-0 are **not** in this Sprint: both
were absorbed by Provision Environment and are built and verified.

Items 3 and 4 stay deferred to Sprint 2 (S1-1).

## Definition of Ready — confirmed at the ceremony

| Item | Story                               | DoR met?  | Note                                                                                                                                                                               |
| ---- | ----------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Feature 2a — salary badge + count   | ✅        | 2a-S5 written; existing feed-read RBAC; no new Command or Query                                                                                                                    |
| 2    | Feature 3 — qualification breakdown | ✅        | F3-S1 written this iteration; existing qualify RBAC                                                                                                                                |
| 5    | Browser-automation spike            | ⚠️ **No** | Deliberate and re-confirmed — a spike answers a question, so it has no "I CAN" statement and no Gherkin by nature. Its acceptance criterion is D-4's observation existing (MVP-3). |

## Sprint length — no calendar box

**Founder decision, 2026-08-13 (SP-2):** this Sprint runs **until the Sprint Goal is Green**, not to
a fixed two-week box. That follows every prior career-coach Sprint (solo personal-tool project) and
Iteration 01's own precedent.

⚠️ The tradeoff was named at the ceremony and accepted: an unboxed Sprint gives up the
overcommitment signal a fixed box provides. Workshop 9's ≈8.5–11 day estimate therefore stands as an
estimate, not a commitment date. The named lever if it runs long is still C-5's provenance panel;
**Phase D is not a lever** — dropping it repeats Iteration 01 exactly.

## Ceremony decisions

| ID   | Decision                                                                                    | Date       |
| ---- | ------------------------------------------------------------------------------------------- | ---------- |
| SP-1 | **C-3 splits into C-3a (this Sprint) and C-3b (Sprint 2)** — see below                      | 2026-08-13 |
| SP-2 | Sprint runs until Green; no calendar box                                                    | 2026-08-13 |
| SP-3 | C-5 must render an **absent** outcomes list without breaking — a direct consequence of SP-1 | 2026-08-13 |

### SP-1 — the C-3 split, and the correction the ceremony made to it

**The impediment.** C-3 revises `agents/apps/career-coach/position-qualification-agent.md`, a
PromptOS artifact. ADR-080 requires a prompt retrofit to go through a fixed A/B battery at
`REPETITIONS ≥ 3` with temperature pinned — and **no such script exists in `package.json`**. The
debt is already owed on 18 retrofitted `stop-*` Skills and cannot be discharged today by anyone.

**The founder chose to split C-3** rather than build the harness mid-sprint or waive the
measurement.

🔴 **The ceremony then checked the split against the repo, and it did not hold as stated.** The
chosen framing was "parse-only now, prompt change later" — but
``position-qualification-agent.md`` (🔴 not ported from `singularity`)
specifies a strict response schema of exactly `{ "status", "reason" }`. It emits **no**
per-requirement structure at all, so there is nothing to parse. Deriving per-requirement outcomes
from an overall verdict would be fabrication, and the prompt's own first strict rule forbids exactly
that.

**Corrected split, committed:**

| Task     | Sprint | Content                                                                                                                                                                                                   | A/B owed?                               |
| -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **C-3a** | 1      | `ai-runtime-position-qualification.adapter.ts` reads `requirementOutcomes` from the agent response **when present**, defaulting to absent. Forward-compatible plumbing. **No PromptOS artifact touched.** | **No**                                  |
| **C-3b** | 2      | Revise `position-qualification-agent.md` to emit per-requirement outcomes                                                                                                                                 | **Yes** — blocked on a runnable harness |

**Why the Sprint Goal still holds.** F3-S1 is a **Domain-tier** Scenario, and
``domain-e2e`'s cucumber-world` (🔴 not ported from `singularity`)
binds its own in-world `StubPositionQualificationAdapter` — not the AI adapter. So F3-S1 goes Green
off C-4's stub outcomes, touching no prompt.

**What this costs, stated plainly.** Until C-3b lands, the **live AI path emits no breakdown**. That
is not a regression — users see today's single verdict, unchanged — but it does mean the capability
is Green in specification and stub, and only partly live. That is the honest description, and it is
recorded here rather than discovered at Sprint Review.

## Impediments carried into the Sprint

1. 🔴 **No runnable PromptOS A/B harness** — the reason for SP-1. Root parking lot; blocks C-3b.
2. 🔴 **`D-2` is a founder gate.** The spike's target site is unnamed and its ToS unread. **No site
   is driven until D-1's reading is put to the founder and accepted.** Work stops at D-1.
3. 🔴 **career-coach has no CI workflow** (PE-2). Every gate this Sprint clears will be run by hand.
   Flagged, not built — root parking lot, owned by SRE/DevOps.

## Gates this Sprint must clear

- **Golden Thread hard gate** — satisfied with no waivers; the Sprint adds no `*.command.ts` or
  `*.query.ts`. Re-verify before the phase PR.
- **Cucumber/Screenplay mandate** — B-4, B-5, C-6. Jest/Vitest green does not satisfy it.
- **PromptOS conformance** — **not triggered this Sprint**, per SP-1.
- **ADR-012** — any defect found mid-sprint gets its failing test committed first.
