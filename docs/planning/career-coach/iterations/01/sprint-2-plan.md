# Sprint 2 Plan — Career Coach, Iteration 01

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-07-25
**Activity:** Source Positions (Story Map Sprint 2 of 8)
**Story:** CC-004 — Source Positions from LinkedIn, Job Boards, and Company Career Sites

---

## Sprint Goal

By the end of this Sprint, CC-004's two Three Amigos Scenarios
(`06-three-amigos.md` Feature 2) are Green:

1. **Source a new Position from a job board** — a `Position` is created with status `Sourced`.
2. **De-duplicate a Position found on multiple sites** — the same real-world posting found again
   via a different site does not create a second record.

**Explicit scope decision (founder-confirmed 2026-07-25):** the actual Playwright-driven browser
automation against LinkedIn/job boards/career sites (AD2's `PositionSourcingPort` →
`SourcingService`) is **not** built this Sprint. This Sprint builds the domain/application/
infrastructure/API/UI layers backed by a stub, fixture-based `PositionSourcingPort`
implementation returning canned postings — the same "swap the boundary implementation, not the
whole feature" pattern Sprint 1 used for persistence (in-memory today, real TypeDB later). Real
site automation becomes its own explicitly-scoped later piece of work, given the CAPTCHA/anti-bot
handling and per-site parsing questions `05-architecture-design.md`'s Open Items table already
flags as unresolved.

## Task Breakdown

| #   | Task                                                                                                                                                           | Layer                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1   | `Position` entity — `positionId`, `title`, `company`, `location`, `salaryRange?`, `status` (`Sourced`), `dedupeKey`                                            | Domain               |
| 2   | `IPositionRepository` port — `save`, `findByDedupeKey`, `findAll`                                                                                              | Domain               |
| 3   | `IPositionSourcingPort` port — abstract, returns candidate postings; no Playwright import in domain (AD2 Dependency Rule)                                      | Domain               |
| 4   | Domain unit tests — entity construction, dedupe-key equality                                                                                                   | Domain               |
| 5   | `SourcePositionsCommand`/Handler — calls `IPositionSourcingPort`, dedupes via `IPositionRepository.findByDedupeKey`, saves new `Position`s                     | Application          |
| 6   | `ListPositionsQuery`/Handler — returns all sourced positions                                                                                                   | Application          |
| 7   | Application unit tests                                                                                                                                         | Application          |
| 7a  | Domain-tier Cucumber for Three Amigos Feature 2 (2 Scenarios) — real `CommandBus`/`QueryBus`, real in-memory `PositionRepository`, stub `PositionSourcingPort` | Domain-tier Cucumber |
| 8   | `InMemoryPositionRepository`                                                                                                                                   | Infrastructure       |
| 9   | `StubPositionSourcingAdapter` — fixture data (no live network calls)                                                                                           | Infrastructure       |
| 10  | `PositionController` — `POST /positions/source`, `GET /positions`, behind `RequireUserIdGuard` (Zero Trust, CC-000-ZT)                                         | API                  |
| 11  | Controller smoke tests                                                                                                                                         | API                  |
| 11a | HTTP-Domain Cucumber for `/positions` endpoints                                                                                                                | HTTP-Domain Cucumber |
| 12  | `PositionFeedComponent` — list view + "Source New Positions" action, per `07-ux-design.md`'s Position Feed mockup                                              | Feature (UI)         |
| 13  | Component smoke tests                                                                                                                                          | Feature (UI)         |

Persistence remains in-memory (same Provision Environment Pillar 2 deferral as Sprint 1) —
carried forward, not re-litigated.

## Definition of Ready check (per `scrum-development-sprints.md`)

- [x] "I CAN" capability statement — CC-004 in `03-user-story-map.md`
- [x] Given-When-Then specs (happy path + de-dup edge case) — `06-three-amigos.md` Feature 2
- [x] Zero Trust boundary — Task 11a added a dedicated Scenario to `PositionController`'s
      HTTP-Domain Cucumber suite ("An unauthenticated request is rejected in production").
      Position has no per-user ownership dimension (unlike `StrategyPlan`), so the applicable
      Zero-Trust check is production-mode unauthenticated-access rejection, not cross-user access
      — see Sprint 2 Retrospective for why this distinction matters.
- [x] Domain model references use Ubiquitous Language (`Position`, `Sourced`, `SourcingService`)
- [x] Golden Thread: story title "Source Positions" = feature name "Source Positions" = command
      `SourcePositionsCommand`
