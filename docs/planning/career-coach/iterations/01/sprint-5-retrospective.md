# Sprint 5 Retrospective — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25

---

## What went well in turning stories green?

- **The three-aggregate architecture (AD2) held up on its first real test.** This Sprint
  introduced `Application` — the third aggregate, and the first genuinely new one since Sprint 1
  — and every established pattern (domain port + repository + stub adapter + controller +
  component) applied without modification. Architecture Design's upfront aggregate boundary
  decision paid off: nothing needed re-designing to accommodate a new aggregate four Sprints in.
- **The cross-Scenario state-leak class of bug was recognized and fixed fast, using an existing
  precedent.** When `Position.pursue()` broke three previously-green `position-api.feature`
  Scenarios, the fix wasn't invented from scratch — `domain-e2e` had already hit and fixed the
  identical bug class in Sprint 3 (Task 6a), and that fix's shape (`Before`-hook `clear()` on the
  in-memory repositories) transferred directly to `api-e2e`. Recognizing "this is the same bug we
  already have a fix pattern for" saved real debugging time.
- **A compliance agent's "high" finding was verified, not trusted** — the `code-review` agent
  claimed a TypeScript compile error that doesn't actually exist (structural typing allows fewer
  parameters in an implementing method). Checking it against two real, already-successful
  `nx build` runs rather than accepting the claim or reflexively "fixing" non-existent code kept
  the Sprint from wasting time chasing a phantom defect.

## What could be improved?

- **The `sprint-3-plan.md` Retrospective action item ("batch review the accumulating low-severity
  compliance backlog before Sprint 5/6") is now due and still not done.** It was flagged two
  Sprints ago specifically anticipating this moment — the backlog has kept growing every Sprint
  since (hardcoded dev-fixture auth, missing DOM-HTTP-Domain UI tests, ATDD naming, commit-message
  format, and now a `positionId`/`applicationId` validation-pipe gap) without ever getting the
  dedicated pass that was promised. Deferring it again risks it never actually happening.
- **Compliance agent severity is inconsistent across identical findings** — the hardcoded
  `CURRENT_USER_ID` pattern was scored "low" in Sprint 4 and "high" in Sprint 5 for the same
  underlying issue in sibling files. This isn't itself blocking, but it means severity alone can't
  be trusted to triage findings — the Sprint 4 Retrospective's action item (check for diff-drift
  before trusting a "high" finding) needs a sibling: also check whether an identical finding was
  previously scored differently before reacting to severity at face value.

## Action items

1. **Actually run the low-severity compliance backlog review before Sprint 6** — this was
   promised for "Sprint 5/6" two Sprints ago and Sprint 5 just ended without it happening. Owner:
   first item of Sprint 6, before new implementation work, not folded into Sprint 6's own
   feature scope.
2. **When a compliance finding's severity differs from an earlier Sprint's score for the
   identical pattern, treat the discrepancy itself as a signal to double-check the finding**,
   not just the drift check from Sprint 4's Retrospective. Owner: apply starting Sprint 6.
3. **Confirm whether Sprint 6 (Track My Applications, the last v1 Sprint) needs its own new
   aggregate work or purely extends `Application`'s existing pipeline states** — AD2 already
   defines the full `Submitted → Rejected|PhoneScreen → ... → Offer|NoOffer` state machine, so
   this should be an extension of Sprint 5's `Application` entity, not a new aggregate. Owner:
   Sprint 6 Planning, first item.
