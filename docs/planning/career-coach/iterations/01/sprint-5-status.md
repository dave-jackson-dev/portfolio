# Sprint 5 Status — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

## Ceremonies

| Ceremony             | Status                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Sprint Planning      | ✅ Complete, founder-accepted 2026-07-25 — [sprint-5-plan.md](sprint-5-plan.md)                   |
| Daily Standup        | Logged 2026-07-25                                                                                 |
| Sprint Review        | ✅ Complete, founder-accepted 2026-07-25 — [sprint-5-review.md](sprint-5-review.md)               |
| Sprint Retrospective | ✅ Complete, founder-accepted 2026-07-25 — [sprint-5-retrospective.md](sprint-5-retrospective.md) |

## Standups

### 2026-07-25

- **Yesterday:** Sprint 4 closed (Review + Retrospective accepted, PR #538 merged to `dev` — first
  PR under ADR-064's new branch model).
- **Today:** Sprint 5 planned and committed — CC-009/010 (Apply to Positions), new `Application`
  aggregate (AD2's third), stub `IApplicationSubmissionPort`, 19 tasks (17 + 10a/15a). Implemented
  all 19 tasks via ATDD, each task's spec/scenario confirmed failing before implementation.
  131/131 unit/component tests + 35 Cucumber Scenarios (13 domain-tier, 22 HTTP-Domain) green.
  Lint (0 errors)/test/build all green across all 8 touched career-coach projects.
- **Impediments:** None. Two real defects found and fixed along the way via genuine Red-Green
  cycles — see the compliance/defect notes below.

## Task Progress (against `sprint-5-plan.md`)

| Task                                          | Status                                               |
| --------------------------------------------- | ---------------------------------------------------- |
| 1 (extend `Position` entity)                  | ✅ Green                                             |
| 2 (`Application` entity)                      | ✅ Green                                             |
| 3 (`IApplicationRepository`)                  | ✅ Green                                             |
| 4 (`IApplicationSubmissionPort`)              | ✅ Green                                             |
| 5 (domain unit tests)                         | ✅ Green — 25/25 `career-coach-domain` tests         |
| 6 (`PursuePositionCommand`/Handler)           | ✅ Green                                             |
| 7 (`PrepareApplicationCommand`/Handler)       | ✅ Green                                             |
| 8 (`SubmitApplicationCommand`/Handler)        | ✅ Green                                             |
| 9 (`GetApplicationByPositionIdQuery`/Handler) | ✅ Green                                             |
| 10 (application unit tests)                   | ✅ Green — 29/29 `career-coach-application` tests    |
| 10a (domain-tier Cucumber, Feature 5)         | ✅ Green — 13/13 Scenarios (10 existing + 3 new)     |
| 11 (`InMemoryApplicationRepository`)          | ✅ Green — 23/23 `career-coach-infrastructure` tests |
| 12 (`StubApplicationSubmissionAdapter`)       | ✅ Green                                             |
| 13 (`PositionController` pursue endpoint)     | ✅ Green                                             |
| 14 (`ApplicationController`)                  | ✅ Green                                             |
| 15 (controller smoke tests)                   | ✅ Green — 18/18 `career-coach-api` tests            |
| 15a (HTTP-Domain Cucumber)                    | ✅ Green — 22/22 Scenarios (18 existing + 4 new)     |
| 16 (`PositionFeedComponent` Pursue action)    | ✅ Green                                             |
| 17 (`ApplicationReviewComponent`)             | ✅ Green                                             |
| 18 (application-review route)                 | ✅ Green                                             |
| 19 (component smoke tests)                    | ✅ Green — 36/36 `career-coach-feature-list` tests   |

**All 19 tasks (1-19, including 10a/15a) are Green.** CC-009/010 work end-to-end: a Job Seeker
pursues a Qualified Position (single click, chaining `PursuePositionCommand` then
`PrepareApplicationCommand`), reviews the prepared Application (Full Name/Resume/Cover Letter,
AD3's hybrid-submission callout), and submits it themselves. Persistence remains in-memory. Real
Anthropic SDK-backed field/cover-letter drafting remains explicitly deferred, per
`sprint-5-plan.md`'s Sprint Goal — a deterministic stub adapter stands in, same boundary-swap
pattern as Sprints 1-4.

**Two real defects found and fixed via genuine Red-Green cycles during implementation**:

- `nx build career-coach-api` failed against the newly-added `ApplicationController` imports
  until `career-coach-application`/`-domain`/`-infrastructure` were rebuilt first — the same
  webpack-resolves-via-`dist/` gotcha already documented from Sprint 3, now hit again on a new
  aggregate's first build.
- `career-coach-api-e2e` had no per-Scenario repository reset (unlike `domain-e2e`, which got
  this exact fix in Sprint 3) — invisible for four Sprints because every prior Scenario happened
  to be idempotent-safe against the shared fixture Positions, until `Position.pursue()` became
  this suite's first non-reversible mutation and 3 previously-green Scenarios in
  `position-api.feature` started failing for real. Fixed by adding `clear()` to all three
  in-memory repositories (specs confirmed Red first) and a `Before` hook in `api-e2e`'s
  `cucumber-world.ts`, mirroring `domain-e2e`'s existing pattern.

**Compliance pass (2026-07-25)**: `node tools/compliance/run-compliance-review.mjs` — 4/8 pass
(architecture, ux, atdd\*, database; \*passed with only low findings); security/standards/
code-review/process fail, but every finding is either an already-decided deferral category from
Sprints 1-4, a diff-drift false positive (see `feedback_compliance_triple_dot_diff_drift`
memory), or empirically disproven:

- **Security (high, 2 findings)**: hardcoded `CURRENT_USER_ID` dev-fixture in both
  `PositionApiService` and the new `ApplicationApiService` — identical, already-decided Sprint 1
  deferral category (the agent scored it "high" this time vs. "low" in Sprint 4 for the same
  pattern — inconsistent severity, not a new issue).
- **Standards (high)**: flags a `fix:` commit ("add aria-label to the rejection-note input") as
  missing a preceding failing-test commit — that commit is from Sprint 4, already merged to
  `dev`/`main` before this Sprint started; diff-drift false positive (this phase branch's
  diff-vs-`main` includes Sprint 4's own history now that `dev` and `main` have been
  cross-merged under ADR-064).
- **Standards (medium, 2 findings)**: commit-message format and "Task" vs. "Item N" checklist
  labeling — same convention Sprints 1-4 also used, not a new deviation.
- **Code-review (high) — verified false positive, not fixed**: claims
  `StubApplicationSubmissionAdapter.prepare(position)` doesn't satisfy
  `IApplicationSubmissionPort.prepare(position, userId)` and would fail to compile. TypeScript
  structural typing allows an implementation with fewer parameters than an interface declares
  (callers may pass extra args the implementation ignores — the same pattern `Array.prototype.map`
  callbacks rely on) — `nx build career-coach-infrastructure`/`career-coach-api` both succeeded
  twice in this session, empirically disproving a compile error. Not fixed — there is nothing to
  fix.
- **Process (high, medium, low)**: flags a missing `checklist.md`/`summary.md`
  Measure-evidence entry and a feature file missing a "so that" hypothesis clause — all three
  apply the `phase/`+`feat/` branch convention's doc shape (and domain-tier Gherkin convention) to
  career-coach's own established `sprint-N-plan.md`/`sprint-N-status.md` convention and
  HTTP-Domain-tier feature files (which never carry the As-a/I-CAN/so-that header — that lives in
  `domain-e2e`'s Three-Amigos-sourced feature files only, e.g. `position-api.feature` doesn't have
  one either) — already-decided since Sprint 1, not a new gap.
- **ATDD (low, 6 findings)**: "I CAN"/"I CANNOT" Scenario-title naming — same pre-existing,
  systemic gap flagged in Sprints 2-4 (plus diff-drift pulling in Developer Portal's
  `manage-user-accounts.feature` findings again).
