# Sprint 1 Retrospective — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25

---

## What went well in turning stories green?

- **Real ATDD discipline held across every layer.** Task 6 (`RequirementSet`) was a genuine
  failing-spec-first cycle, and the domain-tier and HTTP-Domain Cucumber suites were both written
  against real (non-mocked) collaborators — the in-memory repository is a genuine implementation
  of the port, not a stub. When the compliance pass later needed a fix (auth guard), the same
  pattern held: guard unit test + 2 new Cucumber regression scenarios, not just a manual check.
- **Deferrals were made explicitly and stayed made.** In-memory persistence, full platform-iam
  integration, and the DOM-HTTP-Domain UI test were each raised, discussed with the founder, and
  recorded — none were silently dropped or silently expanded into unplanned scope. When "fix
  everything remaining" surfaced a path that would have meant inventing new dev infrastructure
  (a standalone proxy config no other app in the repo uses) or rewriting pushed git history, both
  were stopped and handed back to the founder as explicit decisions rather than guessed.
- **The compliance pass caught a real defect, not just style noise.** The authorization gap
  (any caller could act on any user's Strategy Plan) was a genuine Zero-Trust spec gap the
  original Three Amigos Gherkin missed — worth having a mechanism that catches this class of
  thing even when the team believes a story is done.

## What could be improved?

- **The Definition of Ready's Zero-Trust requirement (item 2: "happy paths, edge cases, errors,
  Zero Trust") didn't catch the missing authorization scenario at Three Amigos time.**
  `06-three-amigos.md`'s Feature 1 Gherkin has no "I CANNOT" scenario for cross-user access — it
  was only found post-implementation, by an automated compliance pass, not by the workshop
  discipline meant to catch it.
- **The compliance-review agents themselves had drifted from the current architecture** —
  `architecture-review.agent.md` and `ux-review.agent.md` both still encoded a pre-multi-app-era
  rule ("no new Angular apps outside `extensions/`", "no `Router` — VS Code webview only") that
  predates job-search/freelance-portal/content/career-coach all being legitimate `apps/` products.
  This produced real false-positive noise mid-session (the architecture agent passed once and
  failed once on the identical diff). This is the exact gap the parking lot's open
  `#project-idea` item ("routine review-and-update procedure for Agents, Skills, Methodologies,
  Standards, and Compliance agents") already names — this Sprint is a second concrete instance of
  it, not a new problem.
- **Nx-generator scaffold boilerplate (`/* eslint-disable */` in `global-setup.ts`/
  `global-teardown.ts`/`test-setup.ts`/`jest.config.cts`) is duplicated with the same unnecessary
  suppression across every `*-e2e` and lib project in the repo**, not just career-coach's. Fixing
  it here only where career-coach happened to touch those files leaves the same finding waiting
  in every other project's next compliance pass.

## Action items

1. **Add a mandatory "I CANNOT" / Zero-Trust cross-actor scenario to the Three Amigos workshop's
   own self-review checklist** for any story whose Gherkin includes an authenticated actor —
   not just a general reminder, a concrete checklist line. Owner: next Three Amigos workshop
   invocation (this project or another) should carry this forward; flag to
   `agents/methodologies/specification-by-example.md` maintainers.
2. **File a follow-up to reconcile the `06-three-amigos.md` Feature 1 Gherkin** with the
   authorization scenarios added post-hoc in `career-coach-api-e2e` — the canonical spec doc
   should reflect the real acceptance criteria, not just the test suite. Owner: before Sprint 2's
   Three Amigos work for `Position`/`Application`.
3. **Scope the parking lot's compliance-agent-drift review process** (already tracked,
   `#project-idea`, 2026-07-24) — this Sprint is now two concrete instances of the same gap in one
   project's lifetime. Owner: next session with idle capacity for a cross-cutting process item.
4. **Sweep the repo-wide `/* eslint-disable */` Nx-scaffold pattern as a tracked tech-debt item**,
   not fixed piecemeal per-project. Owner: add to `docs/sessions/parking-lot.tasks.md` as a
   `#tech-debt` entry (separate from this retrospective) before the next session that touches any
   `*-e2e` scaffolding.
