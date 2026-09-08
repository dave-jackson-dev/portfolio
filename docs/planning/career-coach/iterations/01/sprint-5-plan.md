# Sprint 5 Plan — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Activity:** Apply to Positions (Story Map Sprint 5 of 6, v1 scope)
**Stories:** CC-009 — Choose Which Positions to Pursue; CC-010 — Prepare My Application for
Review and Submit

---

## Sprint Goal

By the end of this Sprint, CC-009/010's three Three Amigos Scenarios (`06-three-amigos.md`
Feature 5) are Green:

1. **Choose a Qualified Position to pursue** — a `Qualified` Position becomes `Pursued`.
2. **Prepare an Application for review** — a `Pursued` Position gets a new `Application` with
   status `Prepared`, form fields and any drafted cover letter ready for review.
3. **Submit the prepared Application myself** — a `Prepared` Application becomes `Submitted`,
   using the caller's own account.

**New aggregate this Sprint**: per AD2, `Application` is a third aggregate (alongside
`StrategyPlan`/`Position`), referenced by `applicationId` → `positionId`, not owned by `Position`.
This Sprint only needs its `Prepared`/`Submitted` states — AD2's full pipeline
(`Rejected`/`PhoneScreen`/.../`Offer`/`NoOffer`) is Sprint 6's scope.

**Explicit scope decision (AD3, already resolved before this Sprint — restated here since it's
this Sprint's own implementation, not a new decision)**: `ApplicationAutomationService` does not
autonomously submit — it prepares the application (fills fields, drafts any cover letter) and the
Job Seeker performs the final submit action. Following the same boundary-swap pattern as Sprints
1-4, real Anthropic SDK-backed field/cover-letter drafting is deferred behind a new
`IApplicationSubmissionPort`, bound to a deterministic `StubApplicationSubmissionAdapter` this
Sprint. Unlike Sprints 3/4's adapters, this stub's output isn't asserted against literal fixture
text by any Three Amigos scenario (only "fields ready for review" is asserted) — the fixture data
just needs to be present and stable, not scenario-keyed.

**UI orchestration note**: the Three Amigos Scenarios test `pursue` and `prepare` as two separate
Whens (two separate commands, `PursuePositionCommand`/`PrepareApplicationCommand` — independently
testable), but `07-ux-design.md`'s screen-flow diagram shows a single "Pursue" click landing
directly on the `Application Review: Prepared` screen. Both are true at once: the UI's Pursue
button chains the two commands (pursue, then prepare) and navigates to the new Application Review
route — no single combined domain command is introduced, keeping the aggregate boundary AD2
already drew (`Position.pursue()` and `Application.prepare()` stay independent operations).

**Zero-Trust data-ownership shape**: `Application.userId` is set from the authenticated caller at
prepare time. Submitting an Application enforces the caller is its own owner — the first story
where ownership is checked on the _target_ aggregate itself (`StrategyPlan`'s Sprint 1/3/4 checks
were always "read/revise my own Plan by userId"; this is "only I can submit an Application I
prepared").

## Task Breakdown

| #   | Task                                                                                                                                                                                                                                                 | Layer                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1   | Extend `Position` entity — add `Pursued` to `PositionStatus`; add `pursue()`, throwing unless current status is `Qualified` (AD4 state machine: `Sourced` → `Qualified`\|`Rejected` → `Pursued`)                                                     | Domain               |
| 2   | New `Application` entity — `applicationId`/`positionId`/`userId`/`status` (`Prepared`\|`Submitted`)/`fields` (`fullName`/`resume?`/`coverLetter?`); `static prepare(...)`, `submit()` throwing unless current status is `Prepared`                   | Domain               |
| 3   | `IApplicationRepository` — abstract `findById`/`save`/`findByPositionId`                                                                                                                                                                             | Domain               |
| 4   | `IApplicationSubmissionPort` — abstract `prepare(position, userId): Promise<ApplicationFields>`                                                                                                                                                      | Domain               |
| 5   | Domain unit tests — `Position.pursue()` transition rules; `Application.prepare()`/`submit()` transition rules                                                                                                                                        | Domain               |
| 6   | `PursuePositionCommand`/Handler                                                                                                                                                                                                                      | Application          |
| 7   | `PrepareApplicationCommand`/Handler — generates `applicationId` (`crypto.randomUUID()`-based), loads the `Pursued` Position, calls `IApplicationSubmissionPort.prepare`, saves                                                                       | Application          |
| 8   | `SubmitApplicationCommand`/Handler — Zero Trust: throws unless `command.userId` matches the loaded `Application.userId`                                                                                                                              | Application          |
| 9   | `GetApplicationByPositionIdQuery`/Handler                                                                                                                                                                                                            | Application          |
| 10  | Application unit tests                                                                                                                                                                                                                               | Application          |
| 10a | Domain-tier Cucumber for Three Amigos Feature 5 (3 Scenarios) — real `CommandBus`/`QueryBus`, real in-memory repositories, stub `ApplicationSubmissionPort`                                                                                          | Domain-tier Cucumber |
| 11  | `InMemoryApplicationRepository`                                                                                                                                                                                                                      | Infrastructure       |
| 12  | `StubApplicationSubmissionAdapter` — deterministic fixture fields, not scenario-keyed (no literal-text assertion exists to match)                                                                                                                    | Infrastructure       |
| 13  | `PositionController` — add `POST /positions/:positionId/pursue`, behind `RequireUserIdGuard`                                                                                                                                                         | API                  |
| 14  | New `ApplicationController` — `POST /applications` (body `{positionId}`, prepares), `GET /applications/:positionId`, `POST /applications/:applicationId/submit`, all behind `RequireUserIdGuard`, `userId` sourced only from `AuthenticatedUserId()` | API                  |
| 15  | Controller smoke tests                                                                                                                                                                                                                               | API                  |
| 15a | HTTP-Domain Cucumber — new `application-api.feature` (prepare, fetch, submit) plus a Zero-Trust Scenario ("only the Application's own owner can submit it")                                                                                          | HTTP-Domain Cucumber |
| 16  | Extend `PositionFeedComponent` — "Pursue" action on each `Qualified` row (alongside existing Approve/Reject), chaining pursue → prepare → navigate to Application Review                                                                             | Feature (UI)         |
| 17  | New `ApplicationReviewComponent` — shows `Prepared` fields (Full Name/Resume/Cover Letter) + "Submit Application" button with AD3's hybrid-submission callout, per `07-ux-design.md`'s mockup                                                        | Feature (UI)         |
| 18  | Add `application-review/:positionId` route                                                                                                                                                                                                           | Feature (UI)         |
| 19  | Component smoke tests                                                                                                                                                                                                                                | Feature (UI)         |

Persistence remains in-memory (same Provision Environment Pillar 2 deferral carried since Sprint
1, not re-litigated).

## Definition of Ready check (per `scrum-development-sprints.md`)

- [x] "I CAN" capability statements — CC-009/010 in `03-user-story-map.md`
- [x] Given-When-Then specs (pursue, prepare, submit) — `06-three-amigos.md` Feature 5
- [x] Zero Trust boundary — Task 15a's new Scenario applies this Sprint's own data-ownership
      shape (own-`Application`-only, the first Sprint checking ownership on the target aggregate
      itself rather than a related `StrategyPlan`)
- [x] Domain model references use Ubiquitous Language (`Position`, `Pursued`, `Application`,
      `Prepared`, `Submitted`, `ApplicationAutomationService`)
- [x] Golden Thread: story title "Apply to Positions" = feature name "Apply to Positions" =
      commands `PursuePositionCommand`/`PrepareApplicationCommand`/`SubmitApplicationCommand`
