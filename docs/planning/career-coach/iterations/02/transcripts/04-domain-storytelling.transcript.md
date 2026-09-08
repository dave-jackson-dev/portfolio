# Domain Storytelling — Iteration 02 (Story 2 re-run) — Transcript

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Companion to** [`04-domain-storytelling.md`](../04-domain-storytelling.md).
> **Date:** 2026-08-13 · **Attempt:** 1
>
> The artifact records what was decided. **This records what was rejected, and why.**

## Facilitation note

Step 6 calls for spawning the `architect` subagent. This session carries a standing instruction not
to use the Agent tool unless asked, so the lenses were applied directly and the founder was told
before decisions were put to them. Same deviation as Architecture Design, recorded for the same
reason.

**egon.io was used, not substituted.** Step 7 permits Mermaid for a story authored from a Story Map
in one session, but Iteration 01 produced a real `.egn` for this same story, and dropping to Mermaid
for its successor would have left the corpus with one story in two formats. Both `.egn` files reuse
Iteration 01's icon set so they open unchanged. Mermaid appears in the markdown for readability
only.

---

## Story shape

**Chosen:** two separate domain stories, 2a and 2b.

| Rejected                            | Why                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One story, two System Actors        | Closer to the Story Map's single CC-004 backbone activity, and reads as one capability from the Job Seeker's side. Rejected because the two mechanisms' **rules and failure modes differ** — one story's rule list would mix "cannot discover" with "may be blocked by anti-bot", which belong to different actors. |
| One story, revise the activity verb | Smallest possible edit — keep one actor, replace _"drives session on"_ with something covering both. Rejected because it re-creates precisely the ambiguity AD-1 rejected: you could not tell which mechanism produced a Position, and the hypotheses would have nothing specific to attach to.                     |

**What made the difference:** the split is what keeps the hypotheses attributable. With one story,
2a shipping would read as progress against risks only 2b carries.

---

## Partial pass

**Chosen:** partial success — keep what was found, record the failure.

| Rejected                                    | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pass fails atomically                       | Simpler to reason about, never leaves a half-populated feed. Rejected on two grounds: it would require changing shipped behaviour, and one dead board token would block sourcing entirely — which is how the golden path became unwalkable in the first place.                                                                                                                                                                                                                                                                                                                                                                                           |
| Partial success **and tell the Job Seeker** | Strongest option for trust, and the best early warning for a stale company list. Not rejected on merit — deferred: there is no mechanism to carry pass-level outcome back to the UI, and inventing one here would have exceeded this workshop's remit. **Worth revisiting when the feed grows pass-level state.** → ✅ **Came due at UX Design (2026-08-13).** 2a-S3 and 2b-S2 both assert a failure is _recorded_, and a record nobody can see is indistinguishable from no record — so the Sourcing Pass Outcome screen was designed, and the missing mechanism is now an explicit input to MVP Planning. See [`07-ux-design.md`](../07-ux-design.md). |

---

## Missing salary

**Chosen:** qualify on everything else; flag salary unknown.

| Rejected                              | Why                                                                                                                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hold until the description is fetched | Most rigorous — qualification never judges on incomplete data. Rejected because it blocks the entire feed on AD-4 landing; on today's data that is 667 unqualifiable Positions.                           |
| Treat missing salary as failing       | Defensible logic: the Position cannot demonstrate it meets the requirement. Rejected on arithmetic — it rejects **667 of 667** real roles, which makes it wrong as a default however sound the reasoning. |

🔴 **This rule constrains Story 3, not Story 2**, and it contradicts the shipped specification:
⚠️ **This paragraph was factually wrong, and is left in place with the correction beside it.**
Three Amigos read the Gherkin on 2026-08-13 and found Feature 3 rejects `POS-2202` for _failing
remote-only_ — its salary passes, and no Scenario exercised salary as a rejection reason at all.
DS-3 therefore fills a hole rather than contradicting anything. As written at the time:

> Workshop 6's Feature 3 rejects `POS-2202` on a salary requirement without distinguishing **absent**
> from **insufficient**. Flagged for Three Amigos rather than quietly fixed here — Gherkin composition
> is that workshop's job, and editing its output from this one is exactly the boundary violation the
> workshops standard warns about.

---

## Initiation

**Chosen:** both — schedule primary, Job Seeker's manual trigger the exception.

| Rejected                      | Why                                                                                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schedule only                 | Cleanest story and the strongest expression of the value proposition. Rejected because it would mean removing a capability that already ships and works, leaving no way to force a pass.    |
| Job Seeker only (leave as-is) | Least churn. Rejected because the schedule changes **who is in control and when Positions appear** — precisely the kind of thing a domain story should carry, not an implementation detail. |

---

## Deliberately left alone

- **Stories 1 and 3–6 were not re-run.** Only Story 2 was falsified. Re-telling the others would
  have produced churn without new information — though Story 3 now carries a rule it did not
  author, recorded above and handed to Three Amigos.
- **The Story Map's CC-004 wording** — _"from LinkedIn, Job Boards, and Company Career Sites"_ —
  still describes 2b accurately and 2a only loosely, since 2a reaches named company boards rather
  than those three surfaces. Left unedited: the Story Map is Workshop 3's artifact, and the
  discrepancy is visible from here rather than silently reconciled. **Stale but harmless**, as
  distinct from unchecked.
