# Career Coach — Iteration 01 Summary

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

| Workshop                   | Status      | Artifact                                                                                                                                                                                                                                                                                         |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. BMC                     | ✅ Complete | [01-bmc.md](01-bmc.md)                                                                                                                                                                                                                                                                           |
| 2. VPC                     | ✅ Complete | [02-vpc-job-seeker.md](02-vpc-job-seeker.md)                                                                                                                                                                                                                                                     |
| 3. Story Map               | ✅ Complete | [03-user-story-map.md](03-user-story-map.md)                                                                                                                                                                                                                                                     |
| 4. Domain Storytelling     | ✅ Complete | [04-domain-storytelling.md](04-domain-storytelling.md)                                                                                                                                                                                                                                           |
| 5. Architecture Design     | ✅ Complete | [05-architecture-design.md](05-architecture-design.md)                                                                                                                                                                                                                                           |
| 6. Three Amigos            | ✅ Complete | [06-three-amigos.md](06-three-amigos.md)                                                                                                                                                                                                                                                         |
| 7. UX Design               | ✅ Complete | [07-ux-design.md](07-ux-design.md)                                                                                                                                                                                                                                                               |
| 8. MVP Planning            | ✅ Complete | [08-mvp-plan.md](08-mvp-plan.md)                                                                                                                                                                                                                                                                 |
| 9. Sprint 1 Planning       | ✅ Complete | [09-sprint-1-plan.md](09-sprint-1-plan.md)                                                                                                                                                                                                                                                       |
| 10. Provision Environment  | ✅ Complete | [10-provision-environment.md](10-provision-environment.md)                                                                                                                                                                                                                                       |
| 11. Environment Deployment | ✅ Complete | `phase/career-coach/07-environment-deployment`, [PR #546](https://github.com/dave-jackson-dev/singularity/pull/546) — not run as a Skill, Phase 10 of `lean-agile-mvp-skills` doesn't exist yet                                                                                                  |
| 12. Architecture Workshop  | ✅ Complete | Informal, 2026-07-26 — yielded Phase 08 TypeDB Persistence Migration ([PR #548](https://github.com/dave-jackson-dev/singularity/pull/548)) and Phase 09 AI Router Integration ([PR #549](https://github.com/dave-jackson-dev/singularity/pull/549)); see the Architecture Workshop section below |
| 13. App Access pilot       | ✅ Complete | 2026-07-26, `feat/saas-license-app-access`, [PR #559](https://github.com/dave-jackson-dev/singularity/pull/559) — career-coach gated on a real Platform Ecommerce SaaS-license Purchase; see `parking-lot.md` (🔴 not ported from `singularity`)                                                              |

**All 9 planning workshops plus Provision Environment complete.** Sprint 1's Scrum Sprint
Iteration ran with `sprint-planning` and one `daily-standup` ceremony for real, and was popped at
Sprint 1's close — see the Sprint 1 paragraph below. **All 20 tasks in `09-sprint-1-plan.md` are now Green**:
CC-001–CC-003 work end-to-end (intake → build → view → revise) across domain, application,
infrastructure, API, and UI, each layer backed by real (non-mocked) tests, plus a domain-tier
Cucumber suite (`career-coach-domain-e2e`, 3/3 Scenarios) and an HTTP-Domain Cucumber suite for
the `/strategy-plan` endpoints (`career-coach-api-e2e`, 7/7 Scenarios, added post-Sprint-1 along
with an ownership-enforcing auth guard). A DOM-HTTP-Domain Cucumber suite for the UI routes
remains deliberately deferred — no live-API path exists yet for career-coach's UI (see
[sprint-1-status.md](sprint-1-status.md) and the root parking lot). **Sprint 1 is complete** (2026-07-25): Sprint Review and Retrospective both ran and were
founder-accepted ([sprint-1-review.md](sprint-1-review.md),
[sprint-1-retrospective.md](sprint-1-retrospective.md)), `stop-scrum-sprint-iteration` popped
`start-scrum-sprint-iteration` off the Skill Call Stack. All 3 committed stories (CC-001–CC-003)
verified genuinely Green on `main` post-merge — no story carried. See
[sprint-1-status.md](sprint-1-status.md) for the full session-by-session record.

**Sprint 2 is also complete** (2026-07-25, same session): CC-004 (Source Positions) shipped
end-to-end across all layers — `Position` entity, `IPositionRepository`, `IPositionSourcingPort`,
CQRS commands/queries, `PositionController`, `PositionFeedComponent` — backed by a stub
`IPositionSourcingPort` per an explicit founder-confirmed scope decision (real Playwright
automation against LinkedIn/job boards/career sites deferred to its own future work). 5/5
domain-tier + 10/10 HTTP-Domain Cucumber Scenarios, all unit/component tests green. Sprint Review
and Retrospective both founder-accepted ([sprint-2-review.md](sprint-2-review.md),
[sprint-2-retrospective.md](sprint-2-retrospective.md)); `stop-scrum-sprint-iteration` popped.
PR [#528](https://github.com/dave-jackson-dev/singularity/pull/528) merged.

**Sprint 3 is also complete** (2026-07-25, same session): CC-005/006 (Qualify Positions) shipped
end-to-end across all layers — `Position.qualify()`/`reject()` state transitions,
`IPositionQualificationPort`, `QualifyPositionCommand`/Handler, `PositionController`'s
`POST /positions/:positionId/qualify`, `PositionFeedComponent`'s Qualify action — backed by a
deterministic `StubPositionQualificationAdapter` per an explicit founder-confirmed scope decision
(real Anthropic SDK-backed evaluation deferred to its own future work, same boundary-swap pattern
as Sprints 1-2). All 14 tasks (12 + 6a/10a) Green — 8/8 domain-tier + 14/14 HTTP-Domain Cucumber
Scenarios, all unit/component tests green, re-verified live on the phase branch during Sprint
Review, not taken on developer say-so. Sprint Review and Retrospective both founder-accepted
([sprint-3-review.md](sprint-3-review.md), [sprint-3-retrospective.md](sprint-3-retrospective.md));
`stop-scrum-sprint-iteration` popped. PR [#531](https://github.com/dave-jackson-dev/singularity/pull/531)
merged to `main` 2026-07-25. **Founder directive, same session**: PRs must be opened and merged
before moving to the next Sprint, not deferred — corrected further after Sprint 3's PR merged
straight to `main`: `main` must stay PROD-only so `hot-fix/` branches can always be cut from a
known-good production state. Formalized as `ADR-064` (🔴 not ported from `singularity`)
(Accepted), generalizing Developer Portal's `dev` branch (ADR-061) into the repo-wide integration
branch for all MVP work. `dev` synced with `main` same session. Sprint 4 onward: branches cut
from `dev`, PRs target `dev`.

**Sprint 4 is also complete** (2026-07-25, same session): CC-007/008 (Give Feedback & Refine
Requirements) shipped end-to-end across all layers — `Position.giveFeedback()` (kept distinct
from the qualification-time `reject()`), `IRequirementRefinementPort`,
`GiveFeedbackOnPositionCommand`/Handler, `PositionController`'s
`POST /positions/:positionId/feedback`, `PositionFeedComponent`'s Approve/Reject actions — backed
by a deterministic `StubRequirementRefinementAdapter` per an explicit founder-confirmed scope
decision (real Anthropic SDK-backed refinement deferred, same boundary-swap pattern as Sprints
1-3). Task 10 (Strategy Plan revision banner) needed no UI change — the existing generic
`revisionNote` banner from Sprint 1 already satisfies the UX design's cross-reference requirement
once the application layer composes a Position-attributed note. All 14 tasks (12 + 5a/8a) Green —
10/10 domain-tier + 18/18 HTTP-Domain Cucumber Scenarios, 93/93 unit/component tests, all
re-verified with `--skip-nx-cache` during Sprint Review. Two real defects found and fixed via
genuine Red-Green cycles while writing Task 8a's HTTP-Domain Scenarios: `GivePositionFeedbackDto`
was missing `class-validator` decorators (the global `ValidationPipe` silently 400'd every real
call), and `GiveFeedbackOnPositionHandler` saved Position feedback before checking the caller's
StrategyPlan existed (reordered to match `QualifyPositionHandler`'s established
precondition-before-mutation pattern). Post-Sprint compliance pass: 6/8 checks pass; the 2
failures are the same already-decided deferral categories as Sprints 1-3 plus, for the first
time, a genuine false-positive instance of the known triple-dot diff-drift issue (this phase
branch's diff-vs-`main` pulled in unrelated Developer Portal commits via the session's own
`dev`/`main` sync merges) — triaged and documented, not silently accepted. One real UX finding
(missing `aria-label` on the rejection-note input) fixed immediately in-session. Sprint 4
Review/Retrospective founder-accepted
([sprint-4-review.md](sprint-4-review.md), [sprint-4-retrospective.md](sprint-4-retrospective.md));
Retrospective's action items include checking for `dev`/`main` sync drift before trusting a
compliance "high" finding, and flagging `BuildStrategyPlanCommand`'s hardcoded `planId` as a real
(currently harmless) multi-user gap.

**Sprint 5 is also complete** (2026-07-25, same session): CC-009/010 (Apply to Positions) shipped
end-to-end — `Position.pursue()` (new `Pursued` state), a new third aggregate `Application`
(`Prepared`/`Submitted` states, per AD2; full pipeline is Sprint 6's scope),
`IApplicationSubmissionPort`, `PursuePositionCommand`/`PrepareApplicationCommand`/
`SubmitApplicationCommand` handlers, the new `ApplicationController`, `PositionFeedComponent`'s
Pursue action (chains pursue + prepare, then navigates), and the new
`ApplicationReviewComponent`/`application-review/:positionId` route — backed by a deterministic
`StubApplicationSubmissionAdapter` per an explicit founder-confirmed scope decision (real
Anthropic SDK-backed field/cover-letter drafting deferred, same boundary-swap pattern as Sprints
1-4). All 19 tasks (12 + 10a/15a) Green — 13/13 domain-tier + 22/22 HTTP-Domain Cucumber
Scenarios, 131/131 unit/component tests, all re-verified with `--skip-nx-cache` during Sprint
Review. This Sprint proved the three-aggregate architecture (AD2) on its first genuinely new
aggregate since Sprint 1 — every established pattern applied without modification. Two real
defects found and fixed via genuine Red-Green cycles: the known webpack-resolves-via-`dist/`
gotcha recurring on the new `ApplicationController`'s first build, and a real cross-Scenario
state-leak in `career-coach-api-e2e` (no per-Scenario repository reset, unlike `domain-e2e` which
got this exact fix in Sprint 3 — invisible for four Sprints until `Position.pursue()` became this
suite's first non-reversible mutation and broke 3 previously-green Scenarios for real; fixed by
adding `clear()` to all three in-memory repositories plus a `Before` hook, mirroring
`domain-e2e`'s pattern). Post-Sprint compliance pass: 4/8 checks pass; every failure is either an
already-decided deferral category, a diff-drift false positive (Sprint 4's own merged `fix:`
commit reappearing under this branch's diff-vs-`main` scope), or an empirically-disproven
`code-review` agent claim (a nonexistent TypeScript compile error — verified against two
successful builds rather than trusted). Sprint 5 Review/Retrospective founder-accepted
([sprint-5-review.md](sprint-5-review.md), [sprint-5-retrospective.md](sprint-5-retrospective.md));
Retrospective's action items include actually running the long-promised low-severity compliance
backlog review at the start of Sprint 6 (flagged in Sprint 3's Retrospective, deferred twice
since), and confirming Sprint 6 extends `Application`'s existing pipeline states rather than
needing a new aggregate. PR [#540](https://github.com/dave-jackson-dev/singularity/pull/540)
merged to `dev`.

**Compliance backlog review run 2026-07-25** (fulfilling Sprint 5's Retrospective action item,
promised in Sprint 3, deferred twice) — see
[compliance-backlog-review-2026-07-25.md](compliance-backlog-review-2026-07-25.md): renamed all
31 Scenario titles across career-coach's 8 feature files to the "I CAN"/"I CANNOT" convention
(mechanical, zero regression risk, both Cucumber suites re-verified green), and explicitly
re-affirmed four other backlog items as deliberate deferrals with documented reasoning rather than
left to recur every Sprint's compliance pass.

**Sprint 6 is also complete** (2026-07-25, same session) — **the final v1 Sprint**: CC-011/012
(Track My Applications) shipped end-to-end — `Application`'s state machine extended to AD2's full
pipeline (`Submitted → PhoneScreen → HiringManagerSubmission → Interview → FinalInterview →
Offer|NoOffer`), `AdvanceApplicationStageCommand`/`RejectApplicationCommand` handlers,
`ApplicationController`'s advance-stage/reject/list endpoints, and the new
`ApplicationPipelineComponent`/`application-pipeline/:positionId` route. **No new stub-adapter
boundary this Sprint** — Domain Storytelling names no System Actor for Story 6, a genuine
architectural difference from Sprints 2-5, confirmed by reading `04-domain-storytelling.md`
directly rather than assumed from momentum. Stage advancement is self-reported by the Job Seeker
(Zero-Trust checked, same shape as Sprint 5's submit); "notification" is a UI-layer banner, not a
persisted entity — both explicit scope decisions stated in `sprint-6-plan.md` before
implementation. All 13 tasks (11 + 7a/10a) Green — 16/16 domain-tier + 29/29 HTTP-Domain Cucumber
Scenarios, 160/160 unit/component tests, all re-verified with `--skip-nx-cache` during Sprint
Review. Two real defects found and fixed via genuine Red-Green cycles during the post-Sprint
compliance pass: `GET /applications/:positionId` had no ownership check (a real broken-access-
control gap — any authenticated caller could fetch another user's Application), and
`GET /applications` had zero Cucumber coverage (a real gap against the mandatory smoke-test
standard). The compliance tool was run twice this Sprint and showed real inconsistency between
runs on identical code (severity swings with no code change, and one run's `code-review`/
`process-review` agents hallucinated a missing smoke test for an endpoint that demonstrably has
one) — findings were verified empirically rather than trusted at face value. Sprint 6
Review/Retrospective founder-accepted
([sprint-6-review.md](sprint-6-review.md), [sprint-6-retrospective.md](sprint-6-retrospective.md));
Retrospective's action items include walking the full v1 golden path end-to-end in one continuous
session before any launch-readiness claim (each Sprint verified its own slice, never the whole
journey at once), and treating compliance-tool findings as evidence to verify rather than
conclusions to act on directly (the third consecutive Sprint to independently reach this
conclusion). Next: open + merge Sprint 6's phase PR to `dev`. **With Sprint 6 Green, all of
v1's scope (Sprints 1-6, CC-001–CC-012) is complete** — Sprints 7-8 (Interview Prep, Negotiation)
remain deferred to Release 2 per the MVP Planning workshop's original cut. Environment Deployment
is the next stage in the Lean-Agile MVP Skills hierarchy once the founder confirms readiness — not
yet built as a Skill as of the current `lean-agile-mvp-skills` phase.

**Environment Deployment is also now complete** (2026-07-26, `phase/career-coach/07-environment-
deployment`, [PR #546](https://github.com/dave-jackson-dev/singularity/pull/546) merged to `dev`):
career-coach-api/career-coach-ui joined the platform Docker stack, mirroring job-search's
`saas-platform-consolidation` Phase 02+03 pattern — Sprint 1's `RequireUserIdGuard` stopgap
replaced with real `BearerTokenAuthGuard`/`AuthenticatedGuard` (IAM-backed), a new
`CareerCoachAuthController`/`CareerCoachProxyController` in api-gateway, careerCoachUi federated
into shell at `/career-coach` with a real `AuthService`/`authGuard`/`authInterceptor`, and a new
`docker-compose.career-coach.yaml`. Two founder-confirmed scope decisions were carried forward
rather than resolved here — persistence stays in-memory, and the four stub adapters (sourcing/
qualification/refinement/submission) are untouched — both explicitly deferred to a dedicated
**Architecture Workshop**.

**Architecture Workshop held 2026-07-26** (informal — not `start-architecture-design-workshop`,
which is scoped to confirming bounded-context placement for domain stories already in
`04-domain-storytelling.md`; this session's two topics were both implementation-level follow-ups
from Environment Deployment, not new domain stories). Two real decisions made, researched against
this repo's actual existing patterns rather than assumed:

1. **Persistence: TypeDB for all three aggregates, not CouchDB for everything.** Every other
   `platform-*` bounded context (organization/people/things/notes/etc.) already uses TypeDB via
   the shared `TypeDbService`/`iam` database — CouchDB appears exactly once in this repo as a
   repository backend (`platform-chat`'s `NouveauContentSearchAdapter`, full-text search only, no
   shared lib). `Position` also has no job-description text field yet, so "Job Description search"
   — the founder's original reasoning for CouchDB — isn't a capability that exists to build search
   over. Decision: TypeDB now (consistent with the platform, and it models the
   StrategyPlan↔Position↔Application relations naturally); CouchDB+Nouveau stays reserved for a
   _future_ full-text search story, added only once Position gains a description field, mirroring
   `NouveauContentSearchAdapter`'s exact pattern rather than inventing a new one.
2. **AI Router: wire all 3 LLM-backed stub adapters now** (qualification, requirement refinement,
   application submission) — `IPositionSourcingPort` stays a stub, since its real implementation
   is Playwright browser automation, not an LLM call, and remains separately-scoped undiagnosed
   work (CAPTCHA/anti-bot handling, per Architecture Design's Open Items).

Also raised and resolved at the start of this session: the founder wants **User Sign-Up**
implemented, but it traces to no existing domain story and would reopen the BMC's single-user
scope decision — deferred to a future iteration rather than folded into this workshop (see
`docs/planning/career-coach/parking-lot.md`'s Future Iteration Scope section).

**Phase 08 — TypeDB Persistence Migration** (`phase/career-coach/08-typedb-persistence-migration`):
implements Decision 1 above. `StrategyPlan`/`Position`/`Application` entity types added to the
shared `iam.schema.typeql` (career-coach reuses `TypeDbService`/the `iam` database, same as every
other `platform-*` context — no new Docker service). `TypeDbStrategyPlanRepository`/
`TypeDbPositionRepository`/`TypeDbApplicationRepository` replace the in-memory bindings in
`CareerCoachInfrastructureModule` (the in-memory classes are kept, unwired, matching
`platform-things`' own precedent of retaining a superseded in-memory implementation rather than
deleting it). `RequirementSet.requirements` is stored as a `requirements-json` blob attribute
(same idiom as `oidc-model-record.payload-json`) since nothing queries into individual
requirements. `Position`/`Application` have no domain-layer `reconstitute()` (only state-transition
methods), so their repositories rebuild an equivalent instance by replaying the stored status
through those same transitions — verified correct via both Cucumber suites, not just unit tests.
`career-coach-api-e2e`'s cucumber-world.ts now starts a real `typedb/typedb:3.10.4` testcontainer
for the whole suite (one container, unique db name, mirroring `iam-e2e`'s Jest pattern) rather than
per Scenario; per-Scenario isolation still comes from a `clear()` method on each repository, now
issuing a real `delete $x;` TypeQL query instead of a `Map.clear()`. Found and fixed live: the
Cucumber suite's `tsconfig.cucumber.json` hardcoded a 3-entry `paths` map (career-coach's own
libs only) rather than extending `tsconfig.base.json`, so it couldn't resolve
`@singularity/platform-iam-infrastructure` at ts-node runtime — fixed by extending the base
tsconfig instead of hand-listing every transitively-needed alias (a real gap only surfaced once
this project's own infra module gained a cross-`scope:platform` dependency for the first time).
Both Cucumber suites re-verified live: 29/29 HTTP-Domain (against the real testcontainer, not
mocked), 16/16 domain-tier (unaffected — `domain-e2e` uses its own inline in-memory repos,
independent of `CareerCoachInfrastructureModule`). `docker-compose.career-coach.yaml` gets the
same `TYPEDB_*` env vars as `docker-compose.freelance-portal.yaml`, joining the existing
`iam-typedb` service rather than a new one. Lint/test/build all green across every touched
project (`career-coach-infrastructure`, `career-coach-api`, `career-coach-api-e2e`, `careerCoachUi`,
`platform-iam-infrastructure`).

**Real operational gotcha found, not yet hit but flagged**: `TypeDbService.onModuleInit` only runs
`applySchema()` against a _freshly created_ database — if the shared `iam` TypeDB database already
exists (e.g. a developer's local Docker volume from prior work), adding new entity types to
`iam.schema.typeql` does **not** auto-apply to it; every prior schema addition (person/thing/
notification/etc.) carried this same pre-existing limitation. No incident yet since this repo's
dev/CI TypeDB volumes get recreated often, but worth remembering before assuming a schema change
"just works" against a long-lived local stack. Phase 08 merged to `dev` via
[PR #548](https://github.com/dave-jackson-dev/singularity/pull/548), 2026-07-26.

**Phase 09 — AI Router Integration** (`phase/career-coach/09-ai-router-integration`, same session):
implements the Architecture Workshop's second decision. `AiRuntimePositionQualificationAdapter`/
`AiRuntimeRequirementRefinementAdapter`/`AiRuntimeApplicationSubmissionAdapter` replace the stub
bindings for `IPositionQualificationPort`/`IRequirementRefinementPort`/
`IApplicationSubmissionPort` in `CareerCoachInfrastructureModule` — same pattern as job-search's
`JobQualificationService`/`JobSearchAiRuntimeAdapter` (system prompt + JSON-in-JSON-out over
`AiRuntimeService.execute()`, `requiredCapabilities: ['structuredOutput']`). `IPositionSourcingPort`
stays a stub, unchanged — its production form is Playwright browser automation, not an LLM call.
Three new system prompts added under `agents/apps/career-coach/` (position-qualification,
requirement-refinement, application-submission). `AiRuntimeApplicationSubmissionAdapter.prepare()`
only has the AI draft the cover letter — `fullName` is derived from `userId` (best-effort,
title-cased email local part) rather than looked up from a real user profile, since career-coach
has none yet (User Sign-Up was deferred this same session); `resume` stays unset rather than
carrying the stub's fake `resume.pdf` placeholder. `career-coach-api`'s `app.module.ts` gained
`ConfigModule.forRoot({ isGlobal: true })` (needed by the new adapters' `ConfigService` injection,
mirroring job-search-api's identical wiring) — a real gap, since nothing in career-coach needed
`ConfigService` before this phase.

**A real design question surfaced and resolved before running the e2e suite**: wiring the real
`AiRuntimeService` into `career-coach-api-e2e`'s existing Cucumber suite would have made its
Three-Amigos-authored Scenarios — which assert _exact_ qualification verdicts/reasons and
requirement-refinement outcomes matching the old stub adapters precisely — depend on live,
non-deterministic LLM output on every run. Founder-confirmed: added a `TestAiRuntimeService` test
double in `cucumber-world.ts` (same reasoning as the existing `TestBearerTokenAuthGuard` — this
suite tests career-coach's own HTTP/domain wiring, not the AI Router's behavior, which has its own
test suite), reproducing the retired stub adapters' exact fixture mapping so all three real
adapters are still exercised end-to-end with only the AI Router call itself stubbed. A real bug
was caught by this exercise: `AiRuntimePositionQualificationAdapter`'s first draft never included
`positionId` in the payload sent to the AI Router, so the double's fixture lookup (and, in
production, nothing — a real LLM call wouldn't need `positionId` at all, but the test double did)
missed on every Position — 14/29 Scenarios failed until fixed. Also found: two stray, real Nx
cache issues — a `TS6059`/`TS6307` rootDir build failure (fixed by `npx nx reset`, same class as
the 2026-07-17 lessons-learned entry) and a batch of stray `.d.ts` files an earlier anomalous `tsc`
invocation left inside `libs/core/ai-runtime/{domain,infrastructure}/src/**` (cleaned with
`git clean -f`, never committed). Both Cucumber suites re-verified live after all fixes: 29/29
HTTP-Domain (against the real AI Router adapters + `TestAiRuntimeService` double + the real TypeDB
testcontainer from Phase 08), 16/16 domain-tier (unaffected). Lint/test/build all green across
every touched project.

**Note on this session's provider config**: `AI_ROUTER_ALLOWED_PROVIDERS=cerebras,lm-studio`
locally — Anthropic is currently _not_ in the allowed-providers list, so
`CAREER_COACH_AI_DEFAULT_MODEL_ID` should be set to a Cerebras/LM Studio model id (not this
adapter's hardcoded `claude-opus-4-8` fallback) before any real live-provider smoke test against
this env, or the router will fail closed with `provider_restricted`.

## Decisions

| Decision                                                                                                                                                                                                                                                   | Workshop                        | Notes                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| career-coach supersedes job-search, same core audience (solo senior SWE job seeker), scope expanded later                                                                                                                                                  | BMC                             | Founder's explicit direction at project kickoff                                                                                                                                                                                                       |
| Personal (single-user) tool for this iteration, no revenue stream                                                                                                                                                                                          | BMC                             | Confirmed by founder                                                                                                                                                                                                                                  |
| Reuse platform-iam/api-gateway/shell rather than standalone infra                                                                                                                                                                                          | BMC                             | Confirmed by founder                                                                                                                                                                                                                                  |
| New `scope:career-coach` bounded context, scaffolded fresh — **not** a migration of job-search's libs                                                                                                                                                      | Architecture Design             | AD1; **corrected 2026-07-24** — originally called for migrating job-search's libs in, which the founder clarified was never the intent                                                                                                                |
| Three aggregates: `StrategyPlan`, `Position`, `Application` (InterviewPrep/Negotiation as child entities)                                                                                                                                                  | Architecture Design             | AD2                                                                                                                                                                                                                                                   |
| Application submission is hybrid (system prepares, Job Seeker submits), not fully autonomous — CC-010 story updated                                                                                                                                        | Architecture Design             | AD3; confirmed by founder 2026-07-24                                                                                                                                                                                                                  |
| v1 ships Sprints 1-6 (12 stories); Sprints 7-8 (Interview Prep, Negotiation) deferred                                                                                                                                                                      | MVP Planning                    | Cut point is the first natural dependency break, not a naive gain-level cut; no Hypothesis Register entry stranded                                                                                                                                    |
| Sprint 1 is a genuine fresh build (scaffold new libs/apps); job-search's code is reference-only, not migrated                                                                                                                                              | Sprint 1 Planning               | **Corrected 2026-07-24** — job-search continues running unchanged; its eventual retirement (once career-coach fully supersedes it) is a separate future decision                                                                                      |
| Existing `requirements-form` component is not reused for career-coach's Intake Interview or Strategy Plan screens                                                                                                                                          | Sprint 1 Planning               | Confirmed by founder 2026-07-24; unaffected by the migration-vs-fresh-build correction — job-search's own form is untouched either way                                                                                                                |
| Fresh scaffold provisioned: 6 new projects + career-coach-domain-e2e (Cucumber mechanism only); CI confirmed inactive; phase branch cut with Phase A already committed                                                                                     | Provision Environment           | Founder-accepted; 3 Nx generator tsconfig gaps found and fixed (2 documented, 1 new — flag for lessons-learned)                                                                                                                                       |
| StrategyPlanController endpoints get a lightweight `X-User-Id`-header auth guard (dev-fallback outside production), not full platform-iam/api-gateway Bearer-token wiring                                                                                  | Sprint 1 (post-close)           | Founder-confirmed 2026-07-24; full IAM integration deferred to the phase that puts career-coach-api behind api-gateway — same treatment as in-memory persistence                                                                                      |
| A true DOM-HTTP-Domain Cucumber/Screenplay smoke test for the UI routes is deferred, not built with a workaround (e.g. a one-off standalone proxy config)                                                                                                  | Sprint 1 (post-close)           | Founder-confirmed 2026-07-24; no live-API path exists yet for career-coach's UI (no api-gateway wiring, no docker-compose service); tracked in the root parking lot                                                                                   |
| CC-004 (Source Positions) ships behind a stub `IPositionSourcingPort`, not real Playwright automation against LinkedIn/job boards/career sites                                                                                                             | Sprint 2 Planning               | Founder-confirmed 2026-07-25; same boundary-swap pattern as Sprint 1's in-memory persistence — CAPTCHA/anti-bot handling and per-site parsing remain unresolved per Architecture Design's Open Items, real automation deferred to its own future work |
| Persistence stays in-memory through Environment Deployment; a real DB engine decision is deferred to a dedicated Architecture Workshop                                                                                                                     | Environment Deployment          | Founder-confirmed 2026-07-26; CouchDB with Full-Text Search is the founder's leading candidate, for Job Description search                                                                                                                            |
| AI Router plumbing not wired into career-coach-api in Environment Deployment; all four stub adapters (sourcing/qualification/refinement/submission) untouched, revisited at the same Architecture Workshop                                                 | Environment Deployment          | Founder-confirmed 2026-07-26; career-coach should never depend on a single AI provider — route through the platform AI Router when these go real                                                                                                      |
| Persistence moves to TypeDB (all three aggregates), not CouchDB — matches every other `platform-*` context; CouchDB+Nouveau reserved for a future full-text Job Description search story once `Position` gains a description field                         | Architecture Workshop           | Founder-confirmed 2026-07-26; superseded the Environment Deployment row above's open DB-engine question                                                                                                                                               |
| All 3 LLM-backed stub adapters (qualification, requirement refinement, application submission) get wired to the real platform AI Router this session; `IPositionSourcingPort` stays a stub (its production form is Playwright automation, not an LLM call) | Architecture Workshop           | Founder-confirmed 2026-07-26                                                                                                                                                                                                                          |
| User Sign-Up deferred to a future iteration, not folded into this workshop                                                                                                                                                                                 | Architecture Workshop           | Founder-confirmed 2026-07-26; traces to no existing domain story and would reopen the BMC's single-user scope decision — see parking-lot.md                                                                                                           |
| `career-coach-api-e2e`'s Cucumber suite gets a `TestAiRuntimeService` double instead of hitting the real AI Router                                                                                                                                         | Architecture Workshop, Phase 09 | Same reasoning as the existing `TestBearerTokenAuthGuard` double — keeps existing exact-outcome Scenario assertions deterministic and the suite free of live external calls                                                                           |
| `AiRuntimeApplicationSubmissionAdapter` derives `fullName` from `userId` rather than a real user-profile lookup; `resume` stays unset (no fake filename)                                                                                                   | Phase 09                        | career-coach has no user-profile store yet (User Sign-Up deferred, same session); a name is not something to ask an LLM to fabricate                                                                                                                  |

## Open Questions

- What does `ApplicationAutomationService` actually support (e.g. document uploads)? Implementation-phase question, scoped to "prepare" not "submit" per AD3.
- What does `SourcingService` actually parse on non-standard company career sites? Implementation-phase / per-site-adapter question.
- CAPTCHA/anti-bot-mitigation cost — narrowed by AD3 to `SourcingService` only, still open — this
  is also why `IPositionSourcingPort` stayed a stub through the Architecture Workshop's AI Router
  wiring (Phase 09), unlike the other three ports.
- User Sign-Up: when picked up in a future iteration, start from Story Mapping/Domain Storytelling
  (not Architecture Design) and revisit the BMC's single-user Customer Segment decision explicitly.
- `AiRuntimeApplicationSubmissionAdapter`'s `fullName` derivation (from `userId`) is a placeholder
  until a real user-profile mechanism exists — revisit once User Sign-Up (or any profile store) is
  built in a future iteration.

---

## Iteration 01 Close (2026-08-12)

**Closed via `/stop-mvp-iteration career-coach 01`.** Founder decision, taken at Session Start:
v1 shipped, so the iteration is over; whatever comes next is Iteration 02.

### Stage completeness — passes

All 34 stage state files under `.state/` report `"complete"`. None `escalated`, none missing.
Environment Deployment has no state file **by design, with a stated reason** — it was run as a
regular phase branch ([PR #546](https://github.com/dave-jackson-dev/singularity/pull/546)), not as
a Skill, because Phase 10 of `lean-agile-mvp-skills` does not exist yet. That is a documented
absence, not a silent gap.

### 🔴 Objective evaluation — this iteration did NOT fully achieve its objective, and closes with that on record

Every stage closed. That proves the **process** ran to completion; it does not prove the iteration
**accomplished** what it set out to. Checked against `01-bmc.md`'s Hypothesis Register and
`08-mvp-plan.md`'s reconciliation, three real gaps stand:

**1 — Three of four testable hypotheses are still unvalidated, and `08-mvp-plan.md` claims otherwise.**
That doc's reconciliation asserts _"Every hypothesis this iteration's workshops raised is exercised
by a story already in the v1 cut"_ — true of the **stories**, false of the **hypotheses**:

| Hypothesis                                               | v1 claim                                               | Actual outcome                                                                                                                                |
| -------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Playwright-driven sourcing is technically/legally viable | "exercised the first time Sourcing runs for real"      | ❌ **Never exercised.** `IPositionSourcingPort` is still bound to `StubPositionSourcingAdapter` — verified on disk 2026-08-12                 |
| CAPTCHA/anti-bot-mitigation cost                         | "observed as a byproduct of CC-004 running in v1"      | ❌ **Never observed** — same stub; there is no real automation to hit a block                                                                 |
| Application-submission automation (hybrid) is viable     | "exercised the first time an Application is submitted" | ❌ **Never exercised against a real session.** The architecture is real; the round-trip was never run — see the parking lot's live-stack note |
| Pain/Gain ratings self-assessed, not validated           | Explicitly out of scope this iteration                 | ✅ Correctly scoped out — one candidate by design                                                                                             |

The pattern is worth naming, because it will recur: **a hypothesis whose validation method is
"it gets exercised when the story ships" is not validated by the story shipping behind a stub.**
The boundary-swap pattern that made Sprints 1-5 fast is the same pattern that deferred the
validation — those are two faces of one decision, and only one of them was tracked.

**2 — The BMC's Value Proposition is not deliverable to a real user today.** The promise was
_"roles sourced and qualified against my own requirements."_ Sourcing returns fixture data. The
qualification half is real (AI Router, Phase 09); the sourcing half is not.

**3 — Sprint 6's Action Item 1 was never done, and is currently blocked.** It reads: _"Before
declaring v1 fully done… run one continuous walkthrough of the full golden path."_ No session ever
ran it. It cannot be run right now: `CAREER_COACH_PRODUCT_ID` is unset, so `SaasLicenseGuard`
403s every request to `CareerCoachProxyController` — see the parking lot's Defects section.

### What this close does and does not claim

It claims: **the process completed, and all 12 v1 stories are Green at the slice level.**
It does not claim: **that the automation-risk hypotheses this project was built on have been
tested.** That remains open, carried into Iteration 02.

### Post-close, same session: gap 3 was closed and gap 2 partly answered

The three gaps above were written before the rest of 2026-08-12's work ran. Updating them honestly
rather than leaving the close reading worse than reality:

- ✅ **Gap 3 — Sprint 6's Action Item 1 is DONE.** The golden path was walked end to end in one
  continuous run, 18 days after the action item was written: **20/20 steps green**, real
  Authorization Code + PKCE login as a single Job Seeker persona, intake → build plan → source →
  qualify → feedback → pursue → apply → track, finishing at `status=Offer`. Step 7 went through
  the **real AI Router** (not a stub) and returned `Qualified`, so Phase 09's LLM path is
  live-verified too — something no prior session had shown.
- 🟡 **Gap 2 — the Value Proposition is now deliverable except for sourcing.** Every stage of the
  golden path works for a real user against the real stack. What is still fixture-backed is
  Position sourcing itself, so "roles **sourced** and qualified against my own requirements" is
  half real: qualification is genuine, sourcing returns the same three fixtures.
- ❌ **Gap 1 — unchanged.** The automation-risk hypotheses are still untested, and cannot be tested
  until `IPositionSourcingPort` has a real implementation.

**Two defects the walkthrough itself surfaced**, both recorded in
`parking-lot.md` (🔴 not ported from `singularity`): domain rule violations returned `500` with the message
swallowed (**fixed**, now `409` with the reason intact), and the golden path is **single-use per
environment** because sourcing dedups against a fixed fixture set (**open** — the next person to
attempt a walkthrough hits it immediately).

**Carried forward into Iteration 02:** gap 1 in full, the fixture trap, and the Open Questions
section preceding this one. `CAREER_COACH_PRODUCT_ID` is seeded and Career Coach is reachable, so
that is no longer the blocker it was at close time.
