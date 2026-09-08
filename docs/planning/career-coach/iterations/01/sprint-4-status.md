# Sprint 4 Status — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

## Ceremonies

| Ceremony             | Status                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Sprint Planning      | ✅ Complete, founder-accepted 2026-07-25 — [sprint-4-plan.md](sprint-4-plan.md)                   |
| Daily Standup        | Logged 2026-07-25                                                                                 |
| Sprint Review        | ✅ Complete, founder-accepted 2026-07-25 — [sprint-4-review.md](sprint-4-review.md)               |
| Sprint Retrospective | ✅ Complete, founder-accepted 2026-07-25 — [sprint-4-retrospective.md](sprint-4-retrospective.md) |

## Standups

### 2026-07-25

- **Yesterday:** Sprint 3 closed (Review + Retrospective accepted, PR #531 merged to `main`;
  founder then corrected the branch model — see ADR-064 — and PRs now target `dev`).
- **Today:** Sprint 4 planned and committed — CC-007/008 (Give Feedback & Refine Requirements),
  stub requirement-refinement adapter, 14 tasks (12 + 5a/8a). Implemented all 14 tasks (domain →
  application → domain-tier Cucumber → infrastructure → API → HTTP-Domain Cucumber → UI) via
  ATDD, each task's spec/scenario confirmed failing before implementation. 93/93 unit/component
  tests + 28 Cucumber Scenarios (10 domain-tier, 18 HTTP-Domain) green. Lint (0 errors)/test/build
  all green across all 7 touched career-coach projects.
- **Impediments:** None. Two real defects found and fixed along the way via genuine Red-Green
  cycles — see the compliance/defect notes below.

## Task Progress (against `sprint-4-plan.md`)

| Task                                               | Status                                                                                                                                      |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 (extend `Position` entity)                       | ✅ Green                                                                                                                                    |
| 2 (`IRequirementRefinementPort`)                   | ✅ Green                                                                                                                                    |
| 3 (domain unit tests)                              | ✅ Green — 20/20 `career-coach-domain` tests                                                                                                |
| 4 (`GiveFeedbackOnPositionCommand`/Handler)        | ✅ Green                                                                                                                                    |
| 5 (application unit tests)                         | ✅ Green — 19/19 `career-coach-application` tests                                                                                           |
| 5a (domain-tier Cucumber, Feature 4)               | ✅ Green — 10/10 Scenarios (8 existing + 2 new)                                                                                             |
| 6 (`StubRequirementRefinementAdapter`)             | ✅ Green — 15/15 `career-coach-infrastructure` tests                                                                                        |
| 7 (`PositionController` feedback endpoint)         | ✅ Green                                                                                                                                    |
| 8 (controller smoke tests)                         | ✅ Green — 14/14 `career-coach-api` tests                                                                                                   |
| 8a (HTTP-Domain Cucumber additions)                | ✅ Green — 18/18 Scenarios (14 existing + 4 new)                                                                                            |
| 9 (`PositionFeedComponent` Approve/Reject actions) | ✅ Green                                                                                                                                    |
| 10 (`StrategyPlanComponent` revision banner)       | ✅ Green — no component change needed; the existing generic `revisionNote` banner already displays the Position-attributed note (see below) |
| 11 (component smoke tests)                         | ✅ Green — 25/25 `career-coach-feature-list` tests                                                                                          |

**All 14 tasks (1-11, including 5a/8a) are Green.** CC-007/008 work end-to-end: a Job Seeker can
approve a Qualified Position (recorded, no requirement change) or reject one with a note, which
revises the Strategy Plan's Requirement Set via a stub `IRequirementRefinementPort` and surfaces
in the existing revision banner, now attributed to the triggering Position
(`${note} (from feedback on ${positionId})`, reusing `StrategyPlan.revisionNote` rather than
adding a new attribute — satisfies `07-ux-design.md`'s cross-reference requirement without
touching the UI layer). Persistence remains in-memory. Real Anthropic SDK-backed refinement
remains explicitly deferred, per `sprint-4-plan.md`'s Sprint Goal — a deterministic stub adapter
stands in, same boundary-swap pattern as Sprints 1-3.

**Two real defects found and fixed via genuine Red-Green cycles during implementation** (not
part of the original task list, surfaced by writing real HTTP-Domain Scenarios rather than
stopping at unit-test green):

- `GivePositionFeedbackDto` had no `class-validator` decorators, so the API's global
  `ValidationPipe` (`whitelist`/`forbidNonWhitelisted`) silently stripped the request body to
  nothing — every real feedback call 400'd. Fixed by adding `@IsBoolean()`/`@IsOptional()
@IsString()`.
- `GiveFeedbackOnPositionHandler` saved Position feedback _before_ checking the caller's
  StrategyPlan existed, unlike `QualifyPositionHandler`'s established precondition-before-mutation
  ordering — a failed rejection-with-note request could still leave a stray Feedback write on the
  shared Position. Reordered to check first, mutate second; a handler-spec assertion (confirmed
  Red before the fix) now checks no Position save happens when the precondition fails.

**Compliance pass (2026-07-25)**: `node tools/compliance/run-compliance-review.mjs` — 6/8 pass
(architecture, security\*, code-quality, ux\*, process, database; \*both passed with only
low/medium findings); standards and atdd fail, but everything found is either an already-decided
deferral category from Sprints 1-3, or a false positive from the known triple-dot diff-drift issue
(see `feedback_compliance_triple_dot_diff_drift` memory) — this phase branch's diff-vs-`main`
includes unrelated Developer Portal commits pulled in by this session's `dev`/`main` sync merges
(ADR-064), which the compliance script's diff scope can't distinguish from this Sprint's own
changes:

- **Standards (high)**: flags an ADR-012 test-first ordering issue in a _Developer Portal_ commit
  (`manage-user-accounts — account-list-reflects-a-revocation-immediately`) — not this Sprint's
  work; diff-drift false positive.
- **Standards (medium, 3 findings)**: commit-message format (`Sprint N Tasks X-Y` vs. ADR-015's
  `Phase N Item M`) — same convention Sprints 1-3 also used, not a new deviation; one finding also
  flags merge commits, an artifact of the same diff-drift issue.
- **ATDD (high)**: flags `give-feedback-refine-requirements.feature` (domain-tier) for having no
  Access Denied Scenario — Zero-Trust coverage for this feature lives in the HTTP-Domain suite
  (`career-coach-api-e2e`, Task 8a's new Scenario), consistent with Sprints 1-3's pattern of
  keeping auth-denial coverage at the HTTP layer only (domain-tier dispatches straight at
  `CommandBus`, no guards/auth concept exists there to deny) — not a new gap.
- **ATDD (low, 6 findings)**: "I CAN"/"I CANNOT" Scenario-title naming — same pre-existing,
  systemic gap flagged in Sprints 2-3 (plus, again, diff-drift pulling in Developer Portal's
  `manage-user-accounts.feature` findings that aren't this Sprint's).
- **Security (low, new)**: `PositionApiService`'s hardcoded `CURRENT_USER_ID` dev-fixture —
  identical, already-decided Sprint 1 deferral category, now also flagged for this Sprint's own
  `giveFeedback()` call site.
- **UX (medium, fixed same session)**: the rejection-note `<input>` had no accessible name —
  fixed immediately with `aria-label="Rejection note"`, re-verified Green.
- **UX (low, new)**: `PositionFeedComponent`'s outer `<div>` has no ARIA landmark role — low
  severity, consistent with `StrategyPlanComponent`/`IntakeInterviewComponent`'s existing same
  pattern; not fixed this Sprint.
- **Process (medium, 2 findings)**: flags a missing `summary.md`/Decisions table — that's the
  `phase/`+`feat/` branch convention's doc shape, not career-coach's own established
  `sprint-N-plan.md`/`sprint-N-status.md`/`sprint-N-review.md`/`sprint-N-retrospective.md`
  convention (which covers the same information); already-decided divergent convention since
  Sprint 1, not a new gap.
