# Phase 03 — Event Ingress and Macro Authoring Summary

**Status:** Complete

The initial Phase 03 boundary deliberately does not replay event history. It first reduces approved
events through the Phase 02 recorder, then creates a separate approved macro version with explicit
input bindings and a disposable-workspace target. Replay calls the public Workflow Engine client
with new command envelopes only.

## Phase outcome

The generic Workflow Engine provider accepts the same replay contract through `workflow macro
replay` (Singularity PR #1021, merge commit `393ed6e4`). It requires a matching disposable
workspace and dispatches only the allowlisted fresh commands supplied by Portfolio.
