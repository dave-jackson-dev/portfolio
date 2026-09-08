# Three Amigos — Iteration 02 — Transcript

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

> **Companion to** [`06-three-amigos.md`](../06-three-amigos.md).
> **Date:** 2026-08-13 · **Attempt:** 1
>
> The artifact records what was decided. **This records what was rejected, and why.**

## Facilitation note

Step 6 calls for spawning `product-owner`, `developer` and `qa-tester` as a three-role ceremony.
This session carries a standing instruction not to use the Agent tool unless asked, so the three
lenses were applied directly — and the qa-tester lens's two mandatory self-reviews (Steps 8 and 9)
were run explicitly and their results written into the artifact rather than merely performed. Same
deviation as Workshops 4 and 5, recorded for the same reason.

---

## The correction that came first

Four documents in this iteration — the scope proposal, the Architecture Design transcript, and two
PR bodies — asserted that Feature 3 _"rejects `POS-2202` against a `$150,000-$180,000` salary
requirement"_.

**Reading the Gherkin showed otherwise.** `POS-2202` is hybrid at `$155,000` and is rejected for
_"fails remote-only requirement"_ — its salary **passes**. No Scenario anywhere exercises salary as
a rejection reason.

**Why it matters, and why it is in the artifact rather than only here:** the claim changed what this
workshop was for. "DS-3 contradicts Feature 3" implies fixing a Scenario; "no Scenario covers absent
salary" means adding one. The second is true. It propagated through four documents because each
restated the previous rather than opening the file.

---

## Feature shape

**Chosen:** two Features, 2a and 2b, mirroring DS-1's two stories.

| Rejected                                    | Why                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One Feature with both mechanisms' Scenarios | Fewer files, and CC-004 is one Story Card. Rejected because the Feature narrative would have to describe both "boards I named" and "companies I never named" — which is one sentence covering two different promises, and the automation hypotheses would again have nothing specific to attach to. |
| Amend Iteration 01's Feature 2 in place     | Smallest diff. Rejected: Iteration 01's Feature 2 is the specification for what shipped in Sprint 2 and is referenced by the api-e2e suite. Overwriting it would erase the record of what was actually built.                                                                                       |

---

## De-duplication Scenario design

**Chosen:** both requisitions arrive in the **same** pass.

| Rejected                                            | Why                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Given a previous pass already sourced gh-8077887…" | Closer to Iteration 01's phrasing and to how it happens in life. Rejected because it makes the Scenario depend on another Scenario's outcome — the precise Step 9 hazard, and the one that cost the Developer Portal an unplanned pull-forward. Same-pass phrasing is independently runnable. |

The cross-**mechanism** duplicate in Feature 2b could **not** be written this way — it genuinely
needs a Position that only Feature 2a produces. That dependency is flagged in the artifact rather
than engineered away, because engineering it away would have meant pretending 2b can create the
precondition itself.

---

## Zero-Trust tagging

**Chosen:** 2 tagged, 2 deliberately untagged, with the reasoning recorded per Scenario.

The interesting call is _"I CANNOT start a sourcing pass with a misconfigured board list"_. It was
**considered for the tag and rejected**: an administrator hits it identically, so it is refused for
_what you sent_, not _who you are_. It is an `error` case.

That Scenario is exactly the failure mode the tagging standard documents — it contains "CANNOT" and
"refused", so a regex over prose would have counted it as a security boundary and inflated the
Zero-Trust number with a configuration check.

**Considered and rejected:** adding a cross-user Zero-Trust Scenario ("I CANNOT source Positions
into another Job Seeker's feed"). career-coach is an explicitly single-user tool — the BMC decision —
and `Position` carries no owner attribute at all, which the schema comments state deliberately.
Writing that Scenario would specify an isolation boundary the domain does not have.

---

## Deliberately not composed

- **A stated-but-insufficient salary Scenario.** DS-3 distinguishes absent from insufficient, and
  only the absent half was surfaced by Domain Storytelling. Composing the other half here would be
  inventing specification this iteration never surfaced — the Gherkin-composition boundary running
  in the other direction.
- **Scenarios for Features 1 and 4–6.** Unchanged by this iteration; re-composing them would create
  churn and risk drift against the api-e2e suite that already implements them.
- **Anything about rate limiting or politeness delays.** Real and undesigned, but they belong to
  the browser worker's own scoping, and no domain story has surfaced a rule for them yet. Recorded
  in the AD artifact's open items instead.
