# Sprint 3 Retrospective — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25

---

## What went well in turning stories green?

- **The boundary-swap pattern held for a third distinct kind of boundary.** Sprint 1 deferred
  persistence (TypeDB); Sprint 2 deferred browser automation (Playwright); Sprint 3 deferred an
  NLP reasoning engine (Anthropic SDK-backed qualification). Same shape all three times: a
  domain-level port, a real deterministic fixture implementation behind it, every layer above
  proven for real. This Sprint's boundary carries the least tolerance for error of the three — a
  wrong qualification verdict is a worse failure mode than a wrong sourcing result — and the
  pattern still held without modification.
- **Sprint 2's Retrospective action item 2 (state the deferred-boundary caveat explicitly, every
  time the story is reviewed) was applied directly in this Sprint's Review**, not just remembered
  in principle — the caveat section names the exact reasoning gap being stubbed and why
  Architecture Design scoped it that way, rather than a one-line disclaimer.
- **The Sprint 2 Retrospective's more nuanced Zero-Trust framing (ask what the boundary means for
  _this_ story's data-ownership shape) was applied at Sprint Planning time, not discovered as a
  review-time gap** — Task 10a's Zero-Trust Scenario was written correctly on the first pass
  because Sprint Planning had already reasoned through "Position has no owner, but the
  StrategyPlan used to qualify it does."
- **Per-step commit discipline held across all 14 tasks (12 + 6a/10a)**, and a real
  cross-Scenario state-leak bug (shared in-memory repositories not cleared between Cucumber
  Scenarios, `POS-2201` colliding across Sprint 2's and Sprint 3's fixtures) was caught and fixed
  during Task 6a rather than papered over with a differently-numbered fixture ID — the actual root
  cause (missing test isolation) got fixed, not hidden.

## What could be improved?

- **A new low-severity gap was accepted without a concrete plan to close it**: the `positionId`
  path param has no validation pipe. It's consistent with the rest of the controller and correctly
  triaged as low severity, but "consistent with existing gaps" is exactly how a class of gap
  survives three Sprints unaddressed — this is the third Sprint in a row where a compliance
  finding gets accepted as "same category as before, not new" without a scheduled remediation
  Sprint.
- **The Sprint Planning → Review → Retrospective cycle for this Sprint ran back-to-back in one
  session**, same as Sprint 2 — useful for velocity, but it means the Daily Standup ceremony has
  only ever been exercised once per Sprint (a single log entry), never across multiple real
  working days. The `daily-standup` ceremony type itself remains under-exercised relative to the
  other three.

## Action items

1. **Schedule a dedicated "low-severity compliance backlog" review before Sprint 5 or 6** —
   collect the `positionId` validation-pipe gap, the ATDD Scenario-title naming sweep, and the
   commit-message-format deviation into one batch and either fix them together or formally accept
   them as permanent style, rather than letting each Sprint silently re-accept the same list —
   Owner: raise at next MVP-scope-review checkpoint.
2. **Confirm before Sprint 4 whether Qualification unblocks or depends on real
   Anthropic-SDK-backed evaluation** — this Sprint deferred it cleanly because nothing downstream
   needed it yet; check the User Story Map's next-priority slice (Sprint 4) for whether that
   assumption still holds — Owner: Sprint 4 Planning.
3. **Carry forward the "state the deferred-boundary caveat explicitly every time" discipline** —
   it worked as intended this Sprint; keep applying it to Sprint 4 and beyond, not just when a
   Retrospective action item is fresh.
