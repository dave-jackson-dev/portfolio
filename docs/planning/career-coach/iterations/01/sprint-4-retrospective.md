# Sprint 4 Retrospective — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25

---

## What went well in turning stories green?

- **The boundary-swap pattern held for a fourth distinct kind of deferral.** Sprints 1-3 deferred
  persistence, browser automation, and qualification reasoning; Sprint 4 deferred requirement
  refinement reasoning — the same domain-port + deterministic-fixture-adapter shape, no
  reinvention needed even four Sprints in.
- **Real HTTP-level Scenario-writing (Task 8a) caught a real ordering bug** —
  `GiveFeedbackOnPositionHandler` saving Position feedback before checking the caller's
  StrategyPlan existed — that unit tests alone never exercised. This is the concrete payoff of the
  Cucumber/Screenplay mandate (CLAUDE.md's top-priority directive): the gap wasn't found by
  "more unit tests," it was found by writing the actual HTTP-level failure-mode Scenario and
  noticing the response didn't match the intended precondition-before-mutation contract.
- **Reusing an existing UI mechanism instead of building a new one.** Task 10 (revision banner)
  needed zero component changes — `StrategyPlanComponent`'s generic `revisionNote` banner (built
  in Sprint 1 for a different purpose) already satisfied `07-ux-design.md`'s "which Position's
  feedback prompted it" requirement once the application layer started composing an attributed
  note string. Recognizing an existing generic mechanism could absorb a new requirement, instead
  of adding a dedicated `triggeredByPositionId` field to `StrategyPlan`, kept the domain model from
  growing an attribute needed by exactly one story.
- **Per-step commit discipline held across all 14 tasks**, plus two additional defect-fix commits,
  each with its own confirmed-Red-first evidence stated in the commit message.

## What could be improved?

- **The compliance script's triple-dot diff-drift issue (a known, already-documented gap) surfaced
  concretely for the first time this session** — not as a new discovery, but as a real false
  positive that had to be manually triaged (an ADR-012 "high" finding that was actually a
  Developer Portal commit, pulled into this phase branch's diff-vs-`main` by this session's
  `dev`/`main` sync merges under ADR-064). Previous Sprints' compliance passes never hit this
  because `dev`/`main` hadn't just been cross-merged. Worth flagging explicitly: any Sprint whose
  phase branch was recently synced from a shared integration branch should expect this kind of
  false positive and triage compliance findings by file/commit ownership, not take severity labels
  at face value.
- **This Sprint's Zero-Trust scenario needed a second StrategyPlan-less user rather than a second
  real StrategyPlan**, because `BuildStrategyPlanCommand`'s planId is hardcoded to `PLAN-01`
  regardless of caller — two different users building a plan in the same test run would silently
  collide in the in-memory repository (keyed by planId, not userId). Worked around by choosing a
  Zero-Trust scenario shape that didn't need two real plans, but the underlying planId-not-
  per-user gap is real and would bite a future Sprint that actually needs multiple users with
  their own Strategy Plans in one test run.

## Action items

1. **When triaging a post-Sprint compliance pass, check whether `dev`/`main` was recently synced
   into the current branch before accepting a "high" finding at face value** — cross-reference the
   flagged file/commit against this Sprint's own task list first. Owner: carry into every future
   Sprint's compliance-pass step, not just Sprint 5.
2. **Flag the `BuildStrategyPlanCommand`/`planId` hardcoding as a real (if currently harmless)
   gap** — works today because every Scenario across Sprints 1-4 needed exactly one user's plan;
   will silently corrupt data the first time two real users' plans are needed in the same run.
   Owner: raise at MVP-scope-review time, or fix opportunistically if a future Sprint's Scenarios
   actually need it.
3. **Continue reusing the "recognize an existing generic mechanism first" instinct from Task 10**
   before adding a new domain attribute or UI element — it worked cleanly this Sprint and is worth
   deliberately checking for on every future task, not just noticing when it happens to apply.
