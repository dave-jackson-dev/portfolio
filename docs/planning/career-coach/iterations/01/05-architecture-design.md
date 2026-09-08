# Architecture Design — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Bounded-context/aggregate placement for every Domain Story, plus the inter-story dependency map
that drives sprint sequencing. Consumes [04-domain-storytelling.md](04-domain-storytelling.md)'s
8 Domain Stories and Frozen Vocabulary, and [03-user-story-map.md](03-user-story-map.md)'s 14
CC-story IDs / Sprint mapping. Architect and Developer Primary, SRE/DevOps Contributing._

---

## AD1 — Bounded context: `scope:career-coach`, a fresh build, not a migration of `scope:job-search`

> **Corrected 2026-07-24** — this decision originally called for migrating job-search's existing
> libs into `scope:career-coach` (analogous to how `apps/content` ported from `apps/blog`). The
> founder clarified that was never the intent: career-coach is an **entirely new system**, built
> fresh, with job-search continuing to run unchanged until career-coach is ready to fully supersede
> it — at which point job-search is retired/archived as a separate, later decision, not migrated
> into as part of this build. The correction below replaces the original decision; see
> [09-sprint-1-plan.md](09-sprint-1-plan.md) for the corresponding Sprint 1 Plan correction.

**Decision: new scope tag `scope:career-coach`, scaffolded fresh per root `CLAUDE.md`'s "Adding a
new Bounded Context" recipe. `job-search` is untouched — no libs renamed, no code moved.**

- New four-layer libs: `libs/career-coach/{domain,application,infrastructure,feature-list}`,
  generated fresh (`nx g @nx/js:lib` ×3, `nx g @nx/angular:lib --standalone` for feature-list),
  tagged `["scope:career-coach", "type:<layer>"]`.
- ESLint constraint added: `{ sourceTag: 'scope:career-coach', onlyDependOnLibsWithTags:
['scope:career-coach', 'scope:shared', 'scope:platform'] }` — same product-scope pattern as
  `scope:agents`/`scope:content`/`scope:freelance-portal`, entitled to import `scope:platform` at
  its application/infrastructure layers only (ADR-032 Decision 4). No dependency on
  `scope:job-search` in either direction.
- `apps/career-coach/{ui,api}` deploy as new apps, tagged `["scope:career-coach", "type:app"]`,
  reusing `platform-iam`/`api-gateway`/`shell` per the BMC's confirmed Channels decision — never
  direct DB access into `platform-iam`, only its existing API boundary.
- `job-search`'s existing libs, apps, scope tag, and its own deployed app **are not touched by this
  project at all**. job-search continues running as-is for the duration of career-coach's build.
  Job-search's existing domain code (e.g. its requirement-scoring approach) may be read as
  reference/prior-art when designing career-coach's own `StrategyPlan`/`RequirementSet` — informing
  the design without reusing the literal code or moving files.
- **Job-search's eventual retirement is out of scope for this iteration.** Once career-coach is
  built and confirmed to fully supersede job-search's capabilities, decommissioning job-search is a
  separate future decision (its own PR/phase), not a Sprint 1 or Provision Environment task.

---

## AD2 — Three aggregates in one bounded context: `StrategyPlan`, `Position`, `Application`

**Decision: not one god-aggregate, not five (one per System Actor) — three, matching where the
real invariants live.**

| Aggregate      | Owns                                                                                                                                                                                                                                  | Why its own aggregate                                                                                                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StrategyPlan` | `RequirementSet` (value object, revised in place, not a separate aggregate)                                                                                                                                                           | Has its own lifecycle (created at intake, revised independently of any Position/Application) and is read by every other aggregate, never owned by them                                                                                                                                                   |
| `Position`     | Lifecycle states: `Sourced` → `Qualified` \| `Rejected` → `Pursued`                                                                                                                                                                   | One Work Object moving through one lifecycle (Domain Storytelling Stories 2–4) — modeled as **one aggregate with a status field**, not three separate aggregates per state, following the same pattern the methodology's own worked example uses ("Equipment status changes from Available to Reserved") |
| `Application`  | Lifecycle states: `Submitted` → `Rejected` \| `PhoneScreen` → `HiringManagerSubmission` → `Interview`(s) → `FinalInterview` → `Offer` \| `NoOffer`; `InterviewPrep` and `Negotiation` as child entities, not separate aggregate roots | Outlives `Position` conceptually (a `Position` is "pursued" once; the resulting `Application`'s pipeline, interview prep, and negotiation are a distinct, longer-running lifecycle referenced by `applicationId` → `positionId`, not owned by `Position`)                                                |

**Why `InterviewPrep`/`Negotiation` are child entities of `Application`, not their own aggregates:**
neither has an invariant independent of the `Application` they belong to — `InterviewPrep` only
exists once its `Application` reaches an `InterviewStage`; `Negotiation` only exists once its
`Application` reaches `Offer`. Modeling either as a standalone aggregate root would let it be
created or modified without a valid parent `Application` state, which no domain story permits.

**`RequirementSet` is a value object inside `StrategyPlan`, not its own aggregate:** every domain
story that touches requirements (Story 1's revise, Story 3's qualify-against, Story 4's update)
always does so _through_ the `StrategyPlan` — there is no story where a `RequirementSet` is
created, read, or modified independent of its owning Plan.

**Dependency Rule check:** none of the three aggregates' domain layers may import Playwright, the
Anthropic SDK, or any other infrastructure concern directly — the five System Actors named in
Domain Storytelling (`SourcingService`, `QualificationService`, `ApplicationAutomationService`,
`InterviewPrepService`, `NegotiationService`) are **infrastructure adapters implementing domain
ports**, following this repo's existing repository-port pattern (abstract class in `domain`,
implementation in `infrastructure`) — not a new pattern:

| System Actor                   | Domain Port                 | Implements                                                                                                                       |
| ------------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `SourcingService`              | `PositionSourcingPort`      | Playwright-driven browser automation against LinkedIn/job boards/career sites                                                    |
| `QualificationService`         | `PositionQualificationPort` | Anthropic SDK-backed evaluation against `StrategyPlan`'s `RequirementSet` (reusing job-search's existing agent-pipeline pattern) |
| `ApplicationAutomationService` | `ApplicationSubmissionPort` | See AD3 below — resolution changes this from full automation to a hybrid                                                         |
| `InterviewPrepService`         | `InterviewPrepPort`         | Anthropic SDK-backed prep generation, stage-aware                                                                                |
| `NegotiationService`           | `NegotiationAssistancePort` | Anthropic SDK-backed negotiation assistance, referencing `StrategyPlan`                                                          |

All five ports live in `libs/career-coach/domain`; all five implementations live in
`libs/career-coach/infrastructure`. No new bounded context per System Actor — all three
aggregates and all five ports/adapters share one `career-coach` context, same shape job-search
already used for its single-context agent pipeline.

---

## AD3 — Resolving the automation-viability hypothesis: hybrid submission, not full automation

**Decision: `SourcingService` proceeds as designed (read-only automation). `ApplicationAutomationService`
does NOT autonomously submit applications — it prepares the application; the Job Seeker performs
the final submit action.**

This directly resolves the hypothesis the BMC, Story Map, and Domain Storytelling workshops all
flagged and deferred to this workshop:

- **Sourcing (Story 2) is lower-risk and proceeds unchanged.** Driving a browser session to _read_
  public job listings is functionally similar to a human browsing the same pages manually — no
  credentials of the target site are used, no state-changing action is taken against LinkedIn/job
  boards/career sites. Rate-limiting/CAPTCHA handling remains an open implementation concern (per
  Domain Storytelling Story 2's example scenarios) but is an engineering robustness question, not
  a viability blocker.
- **Application submission (Story 5) is higher-risk and does not proceed as originally scoped.**
  Autonomously submitting on the candidate's behalf — especially against sites like LinkedIn whose
  Terms of Service explicitly prohibit automated form submission — risks the candidate's own
  account being flagged or banned, a consequence that falls on the founder personally (this is a
  personal tool, per the BMC). That risk is not proportionate to the time saved by full automation.
- **Resolution:** `ApplicationAutomationService` prepares the application (fills form fields,
  drafts any required cover letter/answers) and presents it to the Job Seeker for a final review
  and manual submit action. Where a target site offers an official, ToS-compliant application API
  (e.g., a Greenhouse/Lever public apply endpoint some company career sites expose), the service
  may use that path for true automation — this is a per-site capability question for
  implementation, not this workshop.

**Downstream impact — flagged for founder confirmation before Three Amigos:** this changes CC-010's
story from "automate my application submission" to "prepare my application for a final review and
submit." The Story Map's story title itself is not rewritten here (Architecture Design doesn't own
Story Map wording) — this is surfaced explicitly so the founder can decide whether to amend
CC-010's title, or accept it as an implementation-level nuance of the same story. Three Amigos
(Workshop 6) needs this resolved either way, since it changes what the Gherkin scenarios describe.

**CAPTCHA/anti-bot-mitigation cost (the remaining BMC Cost Structure assumption):** now scoped
only to `SourcingService`'s read-only automation, not `ApplicationAutomationService`'s submission
step (which no longer autonomously interacts with a target site's submit action in the same way) —
narrows, but does not eliminate, that open cost question.

---

## AD4 — Inter-Story Dependency Map (drives sprint sequencing)

| Dependency                                             | Stories / CC-IDs        | Type                                                        | Why                                                                                                                                                                                |
| ------------------------------------------------------ | ----------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Story 1 → Story 3                                      | CC-001/002 → CC-005/006 | Shared aggregate must exist                                 | `Qualification Service` checks a `Sourced Position` against `StrategyPlan`'s `RequirementSet` — the Plan must exist first                                                          |
| Story 2 → Story 3                                      | CC-004 → CC-005/006     | Shared aggregate, state transition                          | A `Position` must reach `Sourced` state before it can transition to `Qualified`/`Rejected` — same aggregate, sequential states                                                     |
| Story 3 → Story 4                                      | CC-005/006 → CC-007/008 | Shared aggregate must exist                                 | Feedback (Story 4) is given on a `Qualified Position` — cannot exist before qualification produces one                                                                             |
| Story 4 → Story 3 (feedback loop, not a one-time gate) | CC-008 → CC-004/CC-005  | Event producer/consumer, cyclical                           | An updated `RequirementSet` (Story 4) must be read by the next `SourcingService`/`QualificationService` run — ongoing, not a single hard gate like the others                      |
| Story 3 → Story 5                                      | CC-005/006 → CC-009/010 | Shared aggregate, state transition                          | A `Position` must reach `Qualified` before the Job Seeker can select it as `Pursued`                                                                                               |
| Story 5 → Story 6                                      | CC-009/010 → CC-011/012 | Shared aggregate must exist                                 | An `Application` (created in Story 5) must exist before its pipeline stage can be tracked                                                                                          |
| Story 6 → Story 7                                      | CC-011/012 → CC-013     | Shared aggregate, state transition                          | `InterviewPrep` (child entity of `Application`) only exists once the `Application` reaches an `InterviewStage`                                                                     |
| Story 6 → Story 8                                      | CC-011/012 → CC-014     | Shared aggregate, state transition                          | `Negotiation` (child entity of `Application`) only exists once the `Application` reaches `Offer`                                                                                   |
| `StrategyPlan` (Story 1) → Story 8                     | CC-002 → CC-014         | Shared aggregate must exist (already satisfied by Sprint 1) | `NegotiationService` references the original `StrategyPlan` — no new gating since the Plan exists from Sprint 1 onward, but recorded for completeness                              |
| AD3's hybrid-submission decision → Story 5             | AD3 → CC-010            | Policy prerequisite                                         | `ApplicationSubmissionPort`'s hybrid design (prepare + human-submit) must be settled before Story 5 implementation begins — recorded here so Sprint Planning doesn't rediscover it |

**Cross-check against the Story Map's Sprint 1–8 order:** confirmed, **no conflicts.** Every
dependency above points from an earlier Sprint to a later one, in the exact order the Story Map
already used — the founder's own workflow ordering (Sprints 1–8, one per Activity) already matched
the real dependency shape. Unlike the developer-portal precedent, no sequencing surprise was found
here; the founder's original step ordering (Section: "I envision the following workflow") was
already dependency-correct.

---

## Carried Forward, Not Resolved Here

| Item                                                                          | Status                                                                     | Note                                                                                            |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Playwright-driven sourcing technical/legal viability                          | **Resolved by AD3** — proceeds as read-only automation                     | Removed from the open-items list going forward                                                  |
| Playwright-driven application-submission automation viability                 | **Resolved by AD3** — hybrid (prepare + human-submit), not full automation | Removed from the open-items list; downstream Story Map wording flagged for founder confirmation |
| What `ApplicationAutomationService` actually supports (e.g. document uploads) | Still open                                                                 | An implementation-phase question, now scoped to "prepare," not "submit"                         |
| What `SourcingService` actually parses on non-standard company career sites   | Still open                                                                 | An implementation-phase / per-site-adapter question                                             |
| CAPTCHA/anti-bot-mitigation cost                                              | Narrowed by AD3 to `SourcingService` only                                  | Still an open Cost Structure item, smaller in scope than originally flagged                     |

---

## Next: Three Amigos Workshop (Workshop 6)

Product Owner, Developer Primary; QA Tester Primary. Composes the actual Gherkin Features from
Domain Storytelling's example scenarios, sequenced per AD4's dependency map above — starting with
Sprint 1's `StrategyPlan` aggregate (the hard-dependency root everything else builds on), and
using AD3's hybrid-submission decision to write concrete Given/When/Then scenarios for Story 5
that reflect "prepare, then human confirms submit," not full autonomous submission.
