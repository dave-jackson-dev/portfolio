# Sprint 6 Status — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

## Ceremonies

| Ceremony             | Status                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Sprint Planning      | ✅ Complete, founder-accepted 2026-07-25 — [sprint-6-plan.md](sprint-6-plan.md)                   |
| Daily Standup        | Logged 2026-07-25                                                                                 |
| Sprint Review        | ✅ Complete, founder-accepted 2026-07-25 — [sprint-6-review.md](sprint-6-review.md)               |
| Sprint Retrospective | ✅ Complete, founder-accepted 2026-07-25 — [sprint-6-retrospective.md](sprint-6-retrospective.md) |

## Standups

### 2026-07-25

- **Yesterday:** Sprint 5 closed (Review + Retrospective accepted, PR #540 merged to `dev`); a
  compliance backlog review followed, fulfilling a Sprint 3 Retrospective promise.
- **Today:** Sprint 6 (final v1 Sprint) planned and committed — CC-011/012 (Track My
  Applications), no new stub-adapter boundary (Story 6 names no System Actor), 13 tasks (11 +
  7a/10a). Implemented all 13 tasks via ATDD, each spec/scenario confirmed failing before
  implementation. 160/160 unit/component tests + 45 Cucumber Scenarios (16 domain-tier, 29
  HTTP-Domain) green. Lint (0 errors)/test/build all green across all 7 touched career-coach
  projects. Two real defects (an access-control gap, a missing smoke test) found and fixed via
  genuine Red-Green cycles during the post-Sprint compliance pass.
- **Impediments:** None.

## Task Progress (against `sprint-6-plan.md`)

| Task                                             | Status                                                |
| ------------------------------------------------ | ----------------------------------------------------- |
| 1 (extend `Application` entity)                  | ✅ Green                                              |
| 2 (domain unit tests)                            | ✅ Green — 33/33 `career-coach-domain` tests          |
| 3 (`AdvanceApplicationStageCommand`/Handler)     | ✅ Green                                              |
| 4 (`RejectApplicationCommand`/Handler)           | ✅ Green                                              |
| 5 (`IApplicationRepository.findByUserId`)        | ✅ Green                                              |
| 6 (`GetApplicationsForUserQuery`/Handler)        | ✅ Green                                              |
| 7 (application unit tests)                       | ✅ Green — 38/38 `career-coach-application` tests     |
| 7a (domain-tier Cucumber, Feature 6)             | ✅ Green — 16/16 Scenarios (13 existing + 3 new)      |
| 8 (`InMemoryApplicationRepository.findByUserId`) | ✅ Green — 25/25 `career-coach-infrastructure` tests  |
| 9 (`ApplicationController` advance/reject/list)  | ✅ Green                                              |
| 10 (controller smoke tests)                      | ✅ Green — 21/21 `career-coach-api` tests             |
| 10a (HTTP-Domain Cucumber)                       | ✅ Green — 29/29 Scenarios (22 existing + 5 + 2 more) |
| 11 (`ApplicationPipelineComponent`)              | ✅ Green                                              |
| 12 (application-pipeline route)                  | ✅ Green                                              |
| 13 (component smoke tests)                       | ✅ Green — 43/43 `career-coach-feature-list` tests    |

**All 13 tasks (1-13, including 7a/10a) are Green.** CC-011/012 work end-to-end: a Job Seeker
views their Application's current pipeline stage, advances it through AD2's full pipeline
(`Submitted` → `PhoneScreen` → `HiringManagerSubmission` → `Interview` → `FinalInterview` →
`Offer`/`NoOffer`), or rejects it from any non-terminal stage with the rejection stage recorded
(not just a generic flag). No new stub-adapter boundary this Sprint — Story 6 names no System
Actor (`04-domain-storytelling.md`), so `Application`'s existing state machine was extended
directly rather than introducing a new port. Persistence remains in-memory.

**Two real defects found and fixed via genuine Red-Green cycles during the post-Sprint compliance
pass** (not part of the original task list):

- `GET /applications/:positionId` had no ownership check — any authenticated caller could fetch
  another user's Application by its positionId, unlike every other Application endpoint
  (submit/advance-stage/reject all enforced it). Fixed by threading `userId` through
  `GetApplicationByPositionIdQuery` and returning `null` for a non-owned Application (treated
  identically to "not found," not a 403 — avoids confirming existence of another user's data on a
  read). Handler spec confirmed Red first.
- `GET /applications` (the list-all endpoint, Task 9) had no Cucumber Scenario exercising it at
  all — a real gap against CLAUDE.md's mandatory smoke-test gate. Added 2 Scenarios (caller sees
  their own list; does not see another user's Applications in it).

**Compliance pass (2026-07-25) — run twice, findings compared across runs**: the first run (before
the two fixes above) surfaced both real gaps directly; the second run (after fixing them) showed
real variance from the first — the same underlying patterns (hardcoded dev-fixture auth, missing
DOM-HTTP-Domain UI tests, commit-message format) got rescored across a **low → high → critical**
severity range for the identical `CURRENT_USER_ID` pattern across Sprints 4/5/6, and this run's
`code-review`/`process-review` agents both claimed the `pursue` endpoint has no smoke-test
coverage — empirically false: `application-api.feature`'s `@smoke`-tagged "I CAN prepare an
Application for review" Scenario dispatches `pursue` and asserts `204` directly (Task 15a,
Sprint 5). Every other finding is the same already-decided deferral category from Sprints 1-5
(hardcoded dev-fixture auth, missing DOM-HTTP-Domain UI Cucumber for `ApplicationReviewComponent`/
`ApplicationPipelineComponent`, path-param validation pipes, commit-message format, career-coach's
own `sprint-N-status.md` convention vs. the phase/`summary.md` shape) — not re-fixed, consistent
with the compliance-backlog-review-2026-07-25.md decisions. ADR-012's "no preceding test commit"
findings against this Sprint's two `fix:` commits don't apply as literally stated — both were
confirmed Red via a failing spec/scenario before the fix landed (documented in each commit
message), just not as a _separate_ `test:` commit; this is consistent with how Sprints 1-5 have
always paired spec-and-fix in one commit for defects found _during_ a Sprint's own ATDD cycle,
distinct from ADR-012's actual target (a defect in already-merged code).
