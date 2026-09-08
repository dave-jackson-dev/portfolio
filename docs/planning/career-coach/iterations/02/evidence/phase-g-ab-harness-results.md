# Career Coach Qualification Agent — PromptOS A/B Evidence

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Date:** 2026-08-13 · **Harness:** `npm run career-coach-ab`
**Provider:** Cerebras · **Model:** `gpt-oss-120b` · **REPETITIONS:** 3 · **Temperature:** 0
**Battery:** 10 fixed cases (TC-01 through TC-10)

## Results

| Prompt                                                 | Accuracy       | Outcomes present |
| ------------------------------------------------------ | -------------- | ---------------- |
| Baseline (`position-qualification-agent.md`, pre-C-3b) | 10/10 = 100.0% | 0/10             |
| Proposed (C-3b — adds `requirementOutcomes` to schema) | 10/10 = 100.0% | 10/10            |
| **Delta**                                              | **+0.0%**      |                  |

## Verdict

**No regression. C-3b is safe to ship.**

- Status/rejection accuracy is identical (100% on both sides across 30 total calls per battery)
- `requirementOutcomes` is present in 100% of proposed responses and 0% of baseline responses
- PromptOS conformance: 0 blocking violations (`npm run promptos-conformance -- --changed`)

The proposed prompt was promoted to `position-qualification-agent.md` at this evidence recording.
