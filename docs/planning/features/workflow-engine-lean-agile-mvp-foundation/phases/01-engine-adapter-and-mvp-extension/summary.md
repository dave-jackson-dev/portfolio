# Phase 01 — Engine Adapter and MVP Extension Baseline Summary

**Status:** Complete

## Baseline

Portfolio owns the Lean-Agile MVP extension. Its explicit states are hypothesis, experiment,
evidence, outcome, pivot, and persevere. The extension holds no PouchDB implementation and uses
the public Workflow Engine adapter only to start a workflow. It records explicit evidence
references and prevents a Service Account from making a human pivot-or-persevere decision.
A pivot must also return to hypothesis with a newly supplied, non-empty testable hypothesis.

The initial executable verification passes 9 BDD scenarios / 27 steps and the workflow-contract
fixture verification checks 26 source files.

The adapter emits `workflow extension transition` requests with extension identifier
`portfolio.lean-agile-mvp` and schema version `1.0.0`. The paired Singularity provider records
those requests as immutable audit events and was merged into `dev` through PR #1019 (`dd21bf26`)
after the required substrate parity gate passed.

## Delivery decision

Phase 01 delivers the Workflow Engine through its packaged VS Codium extension and local NestJS
sidecar. Portfolio retains its injected public-contract client so a future adapter can route either
to that local experience or to an online hosted service through Singularity Runtime Routing.

The current VSIX is intentionally an extension-host client, not a bundled cross-platform sidecar.
Its `workflowEngine.sidecar.command` setting must name the installed local sidecar executable.
The Phase 01 package smoke test must verify this configuration and lifecycle explicitly.

The package verification produced `/tmp/workflow-engine-vscodium-0.1.0.vsix` successfully. The
VSIX contains only extension-host assets; the sidecar is deliberately supplied through the
configured executable path.

## Phase outcome

The Phase 01 extension baseline, local VS Codium delivery, and engine-side immutable transition
recording are complete. A future phase may add Runtime Routing’s hosted transport without changing
this public contract.
