# UX Design — Iteration 02 — Transcript

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Companion to** [`07-ux-design.md`](../07-ux-design.md).
> **Date:** 2026-08-13 · **Attempt:** 1
>
> The artifact records what was decided. **This records what was rejected, and why.**

## Facilitation note

Step 6 calls for spawning the `ux-designer` subagent. This session carries a standing instruction
not to use the Agent tool unless asked, so the lens was applied directly. Same deviation as
Workshops 4, 5 and 6, recorded for the same reason.

**Mockups are real SVG**, per Step 8 — `rect`/`text`/`line`/`circle` with explicit coordinates,
matching Iteration 01's own 900×600 convention and palette so the two sets sit together. All three
parse as XML. No Mermaid was submitted as a mockup; the Mermaid in the artifact is the screen-flow
diagrams, which are Mermaid **by design**.

---

## Screen count

**Chosen:** three screens, plus one deliberately not designed.

| Rejected                                             | Why                                                                                                                                                                                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A fourth screen for the 401 / unauthenticated states | 2a-S7 and 2b-S4 both end at `the request is refused with 401`. Rejected: the platform shell's OIDC login already owns that surface, and designing a second one would invent a screen the domain does not have. Represented in the flows instead.          |
| Folding the pass outcome into the feed as a banner   | Fewer screens, and the founder would see failures without navigating. Rejected because 2a-S6's refusal state has **no per-board results at all** — nothing ran — so it cannot share a surface with a partial pass without implying boards were attempted. |
| A separate screen per failure kind (404 vs CAPTCHA)  | Rejected as a distinction without a difference for the reader: DS-2 makes both "a thing that did not respond, pass continues". They are rows with different labels, not different screens.                                                                |

---

## The `salary not published` treatment

**Chosen:** an amber badge on the card, and a third row treatment ("Not evaluated") on the
qualification result.

| Rejected                                       | Why                                                                                                                                                                                                                                                            |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leave the salary line blank                    | Simplest. Rejected because a blank reads as a rendering bug or an oversight, and on real data it would be **every single Position** — 0 of 667 carried a salary. Silence at that scale looks broken.                                                           |
| Show `—` or `n/a`                              | Conventional. Rejected as ambiguous between "nobody entered it", "we failed to read it", and "the board does not publish it". Only the third is true, and the badge says so.                                                                                   |
| Red / failure styling on the qualification row | Visually obvious. 🔴 Rejected outright: it would say the exact opposite of DS-3. Absent data is **not** a failed requirement, and reusing the failure treatment would re-introduce the reading DS-3 rejected on arithmetic (it rejects 667 of 667 real roles). |

---

## Provenance badges

**Chosen:** `Board API` and `Discovered` badges on every card.

**Considered and rejected: no provenance indicator at all.** It is the smaller feed and one less
concept. Rejected because AD-1 and DS-1 split the System Actor precisely so it stays visible which
mechanism produced a Position — and a feed that renders both identically **re-merges in the UI what
two workshops separated in the domain.** The hypotheses attach to discovery alone; if a reader
cannot tell which roles came from discovery, they cannot tell whether discovery is working.

---

## The pass-outcome screen, and a deferral now coming due

The Domain Storytelling transcript recorded "partial success **and tell the Job Seeker**" as
**deferred, not rejected** — there was no mechanism to carry pass-level outcome to the UI, and
inventing one would have exceeded that workshop's remit.

This workshop is where that comes due. 2a-S3 and 2b-S2 both assert that a failure is **recorded**,
and a record nobody can see is indistinguishable from no record. So the screen is designed, and the
missing mechanism is stated plainly as an input to MVP Planning rather than quietly assumed.

**Considered and rejected: designing around the gap** — e.g. showing only the new-Position count and
omitting failures entirely. That would have produced a screen that matches today's API and
contradicts the Gherkin. The Gherkin already says the system knows these facts; the API not
returning them yet is a build task, not a design constraint.

---

## Deliberately left alone

- **Iteration 01's seven mockups.** Only the feed changed, and only additively. Re-drawing the rest
  would create churn and risk drift from screens that already ship.
- **The visual design language.** Palette, spacing and the 900×600 frame are Iteration 01's; this
  workshop adds states, not a restyle. A redesign would be a decision nobody has asked for.
- **The filter control's own styling.** It shipped as a functional minimum on 2026-08-13 ahead of
  this workshop, deliberately — the founder was using the app and 184 unfiltered postings was the
  friction. The mockup shows where it lands visually; refining it is not urgent and is not pretended
  to be done here.
