# Architecture Design — Iteration 02 — Transcript

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Companion to** [`05-architecture-design.md`](../05-architecture-design.md).
> **Date:** 2026-08-13 · **Attempt:** 1
>
> The artifact records what was decided. **This records what was rejected, and why** — founder
> directive 2026-07-30, after prior iterations kept artifacts only and discarded the
> options-not-taken.

## Facilitation note

The workshop's step 6 calls for spawning the `architect` subagent as primary facilitator. This
session carries a standing instruction not to use the Agent tool unless asked, so the architect /
developer / SRE lenses were applied directly instead, and the founder was told so before any
decision was put to them. Recorded because it is a deviation from the Skill, not because it changed
an outcome.

---

## AD-1 — Sourcing actor

**Chosen:** two System Actors, two ports; split deferred until the browser adapter exists.

| Rejected                               | Why                                                                                                                                                                                                                                           |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One `Sourcing Service`, two mechanisms | Matched the shipped code exactly and needed no new port. Rejected because it leaves no way to tell which mechanism produced a Position — and the automation hypotheses attach to only one of them. That is the Iteration 01 failure restated. |
| One port, composite adapter internally | Least disruption to the application layer. Rejected for the same reason, more strongly: it hides the distinction _inside_ infrastructure, so even the port cannot report which mechanism ran.                                                 |
| Splitting the port immediately         | Considered and explicitly deferred by the founder. Would produce one port with an adapter and one with nothing behind it — machinery ahead of need. The decision is recorded, so the deferral costs nothing but a later rename.               |

**What made the difference:** the two mechanisms answer different questions. "Every role at
companies I named" is not "roles I would never have found", and the BMC promise is the second.

---

## AD-2 — Worker persistence

**Chosen:** the worker posts to an internal `career-coach-api` endpoint.

| Rejected                                          | Why                                                                                                                                                                                                                                                                               |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worker writes to TypeDB via the shared repository | Simplest and fastest — reuses `career-coach-infrastructure` wholesale. Rejected on a **standing founder directive**: no SaaS service queries the IAM TypeDB database directly. Also creates a second writer to one store.                                                         |
| Worker publishes events the api consumes          | Best decoupling, and the natural fit if sourcing later grows retries and partial passes. Rejected as premature: there is **no queue infrastructure in the repo at all**, so the transport would have to be chosen and stood up first — a larger decision than the one being made. |

**Left open deliberately:** if sourcing does grow retries/partial passes, the event option should be
revisited rather than bolted onto the HTTP endpoint.

---

## AD-3 — Relevance filtering

**Chosen:** filter at query time in `ListPositionsQuery`.

| Rejected                                   | Why                                                                                                                                                                                                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Configured role-keyword filter in sourcing | Keeps storage and the feed small with an operational knob, and does not breach the sourcing/qualification boundary. Rejected because it discards postings at fetch time — a requirements change could not recover them without re-sourcing.               |
| Requirement-aware sourcing                 | Most efficient, and the most obviously "right" to a user. Rejected as an unmarked reversal of Iteration 01's boundary: it couples sourcing to `StrategyPlan`, and Story 4's feedback loop specifically depends on old Positions remaining re-qualifiable. |

---

## AD-4 — Position descriptions

**Chosen:** CouchDB+Nouveau. The 2026-07-26 reservation's trigger has fired.

This was the one decision the founder stopped to talk through rather than answer from the options as
first framed — correctly, because the framing was wrong.

**How the framing was wrong.** It was first put as "edit a shared platform lib's schema, yes or
no", with the cost presented as a one-line additive change. Both halves were true and together they
were misleading:

- The mechanical cost really is one line — `attribute description` already exists at
  `iam.schema.typeql:679` and two entities already own it.
- But the **decision had already been taken**, on 2026-07-26, with an explicit trigger:
  _"add that store only once a real story introduces the field."_ AD-4 is that story.

So the real question was never "is one line acceptable" but "has the trigger fired". Presenting it
as a schema-size question would have routed around a standing decision on the strength of the diff
being small.

| Rejected                                                 | Why                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeDB, narrowing the reservation to "search only"       | Genuinely arguable — the reservation names full-text **search**, and storing text for an LLM to read is not searching it. Rejected: it puts multi-KB blobs into a 50-entity identity database shared by six bounded contexts, and reinterpreting a prior decision to fit a convenient reading is how decisions erode here. |
| Persist nothing; pass descriptions through at fetch time | No schema change, no store, no blobs. Rejected on arithmetic: Greenhouse's list endpoint carries no description, so this needs a per-job call — roughly **570 extra requests per pass** on current volume — and re-qualification would mean re-fetching.                                                                   |

**Consequence withdrawn.** Because CouchDB was chosen, the cross-project change to
`libs/platform/shared/infrastructure/src/lib/iam.schema.typeql` is **not required**. It had been
isolated and put to the founder separately under the workshop's step 7d; the decision removed it
rather than approving it.

---

## The gap this workshop found and did not paper over

Iteration 02 has no `04-domain-storytelling.md`. Iteration 01's Story 2 names one System Actor that
_"drives session on"_ three sites — which the shipped JSON adapter does not do, and which AD-1 has
now split in two.

The workshop could have quietly traced its decisions to that story anyway. It does not: the artifact
opens with the gap, and re-running Domain Storytelling for Story 2 is carried out as a **blocking
prerequisite for Three Amigos**, which composes Gherkin directly from those diagrams.

**Considered and rejected:** running Domain Storytelling inline as part of this workshop. Rejected
because Domain Storytelling is its own founder-facilitated workshop with its own `stop-*`
acceptance, and absorbing it here would produce exactly the kind of unreviewed, folded-in artifact
that step 7d exists to prevent.
