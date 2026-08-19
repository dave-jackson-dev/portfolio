# Phase 03 — Event Ingress and Macro Authoring Summary

**Status:** In progress

The initial Phase 03 boundary deliberately does not replay event history. It first reduces approved
events through the Phase 02 recorder, then creates a separate approved macro version with explicit
input bindings and a disposable-workspace target. Replay calls the public Workflow Engine client
with new command envelopes only.

## Next unchecked item

Add provider-backed replay compatibility evidence after the public replay command is accepted.
