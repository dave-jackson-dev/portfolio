# User Story Map — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Story titles only ("I CAN" format) — no acceptance criteria or Gherkin here. Example scenarios are
Workshop 4 (Domain Storytelling)'s job; complete Gherkin Features are Workshop 6 (Three Amigos)'s
— both run after Workshop 5 (Architecture Design)._

**Segment:** Senior Software Engineer — Job Seeker (the only Customer Segment named in
[01-bmc.md](01-bmc.md) and [02-vpc-job-seeker.md](02-vpc-job-seeker.md)).

**Source input:** the single Value Proposition Canvas —
[02-vpc-job-seeker.md](02-vpc-job-seeker.md) — every story below traces to a named Pain Reliever
or Gain Creator there. No floating stories.

---

## Sprint-to-Activity Mapping — reasoning

This map uses a **1:1 Sprint-to-Activity mapping**, matching the founder's own 8-step workflow
order from the BMC/VPC Value Propositions exactly — each of the 8 workflow steps becomes one
Activity and one Sprint, in the same sequence the founder specified it. No activity is split or
merged, since the founder's own ordering is already the dependency order: a plan must exist before
sourcing has requirements to qualify against; qualified positions must exist before the candidate
can give feedback on them; pursued positions must exist before an application can be tracked; an
application must reach an interview stage before prep is useful; prep only matters once an offer
can follow.

| Sprint | Activity                            | Stories |
| ------ | ----------------------------------- | ------- |
| 1      | Build My Strategy Plan              | 3       |
| 2      | Source Positions                    | 1       |
| 3      | Qualify Positions                   | 2       |
| 4      | Give Feedback & Refine Requirements | 2       |
| 5      | Apply to Positions                  | 2       |
| 6      | Track My Applications               | 2       |
| 7      | Prepare for Interviews              | 1       |
| 8      | Negotiate My Offer                  | 1       |

**Total: 14 stories across 8 sprints**, plus 1 Zero Trust boundary story.

---

## Activity Map

| 1. Build My Strategy Plan                | 2. Source Positions                                    | 3. Qualify Positions                       | 4. Give Feedback & Refine Requirements | 5. Apply to Positions              | 6. Track My Applications              | 7. Prepare for Interviews                    | 8. Negotiate My Offer          |
| ---------------------------------------- | ------------------------------------------------------ | ------------------------------------------ | -------------------------------------- | ---------------------------------- | ------------------------------------- | -------------------------------------------- | ------------------------------ |
| Complete my intake interview             | Source positions from LinkedIn/job boards/career sites | Qualify a position against my requirements | Review positions and give feedback     | Choose which positions to pursue   | View my application status            | Receive interview prep for an upcoming stage | Receive negotiation assistance |
| Receive my strategy plan                 |                                                        | Refine a qualification up to 3 passes      | Update my requirements from feedback   | Automate my application submission | Receive an update when status changes |                                              |                                |
| Revise my plan when circumstances change |                                                        |                                            |                                        |                                    |                                       |                                              |                                |

---

## Sprint 1 — Build My Strategy Plan

**VPC source:** GJ1 (Required) — "A living plan to measure progress against and revise"

### CC-001 — Complete My Intake Interview

> As a **Job Seeker**,
> I CAN **Complete an Intake Interview Covering Job Requirements, Location Preference, Salary
> Range, Company Size, and Career-Coach Best-Practice Questions**,
> So that the system has everything it needs to build my strategy plan.

**VPC Traceability:** GJ1 (Required) / PJ1 — Pain Reliever "Intake & Strategy Plan"

### CC-002 — Receive My Strategy Plan

> As a **Job Seeker**,
> I CAN **Receive a Strategy Plan Built from My Intake**,
> So that I have something concrete to check progress against, not just a stack of postings.

**VPC Traceability:** GJ1 (Required) / PJ1

### CC-003 — Revise My Plan When Circumstances Change

> As a **Job Seeker**,
> I CAN **Revise My Strategy Plan**,
> So that I can pivot when my situation, priorities, or the market changes.

**VPC Traceability:** GJ1 (Required) / PJ1 — "a plan I can check progress against and pivot on"

---

## Sprint 2 — Source Positions

**VPC source:** GJ2 (Required) / PJ2 (Score 12 — highest-severity pain)

### CC-004 — Source Positions from LinkedIn, Job Boards, and Company Career Sites

> ⚠️ **SPLIT IN TWO, 2026-08-13 (Iteration 02).** Domain Storytelling DS-1 and Architecture Design
> AD-1 established that fetching at companies the Job Seeker has NAMED and discovering roles at
> companies they have NOT are different capabilities with different risks — and that only the
> second carries the automation hypotheses. The single narrative below covered both, which is what
> let the weaker mechanism stand in for the promise. Gherkin:
> [`iterations/02/06-three-amigos.md`](../02/06-three-amigos.md).

**CC-004a — Board API Sourcing**

> As a **Job Seeker**,
> I CAN **have Positions sourced from the company boards I have named**,
> So that roles at companies I care about appear without my visiting each board.

**CC-004b — Sourcing Service Discovery**

> As a **Job Seeker**,
> I CAN **have Positions discovered at companies I have never named**,
> So that I see roles I would not have found by checking boards I already know.

<details>
<summary>Original single narrative, as written at Workshop 3 (superseded)</summary>

> As a **Job Seeker**,
> I CAN **Have Positions Sourced Automatically from LinkedIn, Job Boards, and Company Career
> Sites**,
> So that I don't have to manually visit every site myself.

</details>

**VPC Traceability:** GJ2 (Required) / PJ2 — Pain Reliever "Sourcing" (Playwright-driven browser
automation)

> **Carried-forward hypothesis:** whether Playwright-driven sourcing is technically and legally
> viable against these sites is unresolved — see the
> [BMC Hypothesis Register](01-bmc.md#hypothesis-register), resolved at Architecture Design.

---

## Sprint 3 — Qualify Positions

**VPC source:** GJ3 (Required) / PJ3

### CC-005 — Qualify a Sourced Position Against My Requirements

> As a **Job Seeker**,
> I CAN **Have Each Sourced Position Qualified Against My Requirements**,
> So that I don't spend time on positions that don't actually match what I need.

**VPC Traceability:** GJ3 (Required) / PJ3 — Pain Reliever "Qualification (≤3 passes)"

### CC-006 — Refine a Qualification Up to 3 Passes

> As a **Job Seeker**,
> I CAN **Have a Position's Qualification Refined Up to 3 Passes**,
> So that borderline positions get a fair, thorough evaluation instead of a single pass verdict.

**VPC Traceability:** GJ3 (Required) / PJ3

---

## Sprint 4 — Give Feedback & Refine Requirements

**VPC source:** GJ4 (Expected) / PJ4

### CC-007 — Review Positions and Give Feedback

> As a **Job Seeker**,
> I CAN **Review Sourced and Qualified Positions and Give Feedback**,
> So that I can accept, reject, or flag positions for the system to learn from.

**VPC Traceability:** GJ4 (Expected) / PJ4 — Pain Reliever "Candidate Feedback Loop"

### CC-008 — Update My Requirements from Feedback

> As a **Job Seeker**,
> I CAN **Have My Requirements Updated Based on My Feedback**,
> So that later sourcing and qualification passes improve instead of repeating the same misses.

**VPC Traceability:** GJ4 (Expected) / PJ4 — "requirements discovered only after seeing real
postings never get fed back into sourcing"

---

## Sprint 5 — Apply to Positions

**VPC source:** GJ5 (Expected) / PJ5

### CC-009 — Choose Which Positions to Pursue

> As a **Job Seeker**,
> I CAN **Choose Which Qualified Positions to Pursue**,
> So that only the positions I actually want move into the application pipeline.

**VPC Traceability:** GJ5 (Expected) / PJ5 — precondition for Application Automation

### CC-010 — Prepare My Application for Review and Submit

> As a **Job Seeker**,
> I CAN **Have My Application Prepared for a Position I've Chosen to Pursue and Submit It Myself
> After a Final Review**,
> So that I don't manually fill out the same application form fields myself, while retaining the
> final submit action on my own account.

**VPC Traceability:** GJ5 (Expected) / PJ5 — Pain Reliever "Application Automation"

> **Resolved at Architecture Design ([05-architecture-design.md](05-architecture-design.md), AD3):**
> full autonomous submission was rejected as too risky against sites (e.g. LinkedIn) whose Terms
> of Service prohibit automated form submission — the risk of an account ban falls on the founder
> personally. `ApplicationAutomationService` prepares the application (fills fields, drafts any
> required cover letter/answers); the Job Seeker performs the final submit action. Where a target
> site offers an official, ToS-compliant application API, true automation may still be used for
> that path — a per-site implementation question, not decided here. Founder confirmed this change
> to the story's scope on 2026-07-24.

---

## Sprint 6 — Track My Applications

**VPC source:** GJ6 (Required) / PJ6 (Score 12 — highest-severity pain, tied with PJ2)

### CC-011 — View My Application Status Across the Full Pipeline

> As a **Job Seeker**,
> I CAN **View Every Application's Status Across the Full Pipeline** (submitted, rejected, phone
> screen, hiring-manager submission, each interview stage through final, offer/no offer),
> So that I always know exactly where every application stands.

**VPC Traceability:** GJ6 (Required) / PJ6 — Pain Reliever "Application Tracking"

### CC-012 — Receive an Update When an Application's Status Changes

> As a **Job Seeker**,
> I CAN **Receive an Update When an Application's Status Changes**,
> So that I don't have to manually re-check every application to notice a change.

**VPC Traceability:** GJ6 (Required) / PJ6

---

## Sprint 7 — Prepare for Interviews

**VPC source:** GJ7 (Expected) / PJ7

### CC-013 — Receive Interview Prep for an Upcoming Stage

> As a **Job Seeker**,
> I CAN **Receive Interview Prep Specific to My Next Scheduled Stage** (phone screening through
> final interview),
> So that I walk in prepared for what that specific stage actually tests, not generic advice.

**VPC Traceability:** GJ7 (Expected) / PJ7 — Pain Reliever "Interview Prep"

---

## Sprint 8 — Negotiate My Offer

**VPC source:** GJ8 (Desired) / PJ8

### CC-014 — Receive Negotiation Assistance for a Presented Offer

> As a **Job Seeker**,
> I CAN **Receive Negotiation Assistance Once an Offer Is Presented**,
> So that I negotiate from an informed position grounded in my own strategy plan and requirements,
> rather than guessing.

**VPC Traceability:** GJ8 (Desired) / PJ8 — Pain Reliever "Negotiation Assistance", referencing
CC-002's Strategy Plan (e.g. salary range from intake)

---

## Zero Trust Boundary Story

### CC-000-ZT — Unauthenticated User Cannot Access My Job Search Data

> As an **Unauthenticated User**,
> I CANNOT **Access Any Job Search Data** (strategy plan, sourced positions, applications,
> interview prep, or negotiation history),
> So that this candidate's job search data is only accessible to the authenticated candidate.

**VPC Traceability:** BMC decision to reuse platform-iam/api-gateway rather than build standalone
auth — every story above is denied by default until authenticated through the shared platform
session.

---

## Open Items Carried Forward to Domain Storytelling (not resolved by this Story Map)

| Hypothesis                                                                        | Surfaces at    | Status                                                                                                    |
| --------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------- |
| Playwright-driven sourcing is technically/legally viable                          | CC-004         | Unresolved — needs Architecture Design                                                                    |
| Playwright-driven application-submission automation is technically/legally viable | CC-010         | Unresolved — needs Architecture Design; higher risk than sourcing since it acts on the candidate's behalf |
| CAPTCHA-solving/anti-bot-mitigation cost, if needed                               | CC-004, CC-010 | Unresolved — dependent on the two automation-viability items above                                        |

---

## Next: Domain Storytelling Workshop (Workshop 4)

Each story above becomes a candidate for a domain story — an Actor/WorkObject/Activity narrative
per Story Map activity, surfacing example scenarios (concrete situations, not Gherkin) for Three
Amigos to later compose into Feature files.
