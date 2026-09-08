# Career Coach — Lean-Agile MVP Corpus

> 📦 **Ported from `singularity` on 2026-09-08.** Content unchanged; the only edits are per-file
> provenance banners and the unresolvable links, which are marked in place rather than redirected.
> Provenance and the rules that govern it:
> [ADR-002](../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

## Why this is here

🔴 **This is the only corpus in either repository whose "I CAN" statements were derived
story-first.** Career Coach was facilitated through the canonical nine-workshop sequence in
`singularity` — BMC → VPC → Story Map → Domain Storytelling → Architecture Design → Three Amigos →
UX Design → MVP Planning → Sprint 1 Planning — and then built and run through **six Scrum sprints**.

That direction is the whole point. LeanAgileOS ADR-051 (*Zero Trust authorization derives from the
"I CAN" declaration*) records that its own six `.feature` files have personas *"reverse-engineered
from code rather than derived from a Story Map, which is the opposite direction to Decision 1"*, and
says the derivation *"is only proven where the story came first."*

**Here, the story came first.** Re-running the workshops to produce a second, competing set of
artifacts would have destroyed exactly the property that makes this corpus worth having — and is
what [the architecture specification](../../architecture/portfolio-architecture-spec.md) warns
against in terms.

## What the corpus holds

| Iteration | Status | Workshop artifacts | Notes |
| --- | --- | --- | --- |
| [`01`](iterations/01/) | ✅ Complete (2026-07-24 → 2026-08-12) | All nine, plus provisioning, a compliance review and a full rollup | Six Scrum sprints ran against it |
| [`02`](iterations/02/) | ⚠️ **In progress** — not closed | Workshops 04–09 plus a scope proposal and evidence | Iteration 01 links forward into it, which is why both are here |

### Where the declarations actually live

⚠️ **A raw `grep -c "I CAN"` over the corpus returns 81, and that number is misleading.** Only the
workshop artifacts *declare*; the sprint records **cite** what was already declared. The
authoritative count is **52**:

| Artifact | Declarations |
| --- | ---: |
| `01/03-user-story-map.md` | 21 |
| `02/06-three-amigos.md` | 19 |
| `01/06-three-amigos.md` | 9 |
| `01/02-vpc-job-seeker.md` | 2 |
| `01/01-bmc.md` | 1 |
| **Total** | **52** |

The remaining 29 occurrences are in sprint plans, statuses, reviews and retrospectives, restating a
statement the Story Map or Three Amigos already owns. **Counting those as declarations would inflate
the corpus with its own echoes** — the same class of error as counting a comment as a check.

## 🔴 What this corpus is *not*

**It is not the Portfolio "Career Coach example."** Two different products share the name:

| | Segment | Scope |
| --- | --- | --- |
| **This corpus** | *"Senior Software Engineer — Job Seeker (MVP, solo)"* | Full hosted product: sourcing, qualification, application automation, interview prep, negotiation |
| **Portfolio's example** | a signed-in **Visitor** | *"one focused coaching session and a generated, editable action plan"* — and [the scope doc](../interactive-examples-scope.md) explicitly **defers** "Full Career Coach product features" |

Different actors, different value propositions, different boundaries. **A permission tuple derived
from this corpus authorizes the product, not the demo surface**, and conflating them would grant a
portfolio visitor the job-seeker's capabilities.

## Reading it

Links pointing outside this corpus resolve only in a `singularity` checkout and are **not ported**.
They are left as written rather than redirected, because the two repositories number their ADRs
independently — `singularity`'s ADR-016 is *Diagram Tooling*, `lean-agile-os`'s ADR-016 is *SCM
Lifecycle Operations* — so a rewritten link would point confidently at an unrelated decision.
