# Provision Environment — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Environment-readiness report for career-coach Iteration 01, produced by
`start-provision-environment`. Consumes [08-mvp-plan.md](08-mvp-plan.md)'s v1 cut and
[09-sprint-1-plan.md](09-sprint-1-plan.md)'s corrected Phase A (fresh scaffold, not a job-search
migration)._

---

## Correction surfaced during this stage

The original AD1/Sprint 1 Plan called for migrating job-search's existing libs into
`scope:career-coach`. Mid-run, the founder clarified career-coach is an entirely new system —
job-search stays untouched, retired later as a separate decision. AD1 and Sprint 1 Plan's Phase A
were both corrected before provisioning proceeded (see
[docs/career-coach-ad1-sprint1-fresh-build-correction](https://github.com/dave-jackson-dev/singularity/pull/520)).
This report reflects the corrected, fresh-build plan.

## Pillar 1 — Bounded-context scaffold

Scaffolded fresh per root `CLAUDE.md`'s "Adding a new Bounded Context" recipe (no content carried
over from job-search):

| Project                                  | Generator                                          | Tags                                            |
| ---------------------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| `career-coach-domain`                    | `nx g @nx/js:lib --bundler=swc`                    | `["scope:career-coach", "type:domain"]`         |
| `career-coach-application`               | `nx g @nx/js:lib --bundler=swc`                    | `["scope:career-coach", "type:application"]`    |
| `career-coach-infrastructure`            | `nx g @nx/js:lib --bundler=swc`                    | `["scope:career-coach", "type:infrastructure"]` |
| `career-coach-feature-list`              | `nx g @nx/angular:lib --standalone`                | `["scope:career-coach", "type:feature"]`        |
| `career-coach-api`                       | `nx g @nx/nest:app`                                | `["scope:career-coach", "type:app"]`            |
| `careerCoachUi` (`apps/career-coach/ui`) | `nx g @nx/angular:remote --host=shell`             | `["scope:career-coach", "type:app"]`            |
| `career-coach-domain-e2e`                | Hand-scaffolded, mirroring `job-search-domain-e2e` | `["scope:career-coach", "type:app"]`            |

New ESLint boundary constraint added to `eslint.config.mjs`:
`{ sourceTag: 'scope:career-coach', onlyDependOnLibsWithTags: ['scope:career-coach', 'scope:shared', 'scope:platform'] }`
— no dependency on `scope:job-search` either direction, confirmed by the constraint's own
exclusion of that tag.

**Cucumber/Screenplay mechanism** (per `CLAUDE.md`'s mandatory gate, surfaced mid-run as a gap not
originally scoped by Sprint 1 Plan): `career-coach-domain-e2e` scaffolded with `project.json`'s
`cucumber` target, `cucumber.config.mjs`, `tsconfig.cucumber.json`, and a placeholder
`cucumber-world.ts` — the mechanism only. Actual `.feature` content and step definitions
implementing [06-three-amigos.md](06-three-amigos.md)'s Feature 1 Gherkin are Sprint 1's own
implementation task (added as Task 13a to [09-sprint-1-plan.md](09-sprint-1-plan.md)), not built
here — Provision Environment stands up the mechanism, Sprint 1 turns it red-then-green.

**Generator gaps found and fixed** (two known lessons, one new):

- `career-coach-{domain,application,infrastructure}/tsconfig.json` — `@nx/js:lib --bundler=swc`
  omitted `composite`/`module`/`moduleResolution` overrides (TS5095), matching the documented
  `"Nx lib generator tsconfig gap" lesson` (🔴 not ported from `singularity`). Fixed
  to match `job-search-domain`'s working pattern (`composite: true`, `module: "Node16"`,
  `moduleResolution: "node16"`, `ignoreDeprecations: "5.0"`).
- `career-coach-feature-list/tsconfig.lib.json` — missing `composite`/`sourceMap` alongside
  `inlineSources` (TS5051). Fixed to match `libs/shared/ui/tsconfig.lib.json`'s working pattern.
- `careerCoachUi/tsconfig.app.json` — missing `"dom"` in its `lib` array (TS2584, `console` not
  found). **New gap, not previously documented** — fixed to match `apps/content/tsconfig.app.json`
  (`"lib": ["ES2022", "dom"]`), the closest existing Angular MFE remote precedent. Worth adding to
  `docs/knowledge-base/lessons-learned.md` at Session Stop.

## Pillar 2 — Local dev stack

No new database or Docker Compose service needed for Sprint 1's scope (Strategy Plan/Requirement
Set persistence is deferred to Sprint 1's own infrastructure-layer tasks, Phase D). `career-coach-api`
serves via `nx serve career-coach-api`; `careerCoachUi` serves via `nx serve careerCoachUi`
(depends on `shell:serve`, per the generator's own `dependsOn`), consistent with this repo's
existing Module Federation dev workflow — no new tooling required.

## Pillar 3 — CI wiring

Checked this repo's actual current CI status rather than assuming: `gh workflow list --all`
confirms **"Job Search CI" is `disabled_manually`** (budget, per `project_ci_disabled_budget`) —
every other product-scoped workflow is similarly disabled. No new `career-coach-ci.yml` was
created; CI remains inactive for this scope, matching the repo-wide state. `nx run-many -t
lint,test,build` (documented below) is the verification path until CI budget is restored.

## Pillar 4 — Branch readiness

Cut `phase/career-coach/01-strategy-plan` from `main` (career-coach has no feature-branch layer
yet — this is the first phase branch for this project), per Branch Discipline (ADR-025). Phase A's
scaffold commit already landed there:
[`0b108b2a`](https://github.com/dave-jackson-dev/singularity/commit/0b108b2a) — "Sprint 1 Phase A
— fresh scope:career-coach scaffold."

## Baseline verification

```
nx run-many -t lint,test -p career-coach-domain career-coach-application \
  career-coach-infrastructure career-coach-feature-list careerCoachUi career-coach-api \
  career-coach-domain-e2e
  → 7 projects: all lint/test PASS

nx run-many -t build -p career-coach-domain career-coach-application \
  career-coach-infrastructure career-coach-feature-list
  → 4 projects: all build PASS

nx build career-coach-api    → PASS
nx build careerCoachUi       → PASS
nx run career-coach-domain-e2e:cucumber → 0 scenarios, 0 steps (expected — no .feature files yet)
```

All green. Sprint 1 (Phase B onward) can begin immediately with no missing-environment surprises.

---

## Next: Scrum Sprint Iteration

Not yet built as a Skill in this phase of `lean-agile-mvp-skills` (Phase 09, still `⬜ Planned`).
Sprint 1's remaining phases (B–E, plus Task 13a) continue as ordinary implementation work on
`phase/career-coach/01-strategy-plan`, following [09-sprint-1-plan.md](09-sprint-1-plan.md)'s
dependency order, until that Skill exists.
