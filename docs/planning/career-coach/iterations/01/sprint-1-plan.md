# Sprint 1 Plan (Ceremony Output) — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Sprint Planning ceremony output for Sprint 1. Since this is Sprint 1, this ceremony confirms and
commits to the task breakdown already produced by Workshop 9
([09-sprint-1-plan.md](09-sprint-1-plan.md)) rather than re-planning from scratch, per
`start-ceremony`'s registry._

## Sprint Goal

Expressed in Green-capability terms, not a task list: **CC-001, CC-002, and CC-003 ("Build My
Strategy Plan") will be Green by Sprint end** — i.e. Feature 1's Gherkin Scenarios in
[06-three-amigos.md](06-three-amigos.md) all pass, backed by real `StrategyPlan`/`RequirementSet`
domain code, not just scaffolding.

## Definition of Ready — confirmed for all 3 stories

| Story  | I CAN statement | Given-When-Then specs                                       | RBAC record                                      | Ready? |
| ------ | --------------- | ----------------------------------------------------------- | ------------------------------------------------ | ------ |
| CC-001 | ✅ (Story Map)  | ✅ (Feature 1, Scenario "Complete the intake interview")    | Job Seeker / Complete / IntakeInterview / Create | ✅     |
| CC-002 | ✅              | ✅ (Scenario "Receive the Strategy Plan built from intake") | Job Seeker / Receive / StrategyPlan / Read       | ✅     |
| CC-003 | ✅              | ✅ (Scenario "Revise the Strategy Plan")                    | Job Seeker / Revise / StrategyPlan / Write       | ✅     |

## Committed tasks this Sprint (from 09-sprint-1-plan.md)

Phases A (scaffold) — already provisioned and Green, per
[10-provision-environment.md](10-provision-environment.md). Phases B–E (Tasks 6–19) — this
Sprint's actual commitment, taken in dependency order.

## Sprint length

This Sprint has no fixed calendar length yet (personal-tool solo project) — it runs until CC-001–
CC-003 are Green, per the Sprint Goal above, not a fixed two-week box.
