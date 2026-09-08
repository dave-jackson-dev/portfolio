# Three Amigos — Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Workshop:** 6 of 9 · **Attempt:** 1 · **Facilitated:** 2026-08-13
> **Scope:** the two Features that replace Iteration 01's single Feature 2, plus one Scenario added
> to Feature 3. Features 1 and 4–6 carry forward from
> [Iteration 01](../01/06-three-amigos.md) unchanged.
> **Composed from:** [`04-domain-storytelling.md`](04-domain-storytelling.md) (DS-1 to DS-4) and
> sequenced per [`05-architecture-design.md`](05-architecture-design.md)'s dependency map — the map
> is **referenced, not re-derived**.

## 🔴 A correction this workshop had to make first

Earlier documents in this iteration — the scope proposal, the AD transcript, and two PR bodies —
state that Workshop 6's Feature 3 _"rejects `POS-2202` against a `$150,000-$180,000` salary
requirement"_. **That is wrong.** Feature 3 rejects `POS-2202` for _"fails remote-only
requirement"_; `POS-2202` is hybrid at `$155,000`, which **passes** the salary bar.

The consequence changes this workshop's job: **no existing Scenario exercises salary at all as a
rejection reason**, so DS-3 (_absent salary is not a failed requirement_) does not contradict a
Scenario — it fills a hole where none existed. This workshop **adds** a Scenario rather than fixing
one.

Recorded here rather than quietly corrected because the claim propagated into four documents before
anyone read the Gherkin.

---

## Feature 2a — Board API Sourcing _(CC-004)_

**Depends on Feature 1** — shared aggregate: sourcing needs `PLAN-01` to exist so sourced Positions
have a Requirement Set to be qualified against later (AD dependency map).

```gherkin
Feature: Board API Sourcing

  As a Job Seeker,
  I CAN have Positions sourced from the company boards I have named
  so that, roles at companies I care about appear without my visiting each board.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com
    And Strategy Plan PLAN-01 exists with a Requirement Set
    And the configured boards are greenhouse:stripe, lever:spotify and greenhouse:nonesuch-xyz

  @smoke
  Scenario: I CAN have the nightly schedule source Positions from a named board
    Given no Position has yet been sourced from greenhouse:stripe
    When the Nightly Schedule triggers Board API Sourcing
    Then Position gh-8077887 (Senior Backend Engineer, Stripe, "SF, NYC, SEA, CHI") exists with status Sourced

  Scenario: I CAN trigger a sourcing pass myself between scheduled runs
    Given the Nightly Schedule last ran 9 hours ago
    When I trigger Board API Sourcing myself
    Then Position gh-9001 (Platform Engineer, Stripe, Remote) exists with status Sourced

  # DS-2 — a pass is partial-success, not all-or-nothing.
  @smoke
  Scenario: I CAN complete a sourcing pass when one of three boards fails
    Given board greenhouse:nonesuch-xyz returns HTTP 404
    When the Nightly Schedule triggers Board API Sourcing
    Then Position gh-8077887 exists with status Sourced
    And Position lv-a1b2c3d4 (Senior Backend Engineer, Spotify, London) exists with status Sourced
    And a Board Failure is recorded for greenhouse:nonesuch-xyz
    And the sourcing pass is not recorded as failed

  # Two requisitions, one real posting — observed live 2026-08-12: 667 candidates collapsed to 661.
  Scenario: I CAN have two requisitions for the same posting recorded once
    Given board greenhouse:stripe lists gh-8077887 and gh-8077912, both Senior Backend Engineer at Stripe in "SF, NYC, SEA, CHI"
    When the Nightly Schedule triggers Board API Sourcing
    Then exactly one Position exists for Senior Backend Engineer at Stripe in "SF, NYC, SEA, CHI"
    And no duplicate Position is created for the same posting

  # DS-3, producer side. Observed live: 0 of 667 sourced Positions carried a salary.
  Scenario: I CAN have a Position sourced when the board publishes no salary
    Given board greenhouse:stripe publishes no salary for gh-8077887
    When the Nightly Schedule triggers Board API Sourcing
    Then Position gh-8077887 exists with status Sourced
    And gh-8077887's salary is recorded as unknown
    And gh-8077887 is not discarded for having no salary

  # A misconfiguration must announce itself rather than sourcing from fewer boards.
  Scenario: I CANNOT start a sourcing pass with a misconfigured board list
    Given the configured boards are greenhouse:stripe and workday:acme
    When Board API Sourcing starts
    Then the pass is refused naming provider "workday"
    And no Position is created

  @zero-trust
  Scenario: I CANNOT trigger a sourcing pass unauthenticated
    Given I am not authenticated
    When I trigger Board API Sourcing myself
    Then the request is refused with 401
    And no Position is created
```

**Cross-Scenario dependency review** (Step 9):

| Scenario                               | Precondition produced by                                         | Sequencing     |
| -------------------------------------- | ---------------------------------------------------------------- | -------------- |
| _two requisitions … recorded once_     | Self-contained — both requisitions arrive in the **same** pass   | ✅ No conflict |
| _I CAN trigger a sourcing pass myself_ | "last ran 9 hours ago" is Background state, not another Scenario | ✅ No conflict |
| _complete a pass when one board fails_ | The failing board is in the Background                           | ✅ No conflict |

**No Scenario in this Feature requires a state only a different Scenario produces.** That is
deliberate: the de-duplication case was written so both requisitions arrive in one pass, rather than
depending on a prior pass having run — which is what makes it independently runnable and is the
lesson from the Developer Portal's Sprint 1 pull-forward.

---

## Feature 2b — Sourcing Service Discovery _(CC-004)_

**Depends on Feature 1** (same shared aggregate as 2a) and is **independent of Feature 2a** — either
mechanism can create a Sourced Position on its own.

🔴 **Both automation-risk hypotheses attach to this Feature and to nothing else.** These Scenarios
are specification, not evidence: none of them has been run, because `Sourcing Service` has no
implementation yet.

```gherkin
Feature: Sourcing Service Discovery

  As a Job Seeker,
  I CAN have Positions discovered at companies I have never named
  so that, I see roles I would not have found by checking boards I already know.

  Background:
    Given I am authenticated as Job Seeker jordan.blake@example.com
    And Strategy Plan PLAN-01 exists with a Requirement Set

  @smoke
  Scenario: I CAN have a Position discovered at a company I have not named
    Given no board is configured for Helio Robotics
    When the Nightly Schedule triggers Sourcing Service discovery on a job board
    Then Position ss-4401 (Principal Engineer, Helio Robotics, Remote) exists with status Sourced
    And ss-4401 was not sourced from any configured board

  # DS-2 again — same partial-success rule as 2a, different failure mode.
  Scenario: I CAN complete a discovery pass when one site blocks automated access
    Given LinkedIn presents a CAPTCHA to Sourcing Service
    When the Nightly Schedule triggers Sourcing Service discovery
    Then Position ss-4401 exists with status Sourced
    And an Anti-Bot Block is recorded for LinkedIn
    And the discovery pass is not recorded as failed

  # The cross-mechanism duplicate — the case neither Feature can test alone.
  Scenario: I CAN have a posting found by both mechanisms recorded once
    Given Position gh-8077887 (Senior Backend Engineer, Stripe, "SF, NYC, SEA, CHI") already exists with status Sourced
    When Sourcing Service discovers the same posting on Stripe's own career site
    Then exactly one Position exists for Senior Backend Engineer at Stripe in "SF, NYC, SEA, CHI"
    And no duplicate Position is created for the same posting

  @zero-trust
  Scenario: I CANNOT trigger a discovery pass unauthenticated
    Given I am not authenticated
    When I trigger Sourcing Service discovery myself
    Then the request is refused with 401
    And no Position is created
```

**Cross-Scenario dependency review** (Step 9):

🔴 **One real dependency, and it crosses Features.** _"I CAN have a posting found by both mechanisms
recorded once"_ requires `gh-8077887` to already exist as a Sourced Position — and **only Feature
2a produces it.**

| Needs                                    | Produced by                                         | Sequencing conflict?                                                                                                                     |
| ---------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `gh-8077887` Sourced, from a named board | **Feature 2a**, Scenario _nightly schedule sources_ | ⚠️ **Yes — flagged now.** AD's map makes 2b's implementation later than 2a's, so this Scenario cannot be exercised until 2a has shipped. |

**This does not require a pull-forward** — 2a has already shipped, so the precondition exists today.
It is flagged because the dependency is invisible from inside Feature 2b, and a future re-cut that
reordered the two would break this Scenario silently.

---

## Feature 3 — Qualify Positions: one Scenario ADDED

Iteration 01's Feature 3 is otherwise unchanged. DS-3 fills a hole rather than correcting an error —
see the correction at the top.

```gherkin
  # DS-3 — absent data is not a failed requirement. Distinct from a stated-but-insufficient salary,
  # which still fails. Consumer side of Feature 2a's "sourced with no salary" Scenario.
  Scenario: I CAN have a Position with unknown salary qualified on its other requirements
    Given Strategy Plan PLAN-01 requires remote only and salary >= $150,000
    And Position gh-9001 (Platform Engineer, Stripe, Remote) has status Sourced
    And gh-9001's salary is unknown
    When the Qualification Service checks gh-9001 against PLAN-01's Requirement Set
    Then gh-9001's status becomes Qualified
    And the salary requirement is recorded as not evaluated for gh-9001
    And gh-9001 is not rejected for having no salary
```

**Cross-Scenario dependency review:** this Scenario's `Given` requires `gh-9001` **Sourced with
unknown salary** — produced by Feature 2a's _"sourced when the board publishes no salary"_ Scenario.
Feature 2a precedes Feature 3 in AD's dependency map (`Position` must reach `Sourced` before
`Qualified`), so **the ordering is already correct** — no conflict.

⚠️ **Deliberately NOT added:** a Scenario for a stated-but-insufficient salary. `POS-2202`'s
existing rejection is on remote-only, and inventing a salary-rejection Scenario here would be
composing specification this iteration's Domain Storytelling never surfaced. Left for whichever
iteration actually needs it.

---

## Self-review results

**Specific-example check (Step 8) — passed.** Every `Given`/`When`/`Then` names a concrete instance:
`gh-8077887`, `gh-8077912`, `gh-9001`, `lv-a1b2c3d4`, `ss-4401`, `greenhouse:nonesuch-xyz`,
`PLAN-01`, `jordan.blake@example.com`. Identifiers are reused for the same entity across Scenarios,
and no Scenario refers to "that Position" after an id has been given.

**Zero-Trust tagging (Step 7a) — 2 Scenarios tagged, and 2 deliberately NOT.**

| Scenario                                                | Tagged?           | Why                                                                                            |
| ------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| _I CANNOT trigger a sourcing pass unauthenticated_      | ✅ `@zero-trust`  | Refused for **who you are**. An authenticated administrator would succeed.                     |
| _I CANNOT trigger a discovery pass unauthenticated_     | ✅ `@zero-trust`  | Same.                                                                                          |
| _I CANNOT start a pass with a misconfigured board list_ | ❌ **not tagged** | An administrator hits this identically — it is refused for **what you sent**. An `error` case. |
| _complete a pass when one board fails_                  | ❌ not tagged     | An `edge` case, not a boundary. Nobody is being refused.                                       |

That third row is the exact inference error the tagging standard was written for: it contains
"CANNOT" and "refused", and a regex over prose would have counted it as a security boundary.
