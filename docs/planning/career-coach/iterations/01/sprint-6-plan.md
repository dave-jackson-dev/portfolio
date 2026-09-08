# Sprint 6 Plan — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Activity:** Track My Applications (Story Map Sprint 6 of 6 — final v1 Sprint)
**Stories:** CC-011 — View My Application Status Across the Full Pipeline; CC-012 — Receive an
Update When an Application's Status Changes

---

## Sprint Goal

By the end of this Sprint, CC-011/012's three Three Amigos Scenarios (`06-three-amigos.md`
Feature 6) are Green:

1. **View the Application's current pipeline stage** — a `Submitted` Application's stage is
   visible on the Application Pipeline screen.
2. **Application advances to PhoneScreen** — an Application's stage advances, and the Job Seeker
   is notified of the change.
3. **Application is rejected directly from Submitted** — an Application can be rejected from any
   non-terminal stage, and the Pipeline records _which_ stage the rejection happened at, not just
   a generic "rejected" flag.

**No new stub-adapter boundary this Sprint — a genuine architectural difference from Sprints
2-5.** `04-domain-storytelling.md` Story 6 names no System Actor for this story (unlike Stories
2-5's `SourcingService`/`QualificationService`/`RequirementRefinementService`/
`ApplicationAutomationService`) — the Application entity itself "moves through" the Pipeline, and
the Pipeline "notifies" the Job Seeker, both pure domain state changes with no external
integration to defer behind a port. This Sprint extends `Application`'s existing state machine
(AD2: `Submitted` → `Rejected`|`PhoneScreen` → `HiringManagerSubmission` → `Interview` →
`FinalInterview` → `Offer`|`NoOffer`) rather than introducing a new aggregate or adapter.

**Scope decision on stage-advancement authorship**: no System Actor was named for this story, and
career-coach is a personal single-user tool with no real employer/ATS integration built (or
planned as in-scope infrastructure). This Sprint's `AdvanceApplicationStageCommand`/
`RejectApplicationCommand` are exposed as Zero-Trust-checked endpoints the Job Seeker calls
themselves (self-reported tracking, e.g. after checking their email) — not a fabricated
employer-webhook integration. The Three Amigos Scenario's "When Acme Cloud advances..." phrasing
is domain narrative language for the state transition, not a literal distinct authenticated actor.

**"Notification" scope decision**: no Notification aggregate/port exists anywhere in this
codebase's domain model, and Domain Storytelling names no System Actor for it either. "I receive
an update notifying me of the change" is satisfied at the UI layer — a banner shown when the
Application Pipeline screen loads and the fetched stage differs from what was last seen — not a
persisted notification record or a push/email mechanism. Real notification delivery (email, push)
is out of MVP scope entirely, not merely deferred behind a stub port.

## Task Breakdown

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                                                                         | Layer                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1   | Extend `Application` entity — expand `ApplicationStatus` to the full AD2 pipeline (`Prepared`\|`Submitted`\|`Rejected`\|`PhoneScreen`\|`HiringManagerSubmission`\|`Interview`\|`FinalInterview`\|`Offer`\|`NoOffer`); add `rejectedAtStage?: ApplicationStatus`; add `advanceStage(stage)` (forward-only through the ordered pipeline, throws from a terminal stage) and `reject()` (from any non-terminal stage, records `rejectedAtStage`) | Domain               |
| 2   | Domain unit tests — `advanceStage()`/`reject()` transition rules                                                                                                                                                                                                                                                                                                                                                                             | Domain               |
| 3   | `AdvanceApplicationStageCommand`/Handler — Zero Trust: only the Application's own owner may advance it                                                                                                                                                                                                                                                                                                                                       | Application          |
| 4   | `RejectApplicationCommand`/Handler — same Zero-Trust ownership check                                                                                                                                                                                                                                                                                                                                                                         | Application          |
| 5   | Extend `IApplicationRepository` — add `findByUserId(userId): Promise<Application[]>` for the Pipeline screen's "Other Applications" list                                                                                                                                                                                                                                                                                                     | Domain               |
| 6   | `GetApplicationsForUserQuery`/Handler                                                                                                                                                                                                                                                                                                                                                                                                        | Application          |
| 7   | Application unit tests                                                                                                                                                                                                                                                                                                                                                                                                                       | Application          |
| 7a  | Domain-tier Cucumber for Three Amigos Feature 6 (3 Scenarios) — real `CommandBus`/`QueryBus`, real in-memory repositories, no stub adapter needed                                                                                                                                                                                                                                                                                            | Domain-tier Cucumber |
| 8   | Extend `InMemoryApplicationRepository` — add `findByUserId`                                                                                                                                                                                                                                                                                                                                                                                  | Infrastructure       |
| 9   | Extend `ApplicationController` — `POST /applications/:applicationId/advance-stage` (body `{stage}`), `POST /applications/:applicationId/reject`, `GET /applications` (list for caller), all behind `RequireUserIdGuard`                                                                                                                                                                                                                      | API                  |
| 10  | Controller smoke tests                                                                                                                                                                                                                                                                                                                                                                                                                       | API                  |
| 10a | HTTP-Domain Cucumber additions to `application-api.feature` — the 3 Scenarios plus a Zero-Trust Scenario ("only the Application's own owner can advance/reject it")                                                                                                                                                                                                                                                                          | HTTP-Domain Cucumber |
| 11  | New `ApplicationPipelineComponent` — stage tracker for the routed Application, a notification banner when the stage differs from last seen, an "Other Applications" list, per `07-ux-design.md`'s mockup                                                                                                                                                                                                                                     | Feature (UI)         |
| 12  | Add `application-pipeline/:applicationId` route                                                                                                                                                                                                                                                                                                                                                                                              | Feature (UI)         |
| 13  | Component smoke tests                                                                                                                                                                                                                                                                                                                                                                                                                        | Feature (UI)         |

No repository extension needed beyond `findByUserId` (Task 5/8) — `IApplicationRepository.findById`/
`.save` (Sprint 5) already cover single-Application mutation. Persistence remains in-memory (same
Provision Environment Pillar 2 deferral carried since Sprint 1, not re-litigated).

## Definition of Ready check (per `scrum-development-sprints.md`)

- [x] "I CAN" capability statements — CC-011/012 in `03-user-story-map.md`
- [x] Given-When-Then specs (view stage, advance + notify, reject-at-stage) —
      `06-three-amigos.md` Feature 6
- [x] Zero Trust boundary — Task 10a's new Scenario applies this Sprint's own data-ownership
      shape (own-`Application`-only, same shape Sprint 5 used for submit)
- [x] Domain model references use Ubiquitous Language (`Application`, `Application Pipeline`,
      `PhoneScreen`, `HiringManagerSubmission`, `Interview`, `FinalInterview`, `Offer`, `NoOffer`)
- [x] Golden Thread: story title "Track My Applications" = feature name "Track My Applications" =
      commands `AdvanceApplicationStageCommand`/`RejectApplicationCommand`
