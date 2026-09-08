# Sprint 1 Planning — Transcript

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Workshop:** 9 of 9 · **Attempt:** 1 · **Facilitated:** 2026-08-13
> **Artifact:** [`09-sprint-1-plan.md`](../09-sprint-1-plan.md)
>
> This file records **what was considered and not taken**. The artifact records what was decided;
> only this records what was rejected, and why. Founder directive, 2026-07-30.

---

## 1 — The Sprint 1 slice: three candidate cuts, one taken

MVP Planning deliberately did not pre-empt this, recording only that _"four build items plus a spike
is a full iteration"_. Three slices were put to the founder.

| Slice                   | Rejected because                                                                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1, 2, 3**             | Defers the spike. MVP Planning's own words are _"item 5 is the one that must not slip"_, and slipping it is the precise failure Iteration 01 is on record for. All-product-work sprints are how that happened. |
| **1, 5 only**           | Honest and small, but leaves items 2, 3 and 4 (M + M/L + L) in Sprint 2 — moving the overcommitment rather than removing it. Sprint 2 would be ~9–12 days against Sprint 1's ~3–4.                             |
| **1, 2, 5** — **TAKEN** | Head of the dependency chain, the only item with Gherkin written this iteration, and the hypothesis-answering item. Splits the weight ~10–13 / ~7–9 across two sprints.                                        |

**The ordering itself was never in question**, and deliberately so — Step 7 says this workshop
consumes AD's dependency map rather than renegotiating it. What was open was only _where to cut the
already-ordered list_.

## 2 — The spike's target site: three options, the decision deferred by design

| Option                              | Outcome                                                                                                                                                                                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Greenhouse/Lever board page**     | **Rejected.** ToS already cleared, so cheapest — but these are friendly hosts that will almost certainly show no anti-bot at all. H3 is _"CAPTCHA / anti-bot mitigation cost"_; observing nothing on a cooperative host is not an answer to it. |
| **A job-board search page**         | **Not chosen here.** It is the site class the hypotheses are actually about, but its ToS has never been read, and naming it in a plan would read as authorisation.                                                                              |
| **Decide at the spike** — **TAKEN** | D-1 reads the target's terms, D-2 is an explicit founder gate, D-3 drives only what was accepted. No site appears in the plan.                                                                                                                  |

This mirrors how Greenhouse/Lever were handled on 2026-08-13 — read the documents first, put the
reading to the founder, then act. That sequence is the reason those two are cleared today.

## 3 — Where per-requirement outcomes persist: surfaced by task breakdown, not by AD

**This did not exist as a question before this workshop.** It appeared when C-2 was estimated and
`Position`'s actual persistence was read: flat attributes only, in the shared `iam` schema at line
610 — the same file AD-4 had just decided not to touch.

| Option                         | Assessment                                                                                                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C — recompute at read time** | **Rejected on correctness, not cost.** The verdict comes from a non-deterministic AI adapter, so the same Position could render a different breakdown on each load. F3-S1 says _"recorded"_. |
| **B — put it in AD-4's store** | **Rejected on ordering.** It puts item 2 behind item 4, inverting both the dependency map and MVP Planning's explicit _"item 2 before item 4"_ call.                                         |
| **A — one additive attribute** | ✅ **TAKEN** (S1-3, founder, 2026-08-13).                                                                                                                                                    |

**Deliberately not done: silently picking A and building the plan on it.** Step 8 requires a finding
of this kind to be isolated and put to the founder rather than carried on an earlier workshop's
acceptance of an adjacent decision.

### What was gathered before putting it to the founder, rather than after

The first draft of this transcript called A merely "recommended". Two further reads made it much
stronger, and both were done because the decision was going to a person:

- **`strategy-plan.requirements-json` is career-coach's own row in the same schema**, and it
  serializes `RequirementSet.requirements` — the very list these outcomes map to one-for-one. The
  schema comment states the criterion for the idiom (_"nothing queries into individual requirements
  server-side"_), and that criterion holds identically for outcomes. This turned "matches a pattern
  somewhere in the file" into "matches the sibling of this exact data".
- **The additive-`owns` claim was tested rather than cited.** The root parking lot's 2026-07-31
  evidence covers adding a whole new **entity**; adding an `owns` to an already-**populated** type is
  a different case and was unproven here. A throwaway database on the live TypeDB 3.10.4 server
  proved it — define accepted, pre-existing row took the new attribute without a rewrite — then was
  deleted. **The real `iam` database was not touched.**

## 3a — The migration gap, found while justifying option A

Reading `TypeDbService` to size C-2 turned up something neither AD nor MVP Planning knew: **schema is
applied only at database creation.** An existing database logs _"skipping schema init"_. So the
`.typeql` edit option A implies **changes nothing on the running stack** — a fact that would
otherwise have been discovered mid-sprint by a developer wondering why their attribute did not exist.

Recreating `iam` was considered and dismissed in the same breath: it mints a fresh
`CAREER_COACH_PRODUCT_ID`, which is the documented 15-day outage, and destroys real Positions in
daily use.

| Migration option                              | Outcome                                                                                                                                                                                             |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **One-off `define` by hand**                  | **Rejected.** Cheapest, but leaves no repeatable path — and Sprint 2's pass-level state and AD-4's store both need the same thing, so the question would be re-faced twice inside one iteration.    |
| **`TypeDbService` applies defines at boot**   | **Rejected on blast radius.** It changes boot behaviour for all six bounded contexts on the shared database, and weakens `assertSchemaApplied()`, a guard written for a real observed failure mode. |
| **A small `apply-schema` runner** — **TAKEN** | S1-4. `tools/docs-store/src/apply-schema.mjs` already demonstrates the shape. Added as task C-0, and explicitly **not** a scope lever.                                                              |

🔴 **This gap belongs to the platform, not to career-coach** — every context on the shared `iam`
database has it. Recorded for the root parking lot and as a Step 12 promotion candidate, so it does
not stay stranded on this iteration's docs.

## 4 — Phase A: an addition the MVP plan did not size

`careerCoachUi-e2e` was found to be a bare scaffold — `"targets": {}` and one `example.spec.ts`.

**Considered and rejected: covering items 1 and 2 at HTTP-Domain tier only, with a Proof Waiver.**
Both items change Angular views, and the Smoke Test mandate explicitly covers retrofitting features
that currently have none. A waiver would have been the cheaper read of a 🔴 mandate written to stop
exactly that. Standing the assembly up also unblocks Sprint 2's Pass Outcome screen, so the cost is
paid once rather than deferred twice.

**Also rejected: quietly folding Phase A into item 1's estimate.** It is prerequisite tooling, not
product work, and hiding it would misattribute ~2 days to a badge.

## 5 — Four Step 8 findings, two of which made the sprint smaller

Recorded because the reflex is to treat verification as a formality that only ever adds work:

- `salaryRange` already existed on entity, DTO **and** handler — item 1 dropped to Feature-layer only.
- The count needs no query change, which is also **why the Golden Thread gate passes with no waivers**
  this sprint. That was checked, not assumed.
- Playwright is already installed; the alpine/musl constraint is a container concern the spike avoids
  by construction.
- Offsetting both: no Iteration 02 Gherkin is implemented yet, so every item carries new Cucumber work.

## 6 — Item 5 fails the Definition of Ready, and was committed anyway

The methodology says _"verify every story meets the Definition of Ready before committing"_. Item 5
has no "I CAN" statement and no Gherkin.

**Rejected: writing Gherkin for the spike to make the checklist green.** That would be composing
specification for work whose entire purpose is that the outcome is unknown — and a green checkbox
over an invented spec is a close relative of _"resolved at the Architecture Design workshop"_, the
sentence MVP-3 had to rewrite. The failure is recorded in the artifact instead, with D-4's
observation named as the acceptance criterion.

## 7 — The estimate was not rounded down to fit

≈10–13 days against a two-week sprint. **Rejected: trimming Phase A or C-5 pre-emptively to make the
number fit.** Two levers are named in the artifact and left to Development to pull if needed —
stating the real number and the levers is more useful than a plan that fits by construction. Phase D
is explicitly excluded as a lever.

## 8 — Deviation: subagents not spawned

Step 6 calls for `product-owner` and `developer` as primary facilitators with `ux-designer` and
`architect` consulting. **Not spawned** — this session carries a standing instruction not to use the
Agent tool unless the user asks. The lenses were applied directly against the repo, and both founder
decisions were put explicitly before anything was written.

Same deviation as Workshops 5–8 this iteration, recorded for the same reason.

## 9 — Backwards propagation: what was updated, and what was deliberately left alone

**Updated:**

| Artifact                    | Change                                                                                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `05-architecture-design.md` | AD-4's _"no change to `iam.schema.typeql` is required"_ **narrowed**. True of descriptions, which is what AD-4 decided; not true of the schema in general now S1-3 adds one attribute. Marked as narrowed, **not** as AD-4 reopened. |
| `08-mvp-plan.md`            | Its `M` for item 2 superseded (≈4.5–5.5 d, five layers), item 1 moved down to Feature-layer-only, and the 1/2/5 ÷ 3/4 split recorded against its own "does not pretend the five fit in one sprint" note.                             |
| `summary.md`                | Stages table, decisions S1-1…S1-4, open item 6 closed and 6a opened.                                                                                                                                                                 |
| Root `parking-lot.tasks.md` | The schema-application gap, as a platform `#defect` owned by Architect.                                                                                                                                                              |
| `lessons-learned.md`        | New entry for the gap, both traps, and the bounds of what additive change is actually proven to do.                                                                                                                                  |

**Deliberately left alone:**

- **`06-three-amigos.md` and `07-ux-design.md`** — nothing this workshop found falsifies either. UX
  already recorded that two screens need data the API does not return; Sprint 1 acts on that rather
  than correcting it.
- **`01-bmc.md`'s Hypothesis Register** — MVP-3 already rewrote H1/H3's validation method to require
  a recorded observation. Sprint 1 names the tasks that produce it (D-3 → D-5) but does not restate
  the method. Updating the Register is **D-5's job, after the observation exists** — doing it now
  would be the same premature tick MVP-3 was written to stop.
- **The `IPositionSourcingPort` / `IPositionQualificationPort` comments** claiming Sprint 2/3 bind
  stubs. Stale — the AI-runtime adapter superseded the qualification stub — but harmless, and
  rewriting shipped code comments is C-1/C-3's commit, not a planning doc's.

**Not propagated because it does not exist yet:** there is **no `docs-store` doc type for a sprint
plan**, so `09-sprint-1-plan.md` is **not queryable**. The stack is up and healthy — this is a
missing doc type, not an outage. Stated so the absence is a known fact rather than an assumption.
