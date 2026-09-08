# MVP Planning — Iteration 02 — Transcript

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Companion to** [`08-mvp-plan.md`](../08-mvp-plan.md).
> **Date:** 2026-08-13 · **Attempt:** 1
>
> The artifact records what was decided. **This records what was rejected, and why.**

## Facilitation note

Step 5 calls for spawning the `product-owner` subagent. This session carries a standing instruction
not to use the Agent tool unless asked, so the lens was applied directly. Same deviation as
Workshops 4–7, recorded for the same reason.

---

## The hypothesis decision — the one that mattered

**Chosen:** a scoped, disposable spike answering H1 and H3, with production Feature 2b deferred to
Iteration 03.

| Rejected                                     | Why                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build production 2b this iteration           | Validates both hypotheses for real _and_ ships the capability. Rejected because it commits to the AD-1/AD-2 architecture — new worker app, Debian base image, ingest endpoint, port split — **before either hypothesis has an answer.** If anti-bot turns out prohibitive, a meaningful part of that build is waste.            |
| Defer 2b entirely and ship the data/UX items | The most immediately useful option for someone using the app daily. 🔴 Rejected: H1 and H3 would go untested for a **second consecutive iteration**, which is the precise failure Iteration 01 closed on record. Step 7 would have required this be recorded as an explicit acceptance, and it was not what the founder wanted. |

**What made the difference:** a hypothesis is a thing you test, and the cheapest test that produces
a real observation beats both "build the production shape and find out" and "defer again". This is
also what Architecture Design itself floated — _"a spike that is explicitly thrown away may beat
committing to either"_ — recorded there and picked up here rather than re-derived.

---

## Two costs discovered during the workshop

Both changed the cut. Neither was visible from the artifacts alone.

### UX-4's provenance badge is not a badge

It looked like a UI addition. `Position` has **no provenance field** — not in the entity, not in
`iam.schema.typeql`. So it needs a domain change _and_ an additive edit to the **shared** platform
schema, which is the cross-project consequence AD-4 deliberately avoided.

**Considered and rejected: shipping it anyway as part of the feed polish.** Beyond the cost, it is
**meaningless with one mechanism** — every card would read `Board API`. It now travels with 2b,
where it earns its place.

### The Register's validation method was not falsifiable

H1's method read _"Resolved at the Architecture Design workshop"_. Architecture Design ran, and did
rule that sourcing proceeds — so the entry looked handled while nothing had been tested. **That
sentence is a large part of how Iteration 01 got this wrong**, and leaving it in place would have
let the same thing happen a third time.

**Considered and rejected: updating only the status column.** Flipping `Unvalidated` to `Scheduled`
without touching the method would have left the same trap for whoever reads it next. The method is
rewritten to name a recorded observation, and H3's — _"only resolved if/when … implementation
begins"_ — was rewritten too, because as written it could **never fire** while sourcing stayed
behind a stub.

---

## The rest of the cut

**Chosen:** all four remaining items ship — salary badge, qualification breakdown, pass outcome,
description store.

**Recorded honestly rather than talked up:** this is a large iteration, and item 4 alone is
substantial. The artifact says so. MVP Planning's job is to draw a cut, and a cut that defers
nothing is not a cut — so the transcript notes what genuinely _is_ deferred: production 2b, the
schema change it carries, UX-4, and Feature 2b's Scenarios as production behaviour.

**Considered and rejected: trimming one of the four to make the iteration comfortable.** No single
item was the obvious one to drop — the salary badge is nearly free, the breakdown makes "Qualified"
honest on data that is _already_ wrong today, the pass outcome closes a deferral that has now come
due twice, and the description store is what makes salary requirements work at all. Sequencing is
Workshop 9's instrument for this, and it is the right one; silently dropping scope here would have
pre-empted it.

---

## Sequencing calls

- **Item 2 before item 4** — the per-requirement breakdown is about the **absent** case, true today
  on every real Position. Considered and rejected: gating it behind the description store, which
  would have delayed an honest "Qualified" for no reason.
- **Item 5 early** — it is the only item whose outcome _changes later scope_. Running it last would
  mean planning Iteration 03 without its answer, which is most of its value.
- **Item 4 last** — largest, and the only one carrying an external obligation (Lever's
  `Crawl-delay: 1`, ~570 Greenhouse calls per pass).

---

## Deliberately left alone

- **The Story Map's Sprint 7/8 deferrals** (Interview Prep, Negotiation) — Release 2 by the original
  MVP Planning cut, untouched by anything this iteration learned.
- **The BMC's Customer Segment and Value Proposition.** Sourcing is now half-real, which moves the
  VP closer to deliverable, but "roles I would never have found" still needs discovery. Revisiting
  the VP belongs to whichever iteration ships 2b.
- **H2's disposition.** Resolved by AD3's decision in Iteration 01 and not reopened — a hypothesis
  answered by deciding not to take the risk is answered, and re-litigating it would be churn.
