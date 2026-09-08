# Sprint 1 Retrospective — Career Coach Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-08-13

---

## What went well?

- **The C-3a/C-3b split was the right call.** Separating "parse outcomes when present" (C-3a,
  no prompt change) from "emit outcomes from the prompt" (C-3b, Sprint 2) let the whole
  qualification breakdown ship without blocking on the PromptOS A/B harness, which has no
  runnable implementation. The plumbing is forward-compatible — when C-3b lands, the adapter is
  already ready.

- **DS-3 surfaced a real UX problem, not just a test case.** Before F3-S1, a `Qualified`
  badge on a no-salary position overstated what was verified. The `NotEvaluated` third treatment
  and the summary line are the honest answer to that. Writing the spec before the UI made the
  design problem visible before any pixel was placed.

- **The API prefix defect was caught within the same sprint it was introduced.** The `HttpTestingController`
  limitation (it asserts what the service asks for, not what the server accepts) is a known
  trade-off of the DOM-tier approach, and it caught a real integration break in B-5 rather than
  letting it reach production undetected.

## What could be improved?

- **Angular 20's `ExpressionChangedAfterItHasBeenCheckedError` wasted a debugging cycle in C-5.**
  The root cause is calling `fixture.detectChanges()` after an HTTP flush against a component
  with computed properties. The fix (use component state assertions, not DOM re-renders) matches
  the project's existing `position-feed` pattern — but the pattern wasn't visible until the test
  failed. The convention should be documented once and referenced, not rediscovered.

- **The domain-e2e world has its own verdict map independent from `StubPositionQualificationAdapter`.**
  Adding `gh-9001` required two edits in two different files for the same fixture datum. This is
  the second time this duplication has cost time (POS-2201/2202/2203 also exist in both). A single
  source of truth — exporting the fixture map from `StubPositionQualificationAdapter` and importing
  it in `cucumber-world.ts` — would prevent future drift.

## Action items

| Item                                                                               | Owner         |
| ---------------------------------------------------------------------------------- | ------------- |
| Read the browser-automation target site's ToS and robots.txt; give go/no-go on D-2 | Founder (D-1) |
| Investigate extracting the shared qualification fixture map (avoid duplication)    | Next sprint   |
