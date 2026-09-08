# MVP Plan — Career Coach

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

_The explicit v1 scope cut, drawn from the full backlog ([03-user-story-map.md](03-user-story-map.md)),
the dependency map ([05-architecture-design.md](05-architecture-design.md) AD4), the Gherkin
([06-three-amigos.md](06-three-amigos.md)), and the UI designs ([07-ux-design.md](07-ux-design.md)).
Produced by the MVP Planning Workshop — Product Owner Primary, Architect/Developer/UX Designer
consulting._

---

## The v1 Cut

**v1 ships Sprints 1–6 (12 stories, CC-001–CC-012). Sprints 7–8 (CC-013, CC-014) are deferred to a
future iteration.**

| Sprint | Activity                            | Gain Level     | v1?         |
| ------ | ----------------------------------- | -------------- | ----------- |
| 1      | Build My Strategy Plan              | Required (GJ1) | ✅ v1       |
| 2      | Source Positions                    | Required (GJ2) | ✅ v1       |
| 3      | Qualify Positions                   | Required (GJ3) | ✅ v1       |
| 4      | Give Feedback & Refine Requirements | Expected (GJ4) | ✅ v1       |
| 5      | Apply to Positions                  | Expected (GJ5) | ✅ v1       |
| 6      | Track My Applications               | Required (GJ6) | ✅ v1       |
| 7      | Prepare for Interviews              | Expected (GJ7) | ⏸ Deferred |
| 8      | Negotiate My Offer                  | Desired (GJ8)  | ⏸ Deferred |

### Why this cut, not a naive gain-level cut

The methodology's default heuristic ("Sprint 1 ships Required Gains; later sprints ship Desired/
Unexpected") does **not** map cleanly onto Gain level alone here, because AD4's dependency map
shows Sprints 1–6 form one unbroken dependency chain regardless of gain level: Sprint 6 (Required)
cannot ship without Sprint 5 (Expected) already existing, because `Application` (created in
Sprint 5) is the aggregate Sprint 6 tracks. Cutting v1 at "Required gains only" would strand
Sprint 6 with nothing to track. The real cut point is the **first natural dependency break** in
AD4's chain — and that break is real, not arbitrary: Sprints 7 and 8 are each gated by an external,
calendar-time event outside the system's control (an interview being scheduled; an offer being
extended). Sprints 1–6 can be built, shipped, and used productively — sourcing, qualifying,
applying, and tracking real positions — for weeks before a single interview or offer occurs,
making Sprint 7/8 genuinely separable from the core loop in a way Sprint 5 is not.

**Cost/UI-scope confirmation (from Workshop 7):** `Interview Prep` and `Negotiation Assistance`
are two of the smallest, most self-contained screens in the whole design (see
[07-ux-design.md](07-ux-design.md)) — deferring them is a scope-timing decision, not a
complexity-avoidance one. They are cheap to build later, precisely when they become usable.

---

## Hypothesis Register Reconciliation

Every entry accumulated since the BMC workshop, checked against the v1 cut:

| Hypothesis                                                                             | Source                                                             | Still testable in v1?                                                                                                                                                               |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Playwright-driven sourcing is technically/legally viable                               | BMC, resolved architecturally by AD3 (read-only automation)        | ✅ Yes — CC-004 (Sprint 2) ships in v1; the resolution is exercised the first time Sourcing runs for real                                                                           |
| Application-submission automation is technically/legally viable                        | BMC, resolved architecturally by AD3 (hybrid prepare+human-submit) | ✅ Yes — CC-010 (Sprint 5) ships in v1; the hybrid flow is exercised the first time an Application is prepared and submitted                                                        |
| CAPTCHA/anti-bot-mitigation cost, narrowed to Sourcing only                            | BMC, AD3                                                           | ✅ Yes — observed as a byproduct of CC-004 (Sprint 2) running in v1, no dedicated story needed                                                                                      |
| Pain/Gain severity ratings are self-assessed, not validated against a second candidate | VPC                                                                | Not applicable to a v1/v2 cut — this MVP has one candidate (the founder) by design; explicitly out of scope for external validation this iteration, unchanged by which sprints ship |

**No entry is stranded by deferring Sprints 7–8.** Neither `InterviewPrep` nor `Negotiation`
carries any of the automation-risk hypotheses — those are pure LLM-content-generation services
with no external-site automation, distinct from `SourcingService`/`ApplicationAutomationService`.
Every hypothesis this iteration's workshops raised is exercised by a story already in the v1 cut.

---

## Next: Sprint 1 Planning Workshop (Workshop 9)

Breaks v1's 12 stories (Sprints 1–6) into estimated, dependency-ordered tasks — starting with
Sprint 1's `StrategyPlan` aggregate, per AD4's confirmed hard-dependency chain.
