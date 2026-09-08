# Business Model Canvas — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Iteration:** 01
**Facilitator:** Product Owner (Primary)
**Feature doc:** none yet — this is the first artifact for this project; supersedes
`job-search.feature.md` (🔴 not ported from `singularity`)

> **Note on provenance:** `career-coach` supersedes `job-search` (Job Search Studio) — same core
> audience, same underlying agent-pipeline/research-automation foundation, expanded into the full
> job-search lifecycle (interview, application tracking, interview prep, negotiation). Anything
> carried over from job-search's real, already-built context is stated as fact. Anything new to
> this iteration is marked **(assumption)** and carried into the Hypothesis Register.

---

## Canvas Summary

| Building Block             | Content                                                                                                                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Customer Segments**      | Senior software engineer conducting their own job search (same segment as job-search — solo primary user, MVP)                                                                                                        |
| **Value Propositions**     | End-to-end job search coaching + automation: strategy/plan, sourcing, qualification, application, tracking, interview prep, negotiation — not just the research-automation slice job-search covered                   |
| **Channels**               | Hosted SaaS app, reusing platform-iam/api-gateway/shell (job-search's own deployment model)                                                                                                                           |
| **Customer Relationships** | Self-service; conversational/interview-style intake for the initial plan, ongoing feedback loop as roles are reviewed                                                                                                 |
| **Revenue Streams**        | No direct MVP revenue — personal tool, same as job-search. Indirect: landing a role that meets the candidate's own requirements                                                                                       |
| **Key Resources**          | job-search's existing agent pipeline, NestJS/Angular stack, PostgreSQL persistence; **(assumption)** Playwright-driven browser automation for LinkedIn/job boards/company career sites and for application submission |
| **Key Activities**         | Candidate interview/strategy intake; sourcing; qualification/refinement (≤3 passes); candidate feedback loop; application automation; status tracking; interview prep; negotiation assistance                         |
| **Key Partners**           | LinkedIn, job boards, company career sites (as automation targets, not formal partners) — **(assumption, flagged risk)** ToS/automation-risk exposure from driving these sites via Playwright, not yet resolved       |
| **Cost Structure**         | Founder's own time; marginal hosting cost (reused platform infra); **(assumption)** possible CAPTCHA-solving/anti-bot-mitigation cost if automation hits blocks                                                       |

---

## Customer Segments

**Senior Software Engineer — Job Seeker (MVP, solo).** The same segment job-search served: an
individual senior software engineer running their own job search, evaluating roles against a
personal, ordered set of hard requirements (remote status, comp, tech stack, benefits, etc.).
Carried over unchanged from job-search — no new segment introduced this iteration, per the
founder's explicit choice to keep the core audience and expand scope later.

---

## Value Propositions

> _"I can go from 'I need to find and land a new job' to an offer — with a plan I can check
> progress against and pivot on, roles sourced and qualified against my own requirements,
> applications submitted and tracked through every stage, and coaching support for interviews and
> negotiation — all in one place, instead of stitching together spreadsheets, job-board tabs, and
> ad hoc interview prep."_

This value proposition is broader than job-search's original scope (research/discovery/
qualification only). The full workflow, as described by the founder:

1. **Interview + strategy intake** — candidate requirements (job requirements, location:
   on-site/hybrid/remote, desired salary range, company size: startup/small-medium/enterprise) plus
   career-coach/recruiter best-practice questions, producing a plan usable to assess progress and
   pivot.
2. **Sourcing** — Playwright-driven sessions against LinkedIn, job boards, and company career
   pages.
3. **Qualification** — analyze each position against requirements, refined up to 3 passes.
4. **Candidate feedback loop** — present positions, capture feedback, learn new/refined
   requirements.
5. **Application automation** — for positions the candidate chooses to pursue.
6. **Application tracking** — submitted → rejected / phone screen → hiring-manager submission →
   initial interview → ... → final interview → offer / no offer.
7. **Interview prep** — for every stage from phone screening through final interview.
8. **Negotiation assistance** — once an offer is presented.

---

## Channels

Hosted SaaS app, reusing the platform composition root: `platform-iam` for auth,
`api-gateway`, and the `shell` MFE host — same integration model job-search already uses, per the
founder's choice not to reinvent auth/deployment infrastructure for a second personal tool.

---

## Customer Relationships

Self-service, single user. The relationship has two distinct modes carried from the workflow
description:

- **Upfront, interview-style intake** — a structured conversation (not a static form) that
  produces the initial plan.
- **Ongoing feedback loop** — the candidate reviews sourced/qualified positions and refines
  requirements iteratively, and later reviews application status and interview outcomes.

---

## Revenue Streams

No direct MVP revenue stream — personal tool, same as job-search. The real "revenue" this canvas
cares about is the candidate (founder) landing a role that satisfies their own requirement set.

---

## Key Resources

- job-search's existing agent pipeline (Anthropic SDK orchestrator + specialist agents), NestJS/
  CQRS domain and application layers, PostgreSQL persistence, Angular frontend — the foundation
  this project supersedes and builds on, not a rewrite from zero.
- **(assumption)** Playwright for browser automation — both for sourcing (driving LinkedIn/job
  board/career-page sessions) and for the new application-submission automation in step 5 of the
  workflow. Job-search's existing agent pipeline did not previously drive a real browser session;
  this is new infrastructure for this iteration.

---

## Key Activities

Directly enumerated from the founder's 8-step workflow: candidate intake/strategy, sourcing,
qualification/refinement, candidate feedback, application automation, status tracking, interview
prep, negotiation assistance. Distinct from job-search's original scope, which stopped at
qualification/ranking/export.

---

## Key Partners

LinkedIn, job boards, and company career sites are functionally "partners" in the sense that the
whole sourcing/application workflow depends on their sites being reachable and automatable — but
none of these are formal partnerships; they are automation targets.

**(assumption, flagged risk per founder direction)** Automating real sessions against these sites
— for sourcing and, more acutely, for submitting actual applications — carries real risk: Terms of
Service violations, account bans, CAPTCHA/anti-bot defenses, and rate-limiting. The founder chose
to flag this as an open risk for the Hypothesis Register rather than resolve it here; the
technical/legal approach (e.g. which sites support automation safely, whether application
submission automation is even viable vs. semi-automated with a human-in-the-loop click) is
deferred to the Architecture Design workshop.

---

## Cost Structure

- Founder's own development time (primary cost).
- Marginal hosting cost — near-zero, reusing already-paid-for platform infrastructure
  (platform-iam/api-gateway/shell), same as job-search.
- **(assumption)** Possible cost if CAPTCHA-solving or anti-bot mitigation services become
  necessary to keep automation viable — unvalidated, dependent on how the Key Partners risk above
  resolves.

---

## Hypothesis Register

| Assumption                                                                                                                   | Status                                                                                                | Validation Method                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Playwright-driven browser automation against LinkedIn/job boards/career sites is technically and legally viable for sourcing | ✅ **Validated 2026-08-13** — spike drove `job-boards.greenhouse.io/remotecom`                        | **Observation recorded** in `docs/planning/career-coach/iterations/02/evidence/phase-d-browser-spike-observation.md`. HTTP 200, no redirect, 225 jobs counted, first title extracted. No anti-bot challenge on the listing page. reCAPTCHA present only on the application form. The JSON API path is strictly preferable for Greenhouse (structured, stable) — the browser path's value is at sites without a JSON API (Iteration 03 `Sourcing Service` scope). |
| Playwright-driven application submission automation is technically and legally viable (vs. a human-in-the-loop submit step)  | ✅ **Resolved by decision** (AD3, 2026-07-26) — hybrid chosen, full autonomy rejected on ToS/ban risk | Resolved at the Architecture Design workshop — flagged as the higher-risk half of the automation assumption above, since it acts on the candidate's behalf rather than just reading data                                                                                                                                                                                                                                                                         |
| CAPTCHA-solving/anti-bot-mitigation cost may be needed if automation hits blocks                                             | ✅ **Validated 2026-08-13** — cost is zero for listing-page reading                                   | Observed directly by the spike (same evidence as H1). reCAPTCHA is scoped to application submission, not listing browsing. Mitigation cost becomes relevant only if application submission is automated — not planned (AD3).                                                                                                                                                                                                                                     |
| career-coach remains a personal (single-user) tool for this iteration, same as job-search                                    | Confirmed by founder this workshop                                                                    | N/A — explicit founder decision, not a hypothesis                                                                                                                                                                                                                                                                                                                                                                                                                |
| career-coach reuses platform-iam/api-gateway/shell rather than building standalone infra                                     | Confirmed by founder this workshop                                                                    | N/A — explicit founder decision, not a hypothesis                                                                                                                                                                                                                                                                                                                                                                                                                |
