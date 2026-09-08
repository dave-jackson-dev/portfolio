# Sprint 2 Review — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Sprint Goal (from `sprint-2-plan.md`):** CC-004's 2 Three Amigos Scenarios (Feature 2) Green,
backed by a stub `IPositionSourcingPort` — real Playwright automation explicitly deferred.

---

## Information Radiator Status

Verified genuinely Green on `main` post-merge (PR [#528](https://github.com/dave-jackson-dev/singularity/pull/528)) — not the phase branch, not mocks:

| Layer                | Evidence                                         | Result                |
| -------------------- | ------------------------------------------------ | --------------------- |
| Domain               | `nx test career-coach-domain --coverage`         | 13/13 unit tests      |
| Application          | `nx test career-coach-application --coverage`    | 11/11 unit tests      |
| Infrastructure       | `nx test career-coach-infrastructure --coverage` | 7/7 unit tests        |
| Feature (UI)         | `nx test career-coach-feature-list --coverage`   | 16/16 component tests |
| API                  | `nx test career-coach-api --coverage`            | 12/12 tests           |
| Domain-tier Cucumber | `nx run career-coach-domain-e2e:cucumber`        | 5/5 Scenarios         |
| HTTP-Domain Cucumber | `nx run career-coach-api-e2e:cucumber`           | 10/10 Scenarios       |

All 13 tasks in `sprint-2-plan.md` (including 7a, 11a) are Green.

## Story Demoed

- **CC-004 — Source Positions from LinkedIn, Job Boards, and Company Career Sites**:
  `PositionFeedComponent` shows the sourced Positions feed (id, title, company, location, salary
  range, status) with a "Source New Positions" action; `POST /positions/source` runs a sourcing
  pass via `SourcePositionsCommand`, `GET /positions` returns the feed via `ListPositionsQuery`.
  De-duplication works across sites — a posting sourced twice under two different source-side IDs
  (simulating LinkedIn vs. the company's own career site) produces exactly one `Position` record,
  matched on `dedupeKey` (normalized title/company/location), never on the source's own ID.
  Domain-tier Scenarios "Source a new Position from a job board" and "De-duplicate a Position
  found on multiple sites" — both Green.

**Accepted as Green, with an explicit scope caveat**: CC-004 as originally written in
`03-user-story-map.md` implies _real_ automated sourcing against live LinkedIn/job-board/career
sites. What's Green this Sprint is the full pipeline (domain → UI) proven correct against a stub
adapter — real Playwright-driven automation is a deliberately separate, not-yet-started piece of
work (per the founder-confirmed Sprint Goal). This is not "CC-004 fully done," it's "CC-004's
architecture and every layer around the one deferred boundary is done and proven."

## Specification Gaps Identified During Review

None new. The Sprint 1 Retrospective's action item 1 (add a Zero-Trust cross-actor scenario) was
applied here too — since `Position` has no per-user ownership dimension (unlike `StrategyPlan`),
the applicable check is production-mode unauthenticated-access rejection, not cross-user access,
and that Scenario was added to `career-coach-api-e2e` (Task 11a) proactively, not found as a gap
during this review.

## Stakeholder Feedback (Founder, verbatim from session)

- Confirmed the stub-adapter scope decision before Sprint Planning was accepted — explicit
  call to keep Sprint 2 to what's actually buildable and testable now, deferring the real
  browser-automation risk (CAPTCHA/anti-bot, ToS exposure, per-site parsing) to its own
  future, explicitly-scoped piece of work rather than attempting it live in-session.
- On the post-Sprint compliance findings: accepted both as the same already-decided categories
  from Sprint 1 (hardcoded dev-fixture auth, missing DOM-HTTP-Domain UI test) rather than
  re-opening either decision — updated the existing parking lot entry instead of filing a
  duplicate.

## Carried / Deferred (not stories — infrastructure gaps, tracked separately)

- Real Playwright-driven `PositionSourcingPort` implementation against LinkedIn/job
  boards/career sites (this Sprint's own explicit scope boundary — see Sprint Goal above)
- Real TypeDB persistence (Sprint 1's Provision Environment Pillar 2 deferral, still carried)
- Full platform-iam/api-gateway Bearer-token auth wiring (parking lot, pending)
- DOM-HTTP-Domain Cucumber/Screenplay UI smoke test, now covering `PositionFeedComponent` too
  (parking lot, `#architecture`, updated 2026-07-25)

None of the above block CC-004's committed Sprint Goal being genuinely Green — they are
follow-on infrastructure and a deliberately out-of-scope automation boundary, not unmet
acceptance criteria for what this Sprint actually committed to.
