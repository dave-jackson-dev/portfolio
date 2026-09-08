# Sprint 2 Retrospective — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25

---

## What went well in turning stories green?

- **The boundary-swap pattern (stub adapter now, real implementation later) scaled cleanly to a
  second, different kind of boundary.** Sprint 1 deferred persistence (TypeDB); Sprint 2 deferred
  browser automation (Playwright/LinkedIn/job boards). Same shape both times: a domain-level port,
  a real (non-mocked) in-memory/fixture implementation behind it, and every layer above the port
  built and tested for real. The pattern held up under a materially higher-risk boundary (external
  site automation with real ToS/legal exposure) without needing to be reinvented.
- **Reusing Sprint 1's already-decided compliance categories instead of re-litigating them saved
  real time.** The post-Sprint compliance pass found the same two categories (hardcoded dev-fixture
  auth, missing DOM-HTTP-Domain UI Cucumber) — recognizing them as already-decided rather than
  re-opening the founder conversation kept the session moving without sacrificing rigor (both were
  still explicitly named and traced to their Sprint 1 decision, not silently waved through).
- **Per-step commit discipline held across all 13 tasks** — each layer (domain, application,
  domain-tier Cucumber, infrastructure, API, HTTP-Domain Cucumber, UI) landed as its own commit
  with a red-then-green ATDD story in the message, mirroring Sprint 1's discipline exactly.

## What could be improved?

- **Not every story has the same Zero-Trust shape.** Sprint 1's Retrospective action item said
  "add a Zero-Trust cross-actor scenario" as if it always means "user A can't see user B's data" —
  but `Position` has no per-user ownership dimension (it's a shared feed in this single-user tool),
  so that literal check doesn't apply. The actual applicable check turned out to be
  "unauthenticated access is rejected in production," a different shape of Zero-Trust entirely.
  This was caught and handled correctly this Sprint, but only because it was reasoned through
  explicitly — a checklist that just says "add a Zero-Trust scenario" without asking "what does
  Zero-Trust mean for _this_ story's actual data-ownership shape" risks a future session adding a
  scenario that doesn't test anything real.
- **CC-004 as literally written in the Story Map ("positions sourced automatically from LinkedIn...")
  is not what shipped this Sprint** — what shipped is the full pipeline around a deliberately
  stubbed boundary. This was handled with an explicit caveat in the Sprint Review, not silently,
  but it's worth naming as a retrospective point: when a story's headline capability is itself the
  deferred piece, "the story is Green" needs that caveat spelled out every time, not just once.

## Action items

1. **Amend the Definition of Ready's Zero-Trust checklist item** (`scrum-development-sprints.md`)
   to ask "what does Zero-Trust mean for this specific story's data-ownership shape" rather than
   defaulting to "add a cross-user scenario" — Owner: next `agents/methodologies/` maintenance
   pass, referencing this Sprint's Position-vs-StrategyPlan distinction as the concrete example.
2. **When Architecture Design resolves a story's headline capability into a deferred boundary
   (AD3-style), Sprint Review output must say so explicitly, every time that story is reviewed
   again** (e.g., if Sprint 3's Qualification story reads `Position` data sourced only via the
   stub) — Owner: carry into Sprint 3's Review.
3. **Schedule the real Playwright-driven `PositionSourcingPort` implementation as its own
   explicitly-scoped piece of work**, not an assumed "later sprint will just do it" — Owner: raise
   at MVP-scope-review time (before Sprint 3 if sourcing automation blocks anything downstream;
   confirmed it does not — Qualification reads whatever `Position`s already exist, stub or real).
