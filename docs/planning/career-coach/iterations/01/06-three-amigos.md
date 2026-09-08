# Three Amigos — Career Coach — Gherkin Features

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Complete `Feature:` specifications, one per Domain Story from Workshop 4, composed from that
workshop's prose example scenarios and grounded in Workshop 5's architecture decisions (AD1–AD4).
Domain-language Gherkin only — no HTTP verbs, status codes, or UI control names. Produced by the
Three Amigos Workshop — Product Owner, Developer Primary; QA Tester Primary._

**Grouping rationale:** one Feature file section per Domain Story (8 Domain Stories → 8 Features),
not one per CC-story (14). Domain Storytelling's 8 stories already group CC-stories that share one
Actor/WorkObject/Activity narrative and one `Background` context, following the developer-portal
precedent's own grouping rationale.

**Sequencing** follows Workshop 5's AD4 dependency map exactly: Feature 1 → 2 → 3 → 4 → 5 → 6 → 7 →
8, matching every confirmed hard dependency (shared aggregate, state transition, event
producer/consumer). AD4 found no conflicts against the Story Map's Sprint 1–8 order, so this
sequencing is identical to the Sprint order.

**Consistent example data reused across every Feature below:**

- Job Seeker: `jordan.blake@example.com`
- Strategy Plan: `PLAN-01` (remote only, salary ≥ $150,000, mid-size to enterprise company size,
  Full-Stack TypeScript/Angular/NestJS stack preference)
- Positions: `POS-2201` (Senior Backend Engineer, Acme Cloud, remote, $160,000–$180,000),
  `POS-2202` (Platform Engineer, Nimbus Data, hybrid — fails the remote requirement),
  `POS-2203` (Staff Engineer, Vertex Systems, remote, $165,000)
- Application: `APP-3301` (for `POS-2201`)
- Offer: `$172,000` base + `$10,000` signing bonus from Acme Cloud

**Self-review checks completed for every Scenario below (QA Tester persona, per the
Specification-by-Example standard):**

1. **Specific-example check** — every `Given`/`When`/`Then` names a concrete instance (a Position
   ID, a company name, a dollar amount, a stage name), never a generic domain-noun placeholder.
   The same identifier is reused for the same entity across every Scenario in a Feature.
2. **Cross-Scenario dependency check** — for each Feature, every Scenario's `Given` was checked
   against every other Scenario in the same Feature for a precondition state (`Qualified`,
   `Rejected`, `Pursued`, a pipeline stage) that only a _different_ Scenario's capability produces.
   Findings are noted inline as "Depends on" lines per Feature below; none required a sequencing
   change to AD4's dependency map.

---

## Feature 0 — Protect Job Search Data by Default _(Zero Trust — CC-000-ZT)_

```gherkin
Feature: Protect Job Search Data by Default

  As an Unauthenticated User,
  I CANNOT Access Job Search Data
  so that, jordan.blake@example.com's strategy plan, positions, and applications are only
  accessible to the authenticated candidate.

  Scenario: Unauthenticated access to the Strategy Plan is denied
    Given no active session exists for jordan.blake@example.com
    When an unauthenticated request attempts to read Strategy Plan PLAN-01
    Then the request is rejected with "Access Denied"
    And the attempt is logged in the security audit trail

  Scenario: Unauthenticated access to Application data is denied
    Given no active session exists for jordan.blake@example.com
    When an unauthenticated request attempts to read Application APP-3301
    Then the request is rejected with "Access Denied"
    And the attempt is logged in the security audit trail
```

---

## Feature 1 — Build My Strategy Plan _(Sprint 1 — CC-001–003)_

```gherkin
Feature: Build My Strategy Plan

  As a Job Seeker,
  I CAN Build a Strategy Plan
  so that, I have a living plan to check progress against and pivot on.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com

  Scenario: Complete the intake interview
    Given I have not yet completed an intake interview
    When I answer the intake interview with: remote only, salary range $150,000-$180,000,
    mid-size to enterprise company size, and Full-Stack TypeScript/Angular/NestJS stack
    preference
    Then Requirement Set for jordan.blake@example.com is recorded with those answers

  Scenario: Receive the Strategy Plan built from intake
    Given jordan.blake@example.com's intake interview is complete with a Requirement Set
    When the Strategy Plan is built from that Requirement Set
    Then Strategy Plan PLAN-01 exists for jordan.blake@example.com
    And PLAN-01 states the target salary range as $150,000-$180,000

  Scenario: Revise the Strategy Plan when circumstances change
    Given Strategy Plan PLAN-01 exists with a target salary range of $150,000-$180,000
    When jordan.blake@example.com revises PLAN-01's target salary range to $140,000-$165,000
    Then PLAN-01's Requirement Set reflects the revised range of $140,000-$165,000
    And future Position qualification uses the revised range, not the original
```

---

## Feature 2 — Source Positions _(Sprint 2 — CC-004)_

**Depends on Feature 1** — shared aggregate: sourcing reads `PLAN-01`'s Requirement Set to know
what to source against (AD4).

```gherkin
Feature: Source Positions

  As a Job Seeker,
  I CAN Source Positions
  so that, positions are found from LinkedIn, job boards, and company career sites without
  manually visiting each one.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com
    And Strategy Plan PLAN-01 exists with a Requirement Set

  Scenario: Source a new Position from a job board
    Given Position POS-2201 (Senior Backend Engineer, Acme Cloud, remote, $160,000-$180,000)
    has not yet been sourced
    When the Sourcing Service finds POS-2201 on a job board
    Then POS-2201 exists with status Sourced

  Scenario: De-duplicate a Position found on multiple sites
    Given POS-2201 already exists with status Sourced, originally found on a job board
    When the Sourcing Service finds the same posting for POS-2201 on Acme Cloud's own career site
    Then only one POS-2201 record exists with status Sourced
    And no duplicate Position is created for the same posting
```

---

## Feature 3 — Qualify Positions _(Sprint 3 — CC-005–006)_

**Depends on Feature 2** — state transition on the same `Position` aggregate: a Position must
reach `Sourced` before it can become `Qualified`/`Rejected` (AD4).

```gherkin
Feature: Qualify Positions

  As a Job Seeker,
  I CAN Qualify a Sourced Position
  so that, I don't spend time on positions that don't actually match my requirements.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com
    And Strategy Plan PLAN-01 requires remote only and salary >= $150,000

  Scenario: Qualify a Position that matches all requirements
    Given Position POS-2201 (Senior Backend Engineer, Acme Cloud, remote, $160,000-$180,000)
    has status Sourced
    When the Qualification Service checks POS-2201 against PLAN-01's Requirement Set
    Then POS-2201's status becomes Qualified

  Scenario: Reject a Position that fails a hard requirement
    Given Position POS-2202 (Platform Engineer, Nimbus Data, hybrid, $155,000) has status Sourced
    When the Qualification Service checks POS-2202 against PLAN-01's Requirement Set
    Then POS-2202's status becomes Rejected
    And the rejection reason states "fails remote-only requirement"

  Scenario: Refine a borderline Position across 3 passes
    Given Position POS-2203 (Staff Engineer, Vertex Systems, remote, $165,000) has status Sourced
    And POS-2203's job title match is ambiguous on the first qualification pass
    When the Qualification Service refines the evaluation across up to 3 passes
    Then POS-2203's status becomes Qualified after the 2nd pass resolves the ambiguity
    And no 4th pass is attempted
```

---

## Feature 4 — Give Feedback & Refine Requirements _(Sprint 4 — CC-007–008)_

**Depends on Feature 3** — `Qualified`/`Rejected` Positions must exist before feedback can be given
on them (AD4).

```gherkin
Feature: Give Feedback and Refine Requirements

  As a Job Seeker,
  I CAN Give Feedback on a Qualified Position
  so that, my requirements improve from real feedback instead of losing that signal.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com
    And Strategy Plan PLAN-01 exists with a Requirement Set

  Scenario: Reject a Qualified Position and refine a requirement
    Given Position POS-2203 (Staff Engineer, Vertex Systems, remote, $165,000) has status
    Qualified
    When I give feedback rejecting POS-2203 noting "I don't want fully remote without flexible
    PTO"
    Then PLAN-01's Requirement Set is updated to require flexible PTO
    And the next qualification pass for any Sourced Position uses the updated Requirement Set

  Scenario: Approve a Qualified Position without changing requirements
    Given Position POS-2201 (Senior Backend Engineer, Acme Cloud, remote, $160,000-$180,000) has
    status Qualified
    When I give feedback approving POS-2201
    Then POS-2201's Feedback is recorded as approved
    And PLAN-01's Requirement Set is unchanged
```

---

## Feature 5 — Apply to Positions _(Sprint 5 — CC-009–010)_

**Depends on Feature 3** — a Position must reach `Qualified` before it can become `Pursued` (AD4).
**Reflects AD3's resolution**: Application submission is hybrid — the system prepares the
Application, the Job Seeker performs the final submit action, not full autonomous submission.

```gherkin
Feature: Apply to Positions

  As a Job Seeker,
  I CAN Prepare and Submit an Application for a Pursued Position
  so that, I don't manually fill out the same application form fields myself, while retaining
  the final submit action on my own account.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com

  Scenario: Choose a Qualified Position to pursue
    Given Position POS-2201 (Senior Backend Engineer, Acme Cloud, remote, $160,000-$180,000) has
    status Qualified
    When I select POS-2201 to pursue
    Then POS-2201's status becomes Pursued

  Scenario: Prepare an Application for review
    Given Position POS-2201 has status Pursued
    When the Application Automation Service prepares an application for POS-2201
    Then Application APP-3301 exists for POS-2201 with status Prepared
    And APP-3301's form fields and any drafted cover letter are ready for my review

  Scenario: Submit the prepared Application myself
    Given Application APP-3301 has status Prepared and I have reviewed it
    When I submit APP-3301
    Then APP-3301's status becomes Submitted
    And the submission uses my own account, not an autonomous action taken on my behalf
```

---

## Feature 6 — Track My Applications _(Sprint 6 — CC-011–012)_

**Depends on Feature 5** — an `Application` must exist (created in Feature 5) before its pipeline
stage can be tracked (AD4).

```gherkin
Feature: Track My Applications

  As a Job Seeker,
  I CAN Track My Application's Status Across the Full Pipeline
  so that, I always know exactly where every application stands.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com
    And Application APP-3301 has status Submitted for Position POS-2201

  Scenario: View the Application's current pipeline stage
    Given APP-3301 has status Submitted
    When I view the Application Pipeline
    Then APP-3301 shows status Submitted

  Scenario: Application advances to PhoneScreen
    Given APP-3301 has status Submitted
    When Acme Cloud advances APP-3301 to PhoneScreen
    Then APP-3301's status becomes PhoneScreen
    And I receive an update notifying me of the change

  Scenario: Application is rejected directly from Submitted
    Given APP-3301 has status Submitted
    When Acme Cloud rejects APP-3301 without a phone screen
    Then APP-3301's status becomes Rejected
    And the Pipeline records that the rejection occurred at the Submitted stage
```

---

## Feature 7 — Prepare for Interviews _(Sprint 7 — CC-013)_

**Depends on Feature 6** — `InterviewPrep` only exists once its `Application` reaches an
`InterviewStage` (AD4); the "Application advances to PhoneScreen" scenario in Feature 6 produces
the precondition this Feature's first scenario requires.

```gherkin
Feature: Prepare for Interviews

  As a Job Seeker,
  I CAN Receive Interview Prep for My Next Stage
  so that, I walk in prepared for what that specific stage actually tests.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com

  Scenario: Receive prep for a PhoneScreen stage
    Given Application APP-3301 has status PhoneScreen
    When the Interview Prep Service generates prep for APP-3301
    Then I receive Interview Prep focused on screening-level questions: background, logistics,
    and high-level fit

  Scenario: Receive different prep when the same Application reaches FinalInterview
    Given Application APP-3301 previously received PhoneScreen-stage prep
    And APP-3301's status has since advanced to FinalInterview
    When the Interview Prep Service generates prep for APP-3301 at its new stage
    Then I receive Interview Prep focused on final-round depth, distinct from the earlier
    PhoneScreen prep
```

---

## Feature 8 — Negotiate My Offer _(Sprint 8 — CC-014)_

**Depends on Feature 6** — `Negotiation` only exists once its `Application` reaches `Offer` (AD4).
**Depends on Feature 1** — `NegotiationService` references `PLAN-01`, already established from
Sprint 1 (no new gating, recorded for completeness per AD4).

```gherkin
Feature: Negotiate My Offer

  As a Job Seeker,
  I CAN Receive Negotiation Assistance for a Presented Offer
  so that, I negotiate from an informed position grounded in my own Strategy Plan.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com
    And Strategy Plan PLAN-01 states a target salary range of $150,000-$180,000

  Scenario: Offer below the Strategy Plan's target range
    Given Application APP-3301 has status Offer with a base salary of $140,000 from Acme Cloud
    When the Negotiation Service reviews the Offer against PLAN-01
    Then I am shown that $140,000 is below PLAN-01's target range of $150,000-$180,000
    And I receive negotiation talking points for closing that gap

  Scenario: Offer meets the target range but has negotiable terms
    Given Application APP-3301 has status Offer with a base salary of $172,000 and a $10,000
    signing bonus from Acme Cloud
    When the Negotiation Service reviews the Offer against PLAN-01
    Then I am shown that $172,000 meets PLAN-01's target range
    And I still receive negotiation talking points for start date, signing bonus, and PTO, since
    PLAN-01 did not explicitly rank those terms
```

---

## Next: UX Design Workshop (Workshop 7)

Each Feature above implies a screen or interaction the UX Design workshop must support — most
directly, Feature 5's "review before submit" step (AD3's resolution) and Feature 6's Application
Pipeline view (the stage vocabulary frozen in Domain Storytelling) are the two surfaces with the
clearest UI implications carried forward.
