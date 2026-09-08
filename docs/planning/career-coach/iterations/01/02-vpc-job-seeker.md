# Value Proposition Canvas — Senior Software Engineer Job Seeker

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_Segment: Senior Software Engineer — Job Seeker (MVP, solo), carried over unchanged from
[01-bmc.md](01-bmc.md)_

**Facilitator:** Product Owner (Primary), self-answered on the founder's explicit delegation — the
founder is both the builder and the sole candidate this MVP serves, so pains/gains are drawn from
the founder's own lived job-search experience (including the prior job-search project) rather than
external customer interviews. Severity/frequency/gain-level ratings below are the founder's own
judgment, not yet validated against a second candidate — flagged in the Hypothesis Register at the
bottom rather than presented as externally validated.

---

## Customer Profile

### Objectives & Activities

| Objective                                 | Activities                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| **Land the right role**                   | Define and refine personal requirements, source and qualify positions against them |
| **Move efficiently through the pipeline** | Apply to qualified roles, track status across every stage without losing detail    |
| **Perform well under evaluation**         | Prepare for each interview stage with the right context                            |
| **Close on the best available terms**     | Negotiate the offer once one is presented                                          |

### Tasks

- Answer an initial intake covering job requirements, location preference, salary range, company
  size, and other career-coach/recruiter best-practice questions
- Review a plan that can be checked for progress and revised as circumstances change
- Review sourced positions and give feedback (accept/reject/refine)
- Decide which qualified positions to pursue
- Track each pursued position's status through the pipeline
- Prepare for a specific upcoming interview stage
- Evaluate and respond to a job offer

### Customer Jobs

**Functional Jobs:**

- JF1: I need a plan I can check progress against and pivot on, not just a stack of postings
- JF2: I need positions sourced from LinkedIn, job boards, and company career sites without manually visiting each one
- JF3: I need each position checked against my actual requirements before I spend time on it
- JF4: I need to give feedback that refines future sourcing/qualification, not just react to a single batch
- JF5: I need qualified applications submitted without doing the repetitive form-filling myself
- JF6: I need to know exactly what stage every application is at, at a glance
- JF7: I need the right preparation for whatever interview stage is next, not generic interview advice
- JF8: I need help getting the best terms once an offer is on the table

**Emotional Jobs:**

- JE1: Feel in control of a process that would otherwise be scattered across tabs and spreadsheets
- JE2: Feel confident going into an interview instead of scrambling to prep at the last minute
- JE3: Feel like the plan is actually being followed, not abandoned after the first setback

**Social Jobs:**

- JS1: Be seen (by future employer, by self) as someone who ran a disciplined, professional search
- JS2: Negotiate from a position that feels informed rather than guessing

### Pains

Pain prioritization uses **Score = Severity × Frequency**:

- **Severity:** Low (1) · Medium (2) · High (3)
- **Frequency:** Rare (1) · Monthly (2) · Weekly (3) · Daily (4) · Continuous (5)
- **Score** range 1–15.

| ID      | Pain                                                                                                   | Severity   | Frequency  | Score  | Type              | Evidence                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------ | ---------- | ---------- | ------ | ----------------- | -------------------------------------------------------------------------------------------------- |
| **PJ1** | No single plan to check progress against or use to decide when to pivot                                | High (3)   | Weekly (3) | **9**  | Obstacle          | Founder's own prior job-search experience — carried into BMC Value Proposition                     |
| **PJ2** | Manually visiting LinkedIn/job boards/career sites to find postings is slow and easy to fall behind on | High (3)   | Daily (4)  | **12** | Undesired Outcome | job-search's original motivating pain — unchanged                                                  |
| **PJ3** | Time spent on positions that don't actually meet requirements                                          | Medium (2) | Weekly (3) | **6**  | Obstacle          | job-search's original qualification/ranking rationale                                              |
| **PJ4** | Requirements discovered only after seeing real postings never get fed back into sourcing               | Medium (2) | Weekly (3) | **6**  | Obstacle          | New pain this iteration — job-search had no feedback loop                                          |
| **PJ5** | Manually filling out application forms for every qualified role                                        | Medium (2) | Weekly (3) | **6**  | Undesired Outcome | New scope this iteration (application automation)                                                  |
| **PJ6** | Losing track of which stage an application is at across many simultaneous applications                 | High (3)   | Daily (4)  | **12** | Risk              | New scope this iteration (status tracking)                                                         |
| **PJ7** | Walking into an interview stage under-prepared for what that specific stage tests                      | Medium (2) | Weekly (3) | **6**  | Risk              | New scope this iteration (interview prep)                                                          |
| **PJ8** | Leaving money/terms on the table by not negotiating well                                               | High (3)   | Rare (1)   | **3**  | Undesired Outcome | New scope this iteration (negotiation) — rare because it only happens per-offer, but high severity |

### Gains

| ID      | Gain                                                                  | Level    | Description                                                                           |
| ------- | --------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| **GJ1** | A living plan to measure progress against and revise                  | Required | Produced by the intake/strategy step                                                  |
| **GJ2** | Positions sourced automatically across all relevant sites             | Required | Playwright-driven sourcing                                                            |
| **GJ3** | Confidence that surfaced positions actually meet requirements         | Required | Multi-pass qualification/refinement                                                   |
| **GJ4** | Requirements that improve over time from real feedback                | Expected | Candidate feedback loop feeding back into sourcing/qualification                      |
| **GJ5** | Applications submitted without manual form-filling                    | Expected | Application automation                                                                |
| **GJ6** | Always-current visibility into every application's stage              | Required | Application tracking across the full pipeline                                         |
| **GJ7** | Interview prep matched to the specific stage coming up                | Expected | Stage-aware interview prep                                                            |
| **GJ8** | Negotiation support grounded in the candidate's own requirements/plan | Desired  | Negotiation assistance tied back to the original plan (e.g. salary range from intake) |

---

## Value Map

### Products & Services

| #   | Product / Service             | Importance | Description                                                                                                    |
| --- | ----------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | **Intake & Strategy Plan**    | Essential  | Interview-style intake producing a plan usable to track progress and pivot                                     |
| 2   | **Sourcing**                  | Essential  | Playwright-driven sessions against LinkedIn, job boards, company career pages                                  |
| 3   | **Qualification (≤3 passes)** | Essential  | Each position analyzed against requirements, refined up to 3 times                                             |
| 4   | **Candidate Feedback Loop**   | Essential  | Present positions, capture feedback, update requirements                                                       |
| 5   | **Application Automation**    | Essential  | Automates submitting applications for pursued positions                                                        |
| 6   | **Application Tracking**      | Essential  | Status pipeline: submitted → rejected / phone screen → hiring-manager submission → interviews → offer/no offer |
| 7   | **Interview Prep**            | Essential  | Stage-specific prep from phone screening through final interview                                               |
| 8   | **Negotiation Assistance**    | Essential  | Support once an offer is presented                                                                             |

### Pain Relievers

| Pain                                           | Reliever                                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **PJ1**: No plan to track progress against     | **Intake & Strategy Plan** produced at the start of the workflow                             |
| **PJ2**: Manual site-by-site sourcing          | **Sourcing** via Playwright-driven browser automation                                        |
| **PJ3**: Time on non-matching positions        | **Qualification (≤3 passes)** against the candidate's requirements                           |
| **PJ4**: Feedback never reaches sourcing       | **Candidate Feedback Loop** updates requirements used in later sourcing/qualification passes |
| **PJ5**: Manual application form-filling       | **Application Automation** for positions the candidate chooses to pursue                     |
| **PJ6**: Losing track of application stage     | **Application Tracking** across the full defined pipeline                                    |
| **PJ7**: Under-prepared for an interview stage | **Interview Prep** matched to the specific upcoming stage                                    |
| **PJ8**: Leaving value on the table at offer   | **Negotiation Assistance** once an offer is presented                                        |

### Gain Creators

| Gain                                             | Creator                                                                 |
| ------------------------------------------------ | ----------------------------------------------------------------------- |
| **GJ1**: A living plan                           | Intake & Strategy Plan                                                  |
| **GJ2**: Automatic sourcing                      | Sourcing                                                                |
| **GJ3**: Confidence positions match requirements | Qualification (≤3 passes)                                               |
| **GJ4**: Requirements improve over time          | Candidate Feedback Loop                                                 |
| **GJ5**: No manual form-filling                  | Application Automation                                                  |
| **GJ6**: Always-current stage visibility         | Application Tracking                                                    |
| **GJ7**: Stage-matched interview prep            | Interview Prep                                                          |
| **GJ8**: Grounded negotiation support            | Negotiation Assistance, referencing the original Intake & Strategy Plan |

---

## Feature Table

| Group             | Feature                     | Description                                                                                                                          |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Strategy**      | Candidate Intake            | Interview-style Q&A covering requirements, location, salary range, company size, plus career-coach/recruiter best-practice questions |
| **Strategy**      | Strategy Plan               | Output of intake — a plan the candidate can check progress against and revise                                                        |
| **Sourcing**      | Automated Sourcing          | Playwright-driven sessions against LinkedIn, job boards, company career pages                                                        |
| **Qualification** | Multi-Pass Qualification    | Analyzes each sourced position against requirements, up to 3 refinement passes                                                       |
| **Feedback**      | Candidate Review & Feedback | Presents positions to the candidate; captures approval/rejection and new/refined requirements                                        |
| **Application**   | Application Automation      | Submits the application for positions the candidate chooses to pursue                                                                |
| **Tracking**      | Application Status Pipeline | Tracks submitted → rejected/phone screen → hiring-manager submission → interviews → offer/no offer                                   |
| **Interview**     | Interview Prep              | Stage-specific prep material from phone screening through final interview                                                            |
| **Negotiation**   | Negotiation Assistance      | Support for evaluating and responding to a presented offer                                                                           |

---

## Fit Verification Matrix

### Pain Coverage (Pain → Reliever)

| Pain ID | Pain (short)                        | Relieved By               |
| ------- | ----------------------------------- | ------------------------- |
| PJ1     | No plan to track progress           | Intake & Strategy Plan    |
| PJ2     | Manual site-by-site sourcing        | Sourcing                  |
| PJ3     | Time on non-matching positions      | Qualification (≤3 passes) |
| PJ4     | Feedback never reaches sourcing     | Candidate Feedback Loop   |
| PJ5     | Manual application form-filling     | Application Automation    |
| PJ6     | Losing track of application stage   | Application Tracking      |
| PJ7     | Under-prepared for interview stage  | Interview Prep            |
| PJ8     | Leaving value on the table at offer | Negotiation Assistance    |

**Orphan check:** 0 pains without a reliever. ✅

### Gain Coverage (Gain → Creator)

| Gain ID | Gain (short)                            | Created By                |
| ------- | --------------------------------------- | ------------------------- |
| GJ1     | A living plan                           | Intake & Strategy Plan    |
| GJ2     | Automatic sourcing                      | Sourcing                  |
| GJ3     | Confidence positions match requirements | Qualification (≤3 passes) |
| GJ4     | Requirements improve over time          | Candidate Feedback Loop   |
| GJ5     | No manual form-filling                  | Application Automation    |
| GJ6     | Always-current stage visibility         | Application Tracking      |
| GJ7     | Stage-matched interview prep            | Interview Prep            |
| GJ8     | Grounded negotiation support            | Negotiation Assistance    |

**Orphan check:** 0 gains without a creator. ✅

### Reverse Check (Product/Service → Pain-or-Gain)

Every Product/Service above traces to at least one Pain or Gain it exists to address — no
product/service was added without a named pain/gain driving it (Intake & Strategy Plan → PJ1/GJ1;
Sourcing → PJ2/GJ2; Qualification → PJ3/GJ3; Candidate Feedback Loop → PJ4/GJ4; Application
Automation → PJ5/GJ5; Application Tracking → PJ6/GJ6; Interview Prep → PJ7/GJ7; Negotiation
Assistance → PJ8/GJ8). **Orphan check:** 0 products/services without a driving pain or gain. ✅

---

## User Stories

Deferred to the [User Story Map](03-user-story-map.md) (workshop 3) — this canvas identifies the
capabilities; the Story Map breaks them into "I CAN" stories and sequences them into Sprints.

---

## Hypothesis Register

| Assumption                                                                                                                                               | Status      | Validation Method                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| Pain/Gain severity, frequency, and level ratings above are the founder's own judgment, not validated against a second candidate                          | Unvalidated | This MVP has one candidate (the founder) by design — not scoped for external validation this iteration         |
| The Application Automation and Negotiation Assistance features are viable given the BMC's flagged automation-risk hypothesis (ToS/CAPTCHA/rate-limiting) | Unvalidated | Carries the same open item from [01-bmc.md](01-bmc.md)'s Hypothesis Register — resolved at Architecture Design |
