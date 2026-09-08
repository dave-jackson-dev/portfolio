# Sprint 1 Plan — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Sprint 1's slice of [Workshop 8](08-mvp-plan.md)'s v1 cut (CC-001–CC-003, "Build My Strategy
Plan") broken into concrete, estimated, dependency-ordered implementation tasks — ready to hand to
actual implementation on a `phase/career-coach/01-strategy-plan` branch. Produced by the Sprint 1
Planning Workshop — Product Owner, Developer Primary; UX Designer, Architect Contributing._

> **Corrected 2026-07-24** — this plan originally treated Sprint 1 as a migration of job-search's
> existing `CandidateRequirements` code into `libs/career-coach/*`. The founder clarified career-
> coach is an entirely new system: job-search is untouched, and gets retired/archived later as its
> own separate decision, not folded into this build. This is a genuine greenfield Sprint 1 — see
> [05-architecture-design.md](05-architecture-design.md)'s AD1 for the corresponding correction.
> Job-search's `CandidateRequirements` entity/repository/handlers remain useful **reference
> material** for how a requirement-scoring domain concept was previously modeled in this repo —
> cited below as prior art to learn from, not code to reuse or move.

---

## Reference: job-search's prior art for RequirementSet-shaped modeling

Not a migration source — read-only inspiration for Sprint 1's fresh design:

| Prior art (job-search, untouched)                                                                           | What it demonstrates                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CandidateRequirements` entity (`libs/job-search/domain/src/lib/entities/candidate-requirements.entity.ts`) | A `create()`/`update()` create-or-revise shape and a `Requirement { priority, description, passingStatuses }` value shape — worth modeling `RequirementSet`'s own API after, not copying                                      |
| `ICandidateRequirementsRepository` port                                                                     | A `findByUserId`/`save` repository shape — a reasonable starting point for `IStrategyPlanRepository`'s own port signature                                                                                                     |
| `requirements-form` Angular component                                                                       | Demonstrates a _direct-entry settings form_ pattern — explicitly **not** the pattern to follow for career-coach's Intake Interview, which needs a guided conversational flow instead (see [07-ux-design.md](07-ux-design.md)) |

---

## Task list — dependency-ordered, Scaffold → Domain → Application → Infrastructure → Feature

**Estimate scale:** S / M / L (S ≈ half a day, M ≈ 1–2 days, L ≈ 3+ days), Developer's own
relative-sizing call — no story-point calibration exists yet for this project.

### Phase A — Bounded-context scaffold (`scope:career-coach`, fresh)

| #   | Task                                                                                                                                                                                                                                                                                                                                                  | Est. | Depends on |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------- |
| 1   | `nx g @nx/js:lib --name=career-coach-domain --directory=libs/career-coach/domain --bundler=swc`, `--name=career-coach-application`, `--name=career-coach-infrastructure` (three fresh libs, no content carried over from job-search); `nx g @nx/angular:lib --name=career-coach-feature-list --directory=libs/career-coach/feature-list --standalone` | M    | none       |
| 2   | Tag each new lib `["scope:career-coach", "type:<layer>"]` in its `project.json`, per root `CLAUDE.md`'s "Adding a new Bounded Context" recipe                                                                                                                                                                                                         | S    | Task 1     |
| 3   | Add the ESLint boundary constraint per AD1: `{ sourceTag: 'scope:career-coach', onlyDependOnLibsWithTags: ['scope:career-coach', 'scope:shared', 'scope:platform'] }` — no dependency on `scope:job-search` either direction                                                                                                                          | S    | Task 1     |
| 4   | `nx g @nx/nest:app --name=career-coach-api --directory=apps/career-coach/api`, `nx g @nx/angular:remote careerCoachUi --host=shell` — fresh apps, tagged `["scope:career-coach", "type:app"]`                                                                                                                                                         | M    | Tasks 1–3  |
| 5   | Run `nx run-many -t lint,test,build -p career-coach-domain career-coach-application career-coach-infrastructure career-coach-api career-coach-ui` to confirm the fresh scaffold builds cleanly before adding Sprint 1's real domain code                                                                                                              | S    | Tasks 1–4  |

**Phase A subtotal: ≈ 1 M-equivalent (≈ 2.5 days: M+S+S+M+S)** — one-time cost; every later Sprint
builds on this scaffold at zero additional setup cost

### Phase B — Domain layer (`career-coach-domain`)

| #   | Task                                                                                                                                                                                                                                                                                                   | Est. | Satisfies                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- | --------------------------------------------------------------------------------------- |
| 6   | `RequirementSet` value object (`libs/career-coach/domain/src/lib/entities/requirement-set.entity.ts`) — new, written fresh; `create()`/`update()` shape informed by job-search's `CandidateRequirements` prior art above, not copied from it                                                           | M    | CC-001 intake answers become a `RequirementSet`                                         |
| 7   | `StrategyPlan` aggregate root (`libs/career-coach/domain/src/lib/entities/strategy-plan.entity.ts`): wraps one `RequirementSet`, a `planId`, and `revisionNote?: string` (populated when a revision originates from Feature 4's candidate feedback, per Domain Storytelling Story 4's cross-reference) | M    | CC-002 "Receive a Strategy Plan built from my intake"; CC-003 "Revise My Strategy Plan" |
| 8   | `IStrategyPlanRepository` port (`findByUserId`, `save`) — new interface, shape informed by job-search's repository prior art                                                                                                                                                                           | S    | Same as Task 7                                                                          |
| 9   | Unit tests for tasks 6–8 (Jest, `career-coach-domain`'s fresh test project)                                                                                                                                                                                                                            | M    | All Feature 1 scenarios above, domain-unit level                                        |

**Phase B subtotal: ≈ 1 M-equivalent (≈ 2.5 days: M+M+S+M)**

### Phase C — Application layer (`career-coach-application`)

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Est. | Depends on  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----------- |
| 10  | `BuildStrategyPlanCommand`/`Handler` — new CQRS command: takes intake answers, builds a `RequirementSet` (Task 6), wraps it in a new `StrategyPlan` (Task 7)                                                                                                                                                                                                                                                                                                                                    | S    | Task 7      |
| 11  | `ReviseStrategyPlanCommand`/`Handler` — new command, calls `StrategyPlan`'s revise path, optionally recording a `revisionNote`                                                                                                                                                                                                                                                                                                                                                                  | S    | Task 7      |
| 12  | `GetStrategyPlanQuery`/`Handler` — new query, returns `StrategyPlan`                                                                                                                                                                                                                                                                                                                                                                                                                            | S    | Task 7      |
| 13  | Unit tests for tasks 10–12                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | M    | Tasks 10–12 |
| 13a | Domain-tier Cucumber scenario(s) implementing [06-three-amigos.md](06-three-amigos.md)'s Feature 1 Gherkin verbatim, wiring `career-coach-domain-e2e`'s placeholder `cucumber-world.ts` (scaffolded by Provision Environment, per [10-provision-environment.md](10-provision-environment.md)) against the real `career-coach-application` module and CommandBus/QueryBus, mirroring `apps/job-search/domain-e2e`'s pattern — mandatory per `CLAUDE.md`'s Cucumber/Screenplay gate, not optional | M    | Tasks 10–12 |

**Phase C subtotal: ≈ 1 M-equivalent (≈ 2 days: S+S+S+M+M)**

### Phase D — Infrastructure layer (`career-coach-infrastructure`)

| #   | Task                                                                                                                                          | Est. | Depends on  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----------- |
| 14  | `StrategyPlanRepository` persistence implementation — new store/table for career-coach, independent of job-search's persistence               | M    | Task 8      |
| 15  | `apps/career-coach/api`'s new controller exposing `POST /strategy-plan` (build), `PATCH /strategy-plan` (revise), `GET /strategy-plan` (read) | S    | Tasks 10–12 |
| 16  | Controller-level smoke tests for the three endpoints, per the Smoke Test Standard                                                             | M    | Task 15     |

**Phase D subtotal: ≈ 1 M-equivalent (≈ 2 days: M+S+M)**

### Phase E — Feature layer (Angular UI, `career-coach-feature-list` / `apps/career-coach/ui`)

Screens per [Workshop 7's Feature 1 UX design](07-ux-design.md#feature-1--build-my-strategy-plan):
`Intake Interview`, `Strategy Plan`.

| #   | Task                                                                                                                                                                                                                                                                                                      | Est. | UX screen          | Gherkin scenario(s)                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------ | --------------------------------------------------------------------------------------------------- |
| 17  | `Intake Interview` screen — new component: guided flow covering location preference, salary range, company size, tech stack, plus open-ended best-practice questions, per [07-ux-design.md](07-ux-design.md)'s mockup — deliberately not modeled on job-search's direct-entry `requirements-form` pattern | M    | `Intake Interview` | "Complete the intake interview"                                                                     |
| 18  | `Strategy Plan` screen — new component: read-only fact display (location/salary/company-size/stack) plus a "Revise Plan" action and a revision-history banner                                                                                                                                             | M    | `Strategy Plan`    | "Receive the Strategy Plan built from intake", "Revise the Strategy Plan when circumstances change" |
| 19  | Component-level smoke tests for both screens, per the Smoke Test Standard                                                                                                                                                                                                                                 | M    | both               | all Feature 1 scenarios, UI level                                                                   |

**Phase E subtotal: ≈ 1 M-equivalent (≈ 2.5 days: M+M+M)**

---

## Sprint 1 total estimate

≈ 12 days across Phases A–E (Scaffold ≈2.5, Domain ≈2.5, Application ≈2, Infrastructure ≈2,
Feature ≈2.5, plus Task 13a's Cucumber wiring) — a genuine fresh build; larger than the earlier
(incorrect) migration-based estimate of ~9.5 days, since nothing is reused from job-search's code,
only its design consulted as
reference.

---

## job-search's status (unaffected by this Sprint)

`job-search` continues running exactly as it does today — no files moved, no libs renamed, no
scope tag changed. Its eventual retirement, once career-coach fully supersedes it, is a separate
future decision, out of scope for Sprint 1 and for Provision Environment.

---

## Handoff to Development

Sprint 1 implementation begins on `phase/career-coach/01-strategy-plan`, cut from wherever
career-coach's own feature branch sits (per this repo's Branch Discipline, ADR-025) — not directly
on `main`. Phase A (scaffold) must land and pass `lint`/`test`/`build` before any Phase B–E task
begins.
