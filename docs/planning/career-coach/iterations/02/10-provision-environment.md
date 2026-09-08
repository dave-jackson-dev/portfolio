# Provision Environment — Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Stage:** Provision Environment · **Attempt:** 1 · **Run:** 2026-08-13
> **Provisions:** what [`09-sprint-1-plan.md`](09-sprint-1-plan.md)'s Sprint 1 slice assumes.
> **Does not re-decide scope** — the v1 cut (Workshop 8) and Sprint 1 slice (Workshop 9) stand.

## Verdict

✅ **Ready.** A developer can start Sprint 1's first task now. Two mechanisms were built, three
pillars were verified as already present, and one real gap is flagged rather than silently filled.

---

## 🔴 Career Coach is not greenfield — this stage verified far more than it created

Sprint 1 Planning's Step 8 already established that Iteration 02 adds **no new bounded context**.
Re-checked here against disk rather than taken from the plan:

| Pillar                       | State                                                                                                                                                                | Action              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 1 · Bounded-context scaffold | **Already exists.** All four libs + `api`/`ui` + three e2e projects, every one tagged `scope:career-coach` with the right `type:` — verified in each `project.json`. | Verified, not built |
| 2 · Local dev stack          | **Up and reachable.** See the probe below.                                                                                                                           | Verified            |
| 3 · CI wiring                | 🔴 **ABSENT — career-coach has no CI workflow at all.**                                                                                                              | Flagged, not built  |
| 4 · Branch readiness         | `phase/career-coach/14-qualification-breakdown` cut from `dev` (ADR-078: career-coach is undeployed, so `dev` is its line).                                          | Done                |
| 5 · Cucumber/Screenplay      | 🔴 **DOM tier did not exist.** Built.                                                                                                                                | **Built**           |

**No migration checkpoint was needed.** The methodology requires fresh founder confirmation before
executing any migration that touches another project's existing files — nothing here does. Both
mechanisms below are new files; no existing code was moved, renamed, or retagged.

---

## Two scope reconciliations, taken by the founder

The methodology's pillar 5 states that provisioning the **mechanism** is this stage's job and
writing the **content** is Sprint 1's. Sprint 1 Planning had put both in the sprint.

| Moved here                 | Was              | Rationale                                                                               |
| -------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| DOM-tier Cucumber assembly | Sprint 1 Phase A | Pillar 5 verbatim — the mechanism is this stage's, the `.feature` content is Sprint 1's |
| `scripts/apply-schema.mjs` | Sprint 1 C-0     | Same shape: the runner is a mechanism, applying career-coach's define is the content    |

**Sprint 1 drops from ≈10.5–13.5 days to ≈8.5–11.** Its Phase A disappears; C-0 becomes "run the
provisioned runner" rather than "build one".

---

## What was built

### 1 · DOM-tier Cucumber/Screenplay assembly — `careerCoachUi-e2e`

`project.json` held `"targets": {}` and one Nx scaffold `example.spec.ts`. Career Coach had **no
DOM-tier assembly at all**, while both items in the Sprint 1 slice change Angular views — and the
`Smoke Test Standard` (🔴 not ported from `singularity`)'s 🔴 mandate covers
retrofitting features that currently have none.

Mirrors `apps/platform-portal/ui-e2e`, the working sibling:

| File                                              | Role                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `project.json`                                    | `cucumber` target (`nx:run-commands`), `implicitDependencies` on `shell` + `careerCoachUi` |
| `cucumber.config.mjs`                             | feature glob, world + steps `require`, JSON report output                                  |
| `tsconfig.cucumber.json`                          | `ts-node` transpile config                                                                 |
| `src/support/cucumber-world.ts`                   | `CareerCoachWorld`, shared browser, `JobSeeker` actor                                      |
| `src/screenplay/abilities/browse-career-coach.ts` | `BrowseCareerCoach` — drives the federated shell                                           |

🔴 **One deliberate divergence from the sibling.** platform-portal's world throws in `BeforeAll`
when `SMOKE_TEST_EMAIL`/`_PASSWORD` are unset. That is right for a suite whose every scenario signs
in, and wrong for a freshly-provisioned one with none: it would fail on any machine that has never
seeded a test user, making _"the mechanism is wired"_ indistinguishable from _"the mechanism is
broken"_. Credentials are checked in `requireSmokeTestCredentials()`, called by the first step that
actually authenticates.

⚠️ **No placeholder `.feature` was created**, deliberately. A trivially-passing scenario would enter
`docs-store`'s Gherkin corpus and move the Golden Thread denominators without any behaviour being
covered. The target is **empty-but-runnable**, which is exactly what the methodology asks for:

```
$ nx run careerCoachUi-e2e:cucumber
0 scenarios
0 steps
✅ Successfully ran target cucumber for project careerCoachUi-e2e
```

### 2 · `scripts/apply-schema.mjs` — the additive-define runner

Closes the gap Sprint 1 Planning found: `TypeDbService` applies schema **only at database
creation**, so a `.typeql` edit never reaches a running stack, and recreating `iam` is barred
(fresh `CAREER_COACH_PRODUCT_ID` — the 15-day outage — plus loss of live Positions).

**Third time is the charm.** A one-off was written for this on 2026-07-26 and thrown away, and was
needed again on 2026-08-13. This one is kept.

| Behaviour                     | Detail                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| Partial define only           | Applies the file it is given — never a whole `.typeql`, which errors on re-declared types                 |
| Refuses non-additive          | `undefine`/`redefine`, or no `define` block → exit 3. Additive is proven here; breaking is **unproven**   |
| Refuses a missing database    | Never creates one — that would hide the misconfiguration it exists to fix. Exit 3                         |
| Idempotent                    | Re-running an applied define exits 0                                                                      |
| `--help`, unknown-flag reject | Per the `CLI `--help` convention` (🔴 not ported from `singularity`) |

**Verified by running it, on a throwaway database — the live `iam` was not touched:**

| #   | Check                             | Result                              |
| --- | --------------------------------- | ----------------------------------- |
| 1   | `--help` exits 0, changes nothing | ✅ exit 0                           |
| 2   | Unknown flag rejected             | ✅ exit 2                           |
| 3   | `undefine` refused                | ✅ exit 3, both reasons named       |
| 4   | Missing database refused          | ✅ exit 3, present databases listed |
| 5   | `--dry-run` changes nothing       | ✅ exit 0, printed the define       |
| 6   | Real apply                        | ✅ exit 0                           |
| 7   | Re-run is a no-op                 | ✅ exit 0                           |

⚠️ **Be precise about test 7.** TypeDB accepted the duplicate define **silently**, so idempotency
holds because the server tolerates it — the script's own "already applied" branch did **not** fire
and is therefore still unexercised. It is a fallback, not a verified path.

---

## Local dev stack — probed, not assumed

| Service                          | Result                                         |
| -------------------------------- | ---------------------------------------------- |
| `platform-shell`                 | `200`                                          |
| `platform-api-gateway`           | responding                                     |
| `career-coach-api` (via gateway) | **`401`** — the correct unauthenticated answer |
| `platform-iam` + `iam-typedb`    | responding; both containers healthy            |

🔴 **The `401` is a pass, not a failure.** `GET /api/career-coach/health` without a token _should_
be refused — it proves the guard chain in front of career-coach is live, which is the thing worth
knowing before Sprint 1 starts writing DOM-tier scenarios against it.

---

## Baseline — run, not cited

🔴 **Re-verified at close with `--skip-nx-cache`.** The first pass reported _"Nx read the output
from the cache instead of running the command"_ for several targets, and **a cached green is not
evidence the gate still passes.** Every figure below comes from a run that actually executed.

| Target                                                                                     | Result                              |
| ------------------------------------------------------------------------------------------ | ----------------------------------- |
| `nx run-many -t lint -p career-coach-{domain,application,infrastructure,feature-list,api}` | ✅ 5 projects, all pass             |
| `nx test career-coach-domain`                                                              | ✅ 5 suites, **33 tests**           |
| `nx test career-coach-application`                                                         | ✅ 16 suites, **47 tests**          |
| `nx test career-coach-infrastructure`                                                      | ✅ 20 suites, **94 tests**          |
| `nx test career-coach-feature-list` (Vitest)                                               | ✅ 9 files, **47 tests**            |
| **Test total**                                                                             | ✅ **221 tests across 50 suites**   |
| `nx run-many -t build -p career-coach-{domain,application,infrastructure,feature-list}`    | ✅ 4 projects                       |
| `nx build career-coach-api` (individual — `nx:run-commands` batching trap)                 | ✅                                  |
| `nx run career-coach-domain-e2e:cucumber`                                                  | ✅ **16 scenarios, 91 steps**       |
| `nx run career-coach-api-e2e:cucumber`                                                     | ✅ **33 scenarios, 149 steps**      |
| `nx run careerCoachUi-e2e:cucumber` _(newly provisioned)_                                  | ✅ 0 scenarios — empty-but-runnable |

⚠️ **Correction.** This table first recorded the test result as _"47 tests, 9 files"_. That was the
**last project's output only** — `career-coach-feature-list`'s Vitest run — read off the tail of a
`run-many`. The real total is **221**. Caught by the close's own uncached re-run, which is precisely
what that step exists for; recorded rather than quietly fixed, because the failure mode (reading one
project's summary as the whole suite's) will recur otherwise.

ℹ️ Two `ERROR` lines appear in the test output — `JsonApiPositionSourcingAdapter` logging a skipped
404 board, and `ScheduledSourcingJob` logging `TypeDB unavailable`. **Both are assertions, not
failures:** those suites test the partial-success and failure paths, and both passed.

---

## 🔴 Flagged, not filled — career-coach has no CI

`.github/workflows/` holds ten workflows. **None mentions career-coach**, and none of its projects
appears in any `nx affected` scope. There is a `job-search-ci.yml` — for the project career-coach
**superseded**.

So career-coach has been shipping on local gates alone, while being **live, in daily use, and
running a nightly sourcing job against real third-party APIs**.

**Founder decision, 2026-08-13: flag it, do not build it.** No Sprint 1 task assumes CI, and the
methodology names **Over-Provisioning** — standing up infrastructure because it seems needed
eventually — as an anti-pattern of this exact stage. Recorded in the root parking lot with an
owner instead, so it is visible rather than discovered.

---

## Deviation recorded

**The `architect`, `developer` and `sre-devops` subagents were not spawned** (methodology step 6).
This session carries a standing instruction not to use the Agent tool unless the user asks. The
lenses were applied directly against the repo, both scope reconciliations were put to the founder
before anything was built, and every claim above was verified by running the thing. Same deviation
as Workshops 5–9 this iteration.

---

## Handoff to Sprint 1

Start on **`phase/career-coach/14-qualification-breakdown`** (already cut, from `dev`).

Sprint 1's revised shape — Phase A gone, C-0 reduced to running the provisioned runner:

| Phase                           | Estimate          |
| ------------------------------- | ----------------- |
| B — Salary badge + result count | ≈ 2.5 d           |
| C — Qualification breakdown     | ≈ 4–5 d           |
| D — Browser spike               | ≈ 2–3 d           |
| **Total**                       | **≈ 8.5–11 days** |

🔴 **D-2's founder gate stands.** No site is driven until its ToS reading is accepted.
