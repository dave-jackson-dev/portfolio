# Sprint 2 Retrospective — Career Coach Iteration 02

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-08-13

---

## What went well?

- **The `SourcingResult` discriminated union was the right domain design.** Making refusal
  structurally distinct from a completed pass (`{ kind: 'refused', provider }` vs
  `{ kind: 'completed', boardResults }`) made invalid states impossible in the handler — no
  `if (refusedProvider)` guard needed, TypeScript narrowed the shape. The adapter interface
  change cascaded across eight files but every break was a compile-time catch, not a runtime
  defect.

- **C-3a plumbing paid off immediately.** Sprint 1's forward-compatible adapter (parse
  `requirementOutcomes` when present, default to absent) meant C-3b shipped with zero adapter
  changes — only the prompt and the harness. The pattern proved itself.

- **The PromptOS A/B harness is genuinely load-bearing, not just procedural.** Running it
  before promoting `position-qualification-agent.md` answered "does the added schema field
  cost anything?" with a number (100%/100%, +0.0%) rather than a guess. The harness is reusable
  for any future prompt revision at zero marginal cost.

- **Phase D (browser spike) took 5 minutes and answered a question that had been open since
  Iteration 01.** H1 and H3 were recorded as "Unvalidated — SCHEDULED" for an entire iteration.
  The observation validated both in a single Playwright call. The previous validation method
  ("Resolved at the Architecture Design workshop") was a real anti-pattern — a workshop deciding
  to proceed is not a validation.

- **The retro action item (E-7) was actioned in the same sprint.** `QUALIFICATION_FIXTURE_VERDICTS`
  was a two-file problem identified in Sprint 1's retro, and it was eliminated in Sprint 2 rather
  than left as an open item. Action items that slip to a parking lot tend to stay there.

## What could be improved?

- **Lever's `fetchDescription()` is a stub (`return null`)** — the list endpoint returns
  `descriptionPlain` but the adapter doesn't thread it through to `fetchDescription`. Lever
  salary extraction from descriptions therefore doesn't fire. This is tracked but was a conscious
  scope decision (the comment says "TODO: Thread descriptionPlain through from fetchPositions").

- **The Cerebras A/B harness uses `gpt-oss-120b` not `claude-opus-4-8`** — the provider mismatch
  between the harness (Cerebras) and the production qualification adapter (Anthropic) is a
  limitation. The harness measures structural conformance (does the prompt add `requirementOutcomes`
  without losing accuracy), not provider-specific behaviour. For a production-critical prompt
  revision, the harness should match the production provider. Anthropic credits were exhausted at
  the time of measurement.

- **`CouchDbPositionDescriptionRepository` is not covered by the Cucumber suite.** The description
  store is opt-in via env var, and there is no `content-authoring-infrastructure`-style
  testcontainer for CouchDB in the career-coach tests. The implementation is exercised in production
  only; a defect there would surface as missing descriptions rather than a test failure.

- **`IPositionSourcingPort` interface change was a broad mechanical refactor** — eight files
  touched for what was a clean domain design decision. A narrower initial abstraction (returning
  candidates directly) made the refactor necessary. For future port changes, the discriminated-union
  shape should be in the initial design, not retrofitted.

## Action items

| Item                                                                                      | Owner    |
| ----------------------------------------------------------------------------------------- | -------- |
| Thread `descriptionPlain` from `LeverBoardSource.fetchPositions` into `fetchDescription`  | Sprint 3 |
| Add CouchDB testcontainer to `career-coach-infrastructure` for description store coverage | Sprint 3 |
| Top up Anthropic credits; re-run A/B harness against production provider before next C-3x | Founder  |
