# Iteration 02 — Running Summary

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> Started 2026-08-12. Scope: real Position sourcing, to finally validate the automation-risk
> hypotheses Iteration 01 carried and never tested.

## Stages

| Stage                                             | Status                               | Artifact                                                                                                       |
| ------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Workshops 1–3 (BMC / VPC / Story Map)             | ⏭️ Carried forward from Iteration 01 | [`iterations/01/`](../01/)                                                                                     |
| Workshop 4 — Domain Storytelling (Story 2 re-run) | ✅ Complete 2026-08-13, attempt 1    | [`04-domain-storytelling.md`](04-domain-storytelling.md) + 2 `.egn`                                            |
| Workshop 5 — Architecture Design                  | ✅ Complete 2026-08-13, attempt 1    | [`05-architecture-design.md`](05-architecture-design.md)                                                       |
| Workshop 6 — Three Amigos                         | ✅ Complete 2026-08-13, attempt 1    | [`06-three-amigos.md`](06-three-amigos.md)                                                                     |
| Workshop 7 — UX Design                            | ✅ Complete 2026-08-13, attempt 1    | [`07-ux-design.md`](07-ux-design.md) + 3 SVG mockups                                                           |
| Workshop 8 — MVP Planning                         | ✅ Complete 2026-08-13, attempt 1    | [`08-mvp-plan.md`](08-mvp-plan.md)                                                                             |
| Workshop 9 — Sprint 1 Planning                    | ✅ Complete 2026-08-13, attempt 1    | [`09-sprint-1-plan.md`](09-sprint-1-plan.md)                                                                   |
| Provision Environment                             | ✅ Complete 2026-08-13, attempt 1    | [`10-provision-environment.md`](10-provision-environment.md)                                                   |
| Scrum Sprint 1                                    | ✅ Complete 2026-08-13               | [`sprint-1-status.md`](sprint-1-status.md) · [review](sprint-1-review.md) · [retro](sprint-1-retrospective.md) |
| Scrum Sprint 2                                    | ✅ Complete 2026-08-13               | [`sprint-2-status.md`](sprint-2-status.md) · [review](sprint-2-review.md) · [retro](sprint-2-retrospective.md) |

✅ **Both sprints are complete. All v1 cut items are Green.** Iteration 02 Sprint Goal met in full.
Next stage: Environment Deployment (not yet a Skill — manual deploy of the updated `career-coach-api`
image with `CAREER_COACH_SOURCING_BOARDS`, and optionally `CAREER_COACH_COUCHDB_URL` to enable
description storage).

## Decisions

| ID    | Decision                                                                                          | Date       |
| ----- | ------------------------------------------------------------------------------------------------- | ---------- |
| D1    | Target Greenhouse/Lever-hosted career boards                                                      | 2026-08-12 |
| D2    | Public and unauthenticated — no account                                                           | 2026-08-12 |
| D3    | Sequenced delivery — JSON adapter in-process first, browser discovery as its own worker           | 2026-08-12 |
| D4    | The JSON half needs no browser, so `career-coach-api`'s image is unchanged                        | 2026-08-12 |
| DS-1  | Story 2 told as TWO stories — 2a Board API Sourcing, 2b Sourcing Service (narrowed to discovery)  | 2026-08-13 |
| DS-2  | A sourcing pass is partial-success: healthy boards create Positions, a failed board is recorded   | 2026-08-13 |
| DS-3  | Absent salary is NOT a failed requirement — qualify on everything else, flag salary unknown       | 2026-08-13 |
| DS-4  | The nightly schedule is the normal initiator; the Job Seeker's manual trigger is the exception    | 2026-08-13 |
| 3A-1  | Story 2 becomes TWO Features — 2a Board API Sourcing, 2b Sourcing Service Discovery               | 2026-08-13 |
| 3A-2  | The Story Map's CC-004 is SPLIT into CC-004a/CC-004b to match, closing the drift at source        | 2026-08-13 |
| UX-1  | Three screens; the 401 states use the platform's existing login rather than a new screen          | 2026-08-13 |
| UX-2  | `salary not published` is an amber badge, not a blank — on real data it is EVERY Position         | 2026-08-13 |
| UX-3  | `Not evaluated` is a third treatment, neither met nor failed (DS-3: absent ≠ failed)              | 2026-08-13 |
| UX-4  | Provenance badges on every card, so the feed does not re-merge what AD-1/DS-1 split               | 2026-08-13 |
| MVP-1 | v1 cut: salary badge, qualification breakdown, pass outcome, description store, browser spike     | 2026-08-13 |
| MVP-2 | Production Feature 2b and UX-4 provenance DEFER to Iteration 03                                   | 2026-08-13 |
| MVP-3 | H1/H3 validation method REWRITTEN — a recorded observation, not "resolved at a workshop"          | 2026-08-13 |
| AD-1  | Two System Actors, two ports — `Board API Sourcing` vs `Sourcing Service`; split deferred         | 2026-08-13 |
| AD-2  | The browser worker persists via `career-coach-api` over HTTP; it is not a second writer           | 2026-08-13 |
| AD-3  | Relevance filtering belongs at query time in `ListPositionsQuery`, not in sourcing                | 2026-08-13 |
| AD-4  | Position descriptions live in CouchDB+Nouveau — the 2026-07-26 reservation's trigger has fired    | 2026-08-13 |
| S1-1  | Sprint 1 is items 1, 2 and 5; items 3 and 4 move to Sprint 2                                      | 2026-08-13 |
| S1-2  | The spike's target site is NOT named in the plan — read its ToS, then a founder gate, then drive  | 2026-08-13 |
| S1-3  | Per-requirement outcomes persist as one additive `qualification-outcomes-json` on `position`      | 2026-08-13 |
| S1-4  | Build a reusable `apply-schema` runner — schema currently applies only at database creation       | 2026-08-13 |
| PE-1  | The DOM-tier assembly AND `apply-schema.mjs` move to Provision Environment — mechanism vs content | 2026-08-13 |
| PE-2  | career-coach has NO CI at all — flag it, do not build it here (over-provisioning)                 | 2026-08-13 |
| SP2-1 | Items 3 and 4 both in Sprint 2 (sourcing pass outcome + description store)                        | 2026-08-13 |
| SP2-2 | PromptOS A/B harness built this sprint, unblocking C-3b                                           | 2026-08-13 |
| SP2-3 | Phase D target: `job-boards.greenhouse.io/remotecom` (Remote.com) — founder-confirmed             | 2026-08-13 |
| SP2-4 | 2b-S2 Green at Domain tier only via `StubDiscoverySourcingAdapter`                                | 2026-08-13 |

## Shipped

- **The single-use golden path is fixed** ([PR #915](https://github.com/dave-jackson-dev/singularity/pull/915)) — v1 is re-verifiable on demand.
- **Real JSON sourcing** ([PR #919](https://github.com/dave-jackson-dev/singularity/pull/919)) — Greenhouse/Lever public APIs behind a `BoardSource` seam, opt-in via `CAREER_COACH_SOURCING_BOARDS`, plus a nightly `ScheduledSourcingJob`. Live-verified: **667 candidates**, a bad board skipped, 661 distinct dedupe keys.

## 🔴 Open items

1. ✅ ~~**Re-run Domain Storytelling for Story 2 — blocks Three Amigos.**~~ **DONE 2026-08-13.** Was: Iteration 01's Story 2 names one
   System Actor that _"drives session on"_ three sites; the shipped adapter fetches an API, and AD-1
   has split the actor in two. Three Amigos composes Gherkin from those diagrams, so it would compose
   from an invalidated one.
2. ✅ ~~**The browser half must be SCHEDULED, not intended.**~~ **DONE 2026-08-13 — MVP Planning
   item 5 is the schedule.** A scoped, disposable browser-automation spike answers H1 and H3;
   production 2b defers to Iteration 03 so the architecture is not committed before the hypotheses
   have an answer. The Register's validation method was rewritten too, because _"resolved at the
   Architecture Design workshop"_ is much of how Iteration 01 got this wrong.
3. ✅ ~~**Greenhouse/Lever terms of use are unread.**~~ **READ 2026-08-13 — cleared for current
   usage.** Greenhouse's Job Board API is documented public/unauthenticated and its `robots.txt`
   disallows only `/embed/`; the "spiders, robots, crawlers" clause belongs to the **My Greenhouse**
   agreement (`my.greenhouse.io`, account holders), a host we never touch. Lever's Postings API is
   officially public with `Allow: /`. Full reading in
   [`05-architecture-design.md`](05-architecture-design.md) § open items.
   🔴 **New constraint out of it:** Lever publishes `Crawl-delay: 1` and our adapter has no delay at
   all — harmless at 2 requests a night, binding as soon as AD-4 brings per-job fetching.
4. 🔄 **Two of the three designed screens need data the API does not return.** Sourcing Pass
   Outcome needs pass-level state (failures currently reach the API log only — the "tell the Job
   Seeker" deferral from Domain Storytelling, now come due), and Qualification Result needs
   per-requirement outcomes rather than a single verdict. Real input to MVP Planning, not a detail.
   **Consumed by MVP Planning 2026-08-13** — both are in the v1 cut as items 2 and 3. Still open as
   _work_, no longer open as an unanswered planning question.
5. **Greenhouse has no description on its list endpoint**, so AD-4's store implies ~570 extra requests
   per pass there. Rate limiting and politeness are undesigned.
6. ✅ ~~**Where do per-requirement qualification outcomes persist?**~~ **DECIDED 2026-08-13 (S1-3)** —
   one additive `qualification-outcomes-json @card(0..1)` on `position`, matching
   `strategy-plan.requirements-json`, which is career-coach's own row in the same schema and
   serializes the very list these outcomes map to. AD-4 is not reopened: its reasoning was multi-KB
   description blobs, not a short array. **Additive `owns` on a populated type was proven by test**
   against TypeDB 3.10.4 on a throwaway database — the root parking lot's 2026-07-31 evidence only
   covered adding a new **entity**, so this case was genuinely unproven until now.
   6a. 🔴 **NEW, and it is the platform's, not career-coach's — `TypeDbService` applies schema ONLY at
   database creation.** An existing database logs _"skipping schema init"_, so editing
   `iam.schema.typeql` changes nothing on a running stack, and recreating `iam` is barred (it mints a
   new `CAREER_COACH_PRODUCT_ID` — the 15-day outage — and destroys Positions in daily use). Every
   context sharing that database has this gap. **S1-4 builds a reusable `apply-schema` runner
   (Sprint 1 task C-0); the gap itself belongs in the root parking lot and is a Step 12 promotion
   candidate.**
7. ✅ ~~**`careerCoachUi-e2e` is a bare scaffold** — `"targets": {}`, one `example.spec.ts`. There is no
   DOM-tier Cucumber assembly for career-coach at all, so the Smoke Test mandate has no home for any
   UI change. Sprint 1 Phase A stands one up; it is work the MVP plan's sizing did not include.~~
   **Superseded by item 9 — provisioned 2026-08-13.** Kept as the record of what Phase A was for.
8. ⚠️ **The PromptOS A/B harness has no runnable script.** ADR-080 requires a prompt retrofit to go
   through a fixed battery at `REPETITIONS ≥ 3`; `npm run promptos-conformance` is the structural
   checker only, and no A/B script exists in `package.json`. Due at Sprint 1 task C-3.
9. ✅ ~~**`careerCoachUi-e2e` is a bare scaffold**~~ **PROVISIONED 2026-08-13.** Real `cucumber`
   target, world, and a `BrowseCareerCoach` ability mirroring `platform-portal/ui-e2e`; runs green
   at 0 scenarios. Deliberately **no placeholder `.feature`** — a trivially-passing scenario would
   enter docs-store's Gherkin corpus and move the Golden Thread denominators while covering nothing.
10. 🔴 **NEW — career-coach has NO CI workflow at all.** Ten workflows exist; none mentions
    career-coach, and there is a `job-search-ci.yml` for the project it superseded. The app is live,
    in daily use, and runs a nightly job against third-party APIs on locally-run gates alone.
    **PE-2: flagged, not built** — no Sprint 1 task assumes CI, and building it here is the
    Over-Provisioning anti-pattern. In the root parking lot, owned by SRE/DevOps.

## Deviations recorded

- **Workshop PR targets `dev`, not an `mvp/career-coach/02` branch** (founder decision, 2026-08-13).
  ADR-065's topology exists to accumulate a full 9-workshop planning sequence; this is a single
  workshop retrofitted into an iteration whose implementation already shipped, and every other
  Iteration 02 PR went to `dev`. Whether ADR-065 should distinguish the two cases is in the root
  parking lot.
- **The `architect` subagent was not spawned** — this session carries a standing instruction not to
  use the Agent tool unless asked; the lenses were applied directly and the founder was told before
  any decision was put to them.
- **The dependency map is between work items, not domain stories**, because Iteration 02 decomposes
  one existing story rather than adding stories.
