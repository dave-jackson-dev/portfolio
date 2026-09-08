# Sprint 6 Retrospective — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25

---

## What went well in turning stories green?

- **Recognizing when a pattern _doesn't_ apply was as valuable as reusing one that does.**
  Sprints 2-5 established a strong boundary-swap habit (stub adapter behind a new port); Sprint 6
  correctly recognized Story 6 named no System Actor and didn't force a port that wasn't needed.
  Getting this right required actually reading Domain Storytelling's Story 6 section rather than
  pattern-matching "new Sprint → new stub adapter" from the last four Sprints' momentum.
- **The Sprint 3/domain-e2e cross-Scenario-state-leak fix pattern transferred a second time**,
  this time preemptively — Task 7a's Background was written with "Strategy Plan PLAN-01 exists"
  included from the start (the exact gap that broke Sprints 5 and 6's _first_ attempts at their
  own Feature files), because the pattern was already fresh from Sprint 5's Retrospective. Where
  it _wasn't_ caught early (Feature 6's Background), the fix took under a minute because the root
  cause was already documented.
- **The compliance pass earned its keep twice in one Sprint** — a genuine broken-access-control
  gap (`GET /applications/:positionId`) and a genuine missing-smoke-test gap (`GET /applications`)
  were both real, both fixed with real Red-Green cycles, not waved through as "known category."
  Distinguishing these two real findings from the surrounding noise (severity-inconsistent
  restatements of already-decided deferrals) is exactly the discipline Sprint 5's Retrospective
  called for, applied under harder conditions (two compliance runs disagreeing with each other).

## What could be improved?

- **The compliance tool's severity scoring proved unreliable within a single Sprint, not just
  across Sprints.** Sprint 5's Retrospective flagged severity drift across Sprints 4/5/6; this
  Sprint saw the _same_ `CURRENT_USER_ID` finding scored differently across two runs of the _same_
  PR minutes apart, and one run's `code-review`/`process-review` agents both hallucinated a
  missing smoke test for an endpoint that has real, verifiable coverage. Trusting a single
  compliance run's output at face value — even a "critical" one — is now demonstrably risky
  without independent verification.
- **v1's full scope is now Green, but no session yet stepped back to verify the whole golden path
  end-to-end in one pass** — each Sprint verified its own slice, but "intake → build plan → source
  → qualify → feedback → pursue → apply → track" as a single continuous user journey has never
  been walked start to finish in one sitting. Six Sprints of slice-level Green isn't automatically
  the same claim as "v1 actually works end to end."

## Action items

1. **Before declaring v1 fully done (Environment Deployment or any launch-readiness claim), run
   one continuous walkthrough of the full golden path** — a single Job Seeker persona going
   through all six Sprints' capabilities in sequence, not per-Sprint verification. This is
   distinct from (and in addition to) the existing DOM-HTTP-Domain UI Cucumber gap already tracked
   in the parking lot.
2. **Treat compliance-tool findings as evidence to verify, not conclusions to act on directly** —
   this is now the third consecutive Sprint's Retrospective to independently arrive at this same
   lesson (Sprint 4: diff-drift; Sprint 5: severity inconsistency across Sprints; Sprint 6:
   severity inconsistency _and_ hallucinated findings within one Sprint). Worth consolidating into
   a standing note for whoever runs the compliance pass on any future Sprint, not re-discovering
   it a fourth time.
3. **When starting Sprint 7 (Interview Prep) or any Release 2 work, re-check whether Story 6's
   "no System Actor" pattern also applies there** — AD's own port table lists `InterviewPrepPort`
   for Story 7, so it likely doesn't, but confirming against Domain Storytelling directly (as this
   Sprint did) rather than assuming from the port table alone is the more reliable check.
