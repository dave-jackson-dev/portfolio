# Phase 01 — Engine Adapter and MVP Extension Baseline Summary

**Status:** In progress

## Baseline

Portfolio owns the Lean-Agile MVP extension. Its explicit states are hypothesis, experiment,
evidence, outcome, pivot, and persevere. The extension holds no PouchDB implementation and uses
the public Workflow Engine adapter only to start a workflow. It records explicit evidence
references and prevents a Service Account from making a human pivot-or-persevere decision.
A pivot must also return to hypothesis with a newly supplied, non-empty testable hypothesis.

The initial executable verification passes 8 BDD scenarios / 24 steps and the workflow-contract
fixture verification checks 26 source files.

## Current constraint

`@singularity/workflow-engine` is package-tested but has not been released to a public registry or
delivered as a hosted endpoint. The Portfolio production composition root therefore remains
unbound by design; it must not depend on a developer-local sibling path. Phase 01 can complete the
real binding after an approved delivery channel is selected.

## Next unchecked item

Choose and implement the production delivery channel: a published package artifact or hosted
adapter endpoint. Then bind Portfolio's composition root and replace the injected client test
double with a real compatibility test.
