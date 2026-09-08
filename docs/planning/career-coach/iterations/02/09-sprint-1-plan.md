# Sprint 1 Plan — Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Workshop:** 9 of 9 · **Attempt:** 1 · **Facilitated:** 2026-08-13
> **Restricts:** [`08-mvp-plan.md`](08-mvp-plan.md)'s five-item v1 cut to the slice
> [`05-architecture-design.md`](05-architecture-design.md)'s dependency map puts first.
> **Consumes, does not renegotiate,** that map's ordering.
> **Estimate scale:** S ≈ half a day · M ≈ 1–2 days · L ≈ 3+ days — the same relative sizing
> [Iteration 01's Sprint 1 plan](../01/09-sprint-1-plan.md) used. No story-point calibration exists.

## Sprint Goal

**By sprint end a Job Seeker CAN see, on real board data, which requirements a Position was judged
on and which could not be judged at all — and the project CAN state, from a recorded observation
rather than a decision, whether browser-driven discovery is viable.**

Expressed as Green capabilities, per `scrum-development-sprints.md`: Feature 2a Scenario 5
(`sourced when the board publishes no salary`) and Feature 3 Scenario 1
(`unknown salary qualified on its other requirements`) go Green, and H1/H3 acquire an observation.

---

## The Sprint 1 slice

**Founder decision, 2026-08-13:** items **1, 2 and 5**.

| #   | Item                                         | Size | Why Sprint 1                                                                 |
| --- | -------------------------------------------- | ---- | ---------------------------------------------------------------------------- |
| 1   | Salary badge + result count                  | S    | Head of the map's `I1 → I2 → I4` chain; no dependencies                      |
| 2   | Qualification per-requirement breakdown      | M    | The only cut item whose Gherkin was written **this** iteration (F3-S1)       |
| 5   | Browser-automation spike — **answers H1/H3** | M    | MVP Planning: _"the one that must not slip"_; its answer scopes Iteration 03 |

**Deferred to Sprint 2:** item 3 (Sourcing Pass Outcome, M/L) and item 4 (AD-4 description store +
salary extraction + rate limiting, L).

**No conflict with the dependency map.** Its two live rows are honoured: _relevance filtering before
enabling real sourcing_ is already satisfied (both shipped 2026-08-13), and _description store before
salary-aware qualification_ is preserved because item 2 only ever reports that salary **was not**
evaluated — it never claims a salary requirement bit. Item 5 is independent of both.

---

## 🔴 Step 8 verification — what the repo actually contains

Before estimating anything as a fresh build, the repo was searched rather than the architecture doc
re-read. **Four findings changed the sizing, two of them downward.**

| Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Effect                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Item 1 is not greenfield below the UI.** `salaryRange?: string` already exists on ``position.entity.ts`` (🔴 not ported from `singularity`), on ``PositionDto`` (🔴 not ported from `singularity`), and is mapped by ``ListPositionsHandler`` (🔴 not ported from `singularity`). Both board sources set it `undefined` **deliberately, with tests asserting so**. | ⬇️ Item 1 is Feature-layer only  |
| **The result count needs no query change.** `ListPositionsHandler` returns `PositionDto[]`; the count is `.length` in the component. Nothing new crosses the application boundary.                                                                                                                                                                                                                                                                                                                        | ⬇️ No new Query — see gate below |
| **Playwright is already a root devDependency** (`@playwright/test`, `@nx/playwright`). The `node:22-alpine`/musl constraint applies to the **container**, and the spike changes no image by construction.                                                                                                                                                                                                                                                                                                 | ⬇️ Item 5 needs no install       |
| **`careerCoachUi-e2e` has `"targets": {}`** — a bare Nx Playwright scaffold holding only `example.spec.ts`. There is **no DOM-tier assembly for career-coach at all.**                                                                                                                                                                                                                                                                                                                                    | ⬆️ Adds Phase A below            |

**And none of Iteration 02's Gherkin is implemented yet.** No `.feature` file under
`apps/career-coach/**` contains 2a-S5, F3-S1, or any pass-outcome Scenario — checked by search, and
the nine files on disk confirm it. Every item in this sprint therefore carries genuinely new
Cucumber work, which naive sizing from the MVP plan's S/M/L would have missed.

---

## ✅ Persistence — DECIDED 2026-08-13

**S1-3: per-requirement outcomes persist as one additive `qualification-outcomes-json` attribute,
`@card(0..1)`, owned by `position`.**

F3-S1 says the salary requirement is _"**recorded** as not evaluated"_ — so the breakdown survives a
reload; it is not view state. `Position` persists as flat attributes, and `entity position` is
defined at line 610 of
``iam.schema.typeql`` (🔴 not ported from `singularity`) —
the shared schema AD-4 decided not to touch. Three things settled it:

**1. The idiom already exists in this file, twice — and one instance is career-coach's own.**
`strategy-plan.requirements-json` serializes `RequirementSet.requirements` — **the exact list these
outcomes correspond to, one-for-one** — and `oidc-model-record.payload-json` does the same for OIDC
payloads. The schema's own comment states the criterion for choosing the idiom:

> _"since nothing queries into individual requirements server-side; the application layer always
> reads the whole RequirementSet as one value object"_

That criterion holds identically for outcomes: the Qualification Result screen shows the whole
breakdown at once, and nothing filters Positions by which requirement went unevaluated. `@card(0..1)`
matches `rejection-reason`'s unset-until-set idiom exactly.

**2. Additive `owns` on a populated type is PROVEN, not assumed.** Tested 2026-08-13 against
TypeDB 3.10.4 — the same image the `iam` stack runs — on a throwaway database, since the root
parking lot's 2026-07-31 evidence covered adding a whole new **entity**, not an `owns` on an
existing populated one. The define was accepted, and a **pre-existing row took the new attribute
without being rewritten**. The throwaway database was deleted.

**3. AD-4 is not reopened.** AD-4's reasoning was multi-KB description blobs in a 50-entity identity
database shared by six bounded contexts. A short outcomes array is a different case, and career-coach
already stores its sibling this way in the same file.

Rejected: **B** — the AD-4 CouchDB store, which inverts both the dependency map and MVP Planning's
explicit _"item 2 before item 4"_ call. **C** — recompute at read time, which is wrong rather than
merely cheap: the verdict comes from a non-deterministic AI adapter, so the same Position could
render a different breakdown on each load.

### 🔴 A gap this decision surfaced — the schema edit alone does nothing

`TypeDbService` applies the schema **only at database creation** — an existing database logs
_"Database already exists — skipping schema init"_ and goes straight to `assertSchemaApplied()`.
Editing `iam.schema.typeql` therefore changes **nothing** on the running stack.

⚠️ **Recreating `iam` is not an available workaround.** A fresh volume mints a new
`CAREER_COACH_PRODUCT_ID` — the misconfiguration that made the app unreachable for 15 days — and
destroys the real Positions now in daily use.

**S1-4: build a small reusable `apply-schema` runner** (task C-0 below). Chosen over a one-off
hand-run because Sprint 2's pass-level state and AD-4's store will both need the same thing; and
over making `TypeDbService` apply defines at every boot, which would change boot behaviour for all
six bounded contexts sharing it and weaken the `assertSchemaApplied()` guard that exists for a real
failure.

🔴 **This is the SECOND time this gap has been hit, and the first fix left no tool behind.** On
2026-07-26 the pre-existing local `iam` volume had skipped `applySchema()` on boot, so
career-coach's own `strategy-plan`/`position`/`application` types **were never applied to the real
database at all**. It was fixed live by a one-off `@typedb/driver-http` script `define`-ing just the
new block — recorded in ``lessons-learned.md`` (🔴 not ported from `singularity`) under
`fix/career-coach-docker-build-and-ai-router-boot`. That precedent is the strongest argument for
S1-4 over another one-off: the one-off has already been written once, thrown away, and is now needed
a third time (C-2 here, plus Sprint 2 and AD-4).

⚠️ **It also constrains C-0's design**: that fix had to `define` only the new block, _"not the whole
`iam.schema.typeql` file, which would error re-declaring types that already exist"_. The runner must
apply a partial define, not the file.

🔴 **This gap is not career-coach's.** It affects every context on the shared `iam` database, so it
belongs in the root parking lot and is a Step 12 promotion candidate.

⚠️ **Found on disk, not by query.** `docs-store` returned `No matches` for both this subject and the
schema ADRs; `grep` over `docs/knowledge-base/` found the 2026-07-26 lesson immediately. A null was
confirmed against disk per the Documentation Search Standard, and the confirmation is what surfaced
the precedent — recorded here because the null was **wrong**, not merely empty.

---

## Task list — dependency-ordered

### Phase A — DOM-tier test assembly ✅ PROVISIONED 2026-08-13, no longer Sprint 1 work

> **Moved to Provision Environment** (founder decision, 2026-08-13). That stage's pillar 5 states
> the Cucumber/Screenplay **mechanism** is its job and the `.feature` **content** is Sprint 1's —
> and this phase was the mechanism. `careerCoachUi-e2e` now has a real `cucumber` target, world,
> and a `BrowseCareerCoach` ability mirroring `platform-portal/ui-e2e`, and
> `nx run careerCoachUi-e2e:cucumber` runs green at 0 scenarios.
>
> **What stays Sprint 1's:** writing the actual DOM-tier Scenarios against it — tasks B-5 and C-6
> below, unchanged.
>
> See [`10-provision-environment.md`](10-provision-environment.md).

**Subtotal: 0 days in this sprint** (≈1.5–2.5 days, paid by Provision Environment).

### Phase B — Item 1: salary badge + result count (Feature layer only)

| #   | Task                                                                                                                                                                                                                             | Est. | UX / Gherkin     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------------- |
| B-1 | `salary not published` **amber badge** in ``position-feed.component.ts`` (🔴 not ported from `singularity`) when `salaryRange` is absent — a badge, not a blank (UX-2) | S    | UX-2 · 2a-S5     |
| B-2 | Result count line above the feed. The component re-queries on filter change and so does not hold an unfiltered total — keep the initial unfiltered length alongside the filtered list rather than issuing a second query         | S    | UX Position Feed |
| B-3 | Component tests for B-1 and B-2, including the "every Position shows the badge" case — true of all real data today                                                                                                               | S    | —                |
| B-4 | Cucumber **2a-S5** at HTTP-Domain tier (`career-coach-api-e2e`) — the producer side: sourced with no salary, recorded unknown, not discarded                                                                                     | S    | 2a-S5            |
| B-5 | Cucumber for the badge at DOM tier on Phase A's assembly                                                                                                                                                                         | S    | UX-2             |

**Subtotal ≈ 2.5 days.**

### Phase C — Item 2: qualification per-requirement breakdown

Unblocked — persistence decided above (S1-3/S1-4).

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                                          | Est. | Layer          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | -------------- |
| C-0 | ✅ **DONE — `scripts/apply-schema.mjs` was provisioned 2026-08-13**, with its refusal paths, `--dry-run`, `--help` and idempotency each verified by running them against a throwaway database. What remains here is **using** it to apply C-2's define. ⚠️ Its "already applied" branch is still unexercised — TypeDB accepted a duplicate define silently, so idempotency holds via the server tolerating it | —    | tooling (done) |
| C-1 | Extend `QualificationVerdict` with `requirementOutcomes: { requirement, outcome: 'Met' \| 'NotMet' \| 'NotEvaluated', note? }[]`. **`NotEvaluated` is a third state, not a flavour of `NotMet`** — DS-3/UX-3                                                                                                                                                                                                  | S    | domain (port)  |
| C-2 | Add `attribute qualification-outcomes-json, value string;` and `owns qualification-outcomes-json @card(0..1)` on `position` in `iam.schema.typeql`; apply it with C-0; read/write in `typedb-position.repository.ts` following the existing optional-attribute pattern (`salary-range`, `rejection-reason`)                                                                                                   | M    | domain + infra |
| C-3 | Update ``ai-runtime-position-qualification.adapter.ts`` (🔴 not ported from `singularity`) to parse per-requirement outcomes, and revise `agents/apps/career-coach/position-qualification-agent.md` to emit them                                                                                                                     | M    | infra + prompt |
| C-4 | Update `stub-position-qualification.adapter.ts`'s fixture verdicts to the new shape — `POS-2201/2202/2203` must keep their current verdicts verbatim, since `career-coach-api-e2e` names them                                                                                                                                                                                                                 | S    | infra          |
| C-5 | Carry the outcomes onto `PositionDto`, and surface them on the Qualification Result screen with the `Not evaluated` third treatment plus the _"Qualified on 2 of 3 requirements"_ summary line                                                                                                                                                                                                                | M    | app + feature  |
| C-6 | Cucumber **F3-S1** at Domain tier (`career-coach-domain-e2e`) and the breakdown at DOM tier                                                                                                                                                                                                                                                                                                                   | M    | e2e            |

**Subtotal ≈ 4–5 days.** Item 2 is the sprint's real weight — five layers, not the M the MVP plan
sized it at before the persistence question surfaced.

⚠️ **C-3 changes a PromptOS artifact**, so `npm run promptos-conformance -- --changed` must pass
(ADR-080). Note also that the standard requires a prompt retrofit to go through an **A/B harness**
(fixed battery, `REPETITIONS ≥ 3`, temperature pinned) — **no runnable script for that harness was
found in `package.json`**; `promptos-conformance` is the structural checker only. Resolve how that
requirement is met before C-3 lands rather than discovering it at the gate.

### Phase D — Item 5: browser-automation spike

**Disposable by construction** (MVP Planning): persists no Position, ships no worker, changes no
image, introduces no AD-1 port split.

| #   | Task                                                                                                                                                                                                                                                              | Est. | Depends on |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------- |
| D-1 | 🔴 **Read the candidate target's ToS and `robots.txt` and put the reading to the founder.** No site is named in this plan — founder decision, 2026-08-13. Same shape as the Greenhouse/Lever reading of 2026-08-13, which is the model for what "read" means here | S    | none       |
| D-2 | 🔴 **FOUNDER GATE — no driving of any site until D-1 is accepted.**                                                                                                                                                                                               | —    | D-1        |
| D-3 | Drive the accepted target once, unauthenticated, honouring `robots.txt` and a deliberate delay; attempt to read one listing page                                                                                                                                  | M    | D-2        |
| D-4 | Write the observation to `docs/planning/career-coach/iterations/02/spike-browser-automation.md` — reachable or blocked; did an interstitial/CAPTCHA appear; what mitigation would cost; does the parse seam hold against real DOM                                 | S    | D-3        |
| D-5 | Update the Hypothesis Register in [`01-bmc.md`](../01/01-bmc.md): H1 and H3 move from 🔄 to a disposition **citing D-4's observation**, per MVP-3's rewritten validation method                                                                                   | S    | D-4        |

**Subtotal ≈ 2–3 days.** D-5 is what makes the spike count — an observation nobody records back
into the Register leaves the hypothesis exactly as stuck as it was.

---

## Sprint 1 total

**Revised 2026-08-13 after Provision Environment.** Phases A and C-0 moved to that stage, which
already built and verified both mechanisms.

| Phase                       | Original             | Now                 |
| --------------------------- | -------------------- | ------------------- |
| A — DOM test assembly       | ≈ 1.5–2.5 d          | **0** — provisioned |
| B — Salary badge + count    | ≈ 2.5 d              | ≈ 2.5 d             |
| C — Qualification breakdown | ≈ 4.5–5.5 d          | ≈ 4–5 d (C-0 done)  |
| D — Browser spike           | ≈ 2–3 d              | ≈ 2–3 d             |
| **Total**                   | **≈ 10.5–13.5 days** | **≈ 8.5–11 days**   |

**That now fits a two-week sprint**, which the original honestly did not. Nothing was descoped to
achieve it — the two items moved to the stage whose own methodology already owned them, and both
are built and verified rather than merely re-labelled.

⚠️ **One lever remains if it still runs long:** C-5's summary line can ship without the provenance
panel. **Phase D is not a lever** — dropping it repeats Iteration 01 exactly.

---

## Definition of Ready — checked, not assumed

| Requirement                       | Item 1                | Item 2              | Item 5                                   |
| --------------------------------- | --------------------- | ------------------- | ---------------------------------------- |
| "I CAN" statement, Future Present | ✅ Feature 2a         | ✅ Feature 3        | ⚠️ **No** — a spike, not a capability    |
| Given-When-Then written           | ✅ 2a-S5              | ✅ F3-S1            | ⚠️ **No** — its output is an observation |
| RBAC Permission record            | ✅ existing feed read | ✅ existing qualify | n/a — nothing exposed                    |
| Ubiquitous Language references    | ✅ `Position`         | ✅ `RequirementSet` | ✅ `Sourcing Service`                    |
| Golden Thread naming verified     | ✅                    | ✅                  | n/a                                      |

🔴 **Item 5 does not meet the Definition of Ready, and is in the sprint anyway.** That is deliberate
and recorded: a spike answers a question, so it has no capability statement and no Gherkin by
nature. Forcing one would be inventing specification for work whose whole point is that the answer
is unknown. **Its acceptance criterion is D-4's observation existing**, per MVP-3.

## Gates this sprint must clear

- **Golden Thread hard gate — satisfied with no waivers.** The sprint adds **no** `*.command.ts` or
  `*.query.ts`: item 1 needs no query change (see Step 8 findings), item 2 changes an existing
  Command's downstream shape only, item 5 adds nothing. Verify with
  `npm run golden-thread -- --check dispatch-coverage-commands --check dispatch-coverage-queries`.
- **Cucumber/Screenplay mandate** — B-4, B-5 and C-6. Jest/Vitest green does not satisfy it.
- **PromptOS conformance** — C-3 only. See the A/B harness caveat above.
- **ADR-012** — any defect found mid-sprint gets its failing test committed first.

---

## Handoff to Development

Implementation begins on **`phase/career-coach/14-qualification-breakdown`**, cut from `dev` per
ADR-078 (career-coach is undeployed, so `dev` is its line). Phase A must be green before any Phase B
or C Scenario is written, and **D-2's founder gate must be cleared before any site is driven**.
