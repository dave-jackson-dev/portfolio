# ADR-002 — LeanAgileOS is the Upstream Platform

**Status:** Accepted

**Date:** 2026-09-08

**Deciders:** Dave Jackson

**Supersedes:** [ADR-001 — Workflow Engine Public Consumer Boundary](adr-001-workflow-engine-public-consumer-boundary.md), whose *boundary* stands and whose *counterparty* does not.

---

> 🔴 **Founder direction, 2026-09-08:** every external reference in Portfolio must point to
> `lean-agile-os`, not to `singularity`.

> ⚠️ **This record repoints the prose and does not repoint the code.** **Six** references in source and
> tooling still name `@singularity/workflow-engine`, and they still resolve. §4 says exactly which,
> and why moving them is a separate piece of work rather than a rename.

## Context

ADR-001 named Singularity as the provider of the Workflow Engine public contract, and every
architecture and planning document in this repository followed it. That was correct when it was
written on 2026-08-19.

It is no longer correct. **`singularity` is maintenance-only and `lean-agile-os` is its successor**,
and the Apparatus Port has been moving the platform's decisions, standards, methodology prompts and
role agents into `lean-agile-os` phase by phase. A Portfolio that keeps pointing at `singularity`
points at the repository that is being emptied.

### Why this could not be a find-and-replace

🔴 **The two repositories number their ADRs independently, and the same number means different
decisions.** `singularity` holds 85 ADRs; `lean-agile-os` holds 51. Renaming the word *Singularity*
would have silently repointed every citation at an unrelated decision:

| Cited as | In `singularity` | Same number in `lean-agile-os` |
| --- | --- | --- |
| ADR-032 | Organization Entity Platform Model | All operations go through a CQRS CLI |
| ADR-074 | Tracking-doc updates branch from and merge to `dev` | GitPort reads that carry their reason |

Each citation was therefore resolved **by subject**, not by number.

## Decision

### 1 — `lean-agile-os` is Portfolio's upstream platform

Every architectural, methodological and governance reference in this repository resolves against
`lean-agile-os`. Where a decision Portfolio depends on has not yet been ported, the reference says
so rather than pointing at `singularity` as though it were current.

### 2 — The three cross-repository ADR citations resolve as follows

| Portfolio cited | Now reads | Basis |
| --- | --- | --- |
| Singularity ADR-032 D4 — `type:domain` libs stay dependency-free | **LeanAgileOS [ADR-001] D4** — platform boundaries and package conventions | Same rule, and the same decision number within its own record: domain packages may depend only on domain/util layers |
| Singularity ADR-074 — tracking docs branch from and merge to `dev` | **LeanAgileOS [ADR-030]** — global documents are authored on `dev` | Same subject: where a repository-wide document is authored so branches cannot fork it |
| Singularity ADR-088 — VS Codium sidecar reference integration | 🔴 **No counterpart exists** | Not ported. The citation is marked as unported rather than redirected — see §5 |

### 3 — ADR-001's boundary survives; its counterparty does not

**What ADR-001 decided remains right:** Portfolio integrates through an independently versioned
public contract, owns only a thin methodology-neutral adapter, and never imports platform source
paths or reads another service's datastore. Its contract rules 1–6 stand unchanged.

**What changes is who provides that contract.** Every ADR-001 sentence naming Singularity as
provider now names `lean-agile-os`, and its *Acceptance evidence* — *"a reciprocal Singularity ADR
accepts the provider-side boundary"* — is owed by `lean-agile-os` instead.

### 4 — 🔴 The code still points at `@singularity/workflow-engine`, and that is deliberate

`lean-agile-os` **publishes no equivalent package.** Verified on disk 2026-09-08:

| | |
| --- | --- |
| `singularity` | one versioned publishable package, `@singularity/workflow-engine`, exporting `.`, `./cli` and `./public` |
| `lean-agile-os` | three internal Nx libraries — `@lean-agile-os/workflow-engine-{domain,application,infrastructure}` — with **no public export surface and nothing publishable** |
| The six symbols the adapter imports | `WORKFLOW_ENGINE_PUBLIC_CONTRACT_VERSION`, `WorkflowEnginePublicClient`, `WorkflowRecorder`, `StartWorkflowInput`, `WorkflowCommandResult`, `ExtensionTransitionRecord` — **zero of six exist anywhere in `lean-agile-os`** |

So these **six** references stay until there is something to point them at:

1. `@singularity/workflow-engine` in `libs/portfolio-workflow-adapter/package.json`
2. `@singularity/workflow-engine` in `libs/portfolio-workflow-macros/package.json`
3. `@singularity/workflow-engine/public` in `libs/portfolio-workflow-adapter/src/lib/portfolio-workflow-adapter.ts`
4. `@singularity/workflow-engine/public` in `libs/portfolio-workflow-macros/src/lib/portfolio-workflow-macros.ts`
5. `SINGULARITY_ROOT` and both pack paths in `tools/install-local-workflow-packages.mjs`
6. 🔴 The allow/forbid regexes in `tools/verify-workflow-contract-fixtures.mjs` — **the guard that
   enforces this very boundary.** It allows `@singularity/workflow-engine/public` and forbids every
   other `@singularity/` path, the absolute `singularity` checkout path, and `agents/` / `skills/`
   content. Repointing it is not a rename: the allowed package and the forbidden path must move
   **together**, or the guard either rejects the new package or stops rejecting the old repository.

⚠️ **Renaming them without the package existing would break the build and prove nothing.** Building
`@lean-agile-os/workflow-engine-public` — the six symbols, versioned exports, and the compatibility
fixture ADR-001 rule 2 requires — is tracked as its own feature in `lean-agile-os`.

🔴 **`libs/workflow-engine-public-contract` in this repository is an empty placeholder** — two
directories and no files. It is where that contract lands, and until then it proves nothing either.

### 5 — An unported reference is marked, not redirected

Where Portfolio depends on something `singularity` decided and `lean-agile-os` has not yet ported —
ADR-088's sidecar reference integration, Phase 21's extraction ruling, `platform-vision.md`'s V1 —
the document says **"not yet ported"** and names what it is waiting for.

**A marked gap is auditable; a redirected one is indistinguishable from a decision that was
actually taken.** This is the same reason LeanAgileOS ADR-047 prefers a measured gap to a silent
one, and the reason its Apparatus Port left reconciliation tables rather than rewriting ported
prose in place.

## Consequences

### Positive

- Portfolio's documentation stops pointing at a repository that is being emptied.
- The three ADR citations now resolve to the decision they actually meant, rather than to whatever
  happens to hold that number in the successor.
- The code/prose gap is stated in one place with the evidence for it, instead of being discovered
  by whoever next tries the rename.

### Constraints

- 🔴 **Prose and code disagree until the contract package exists.** This record is the explanation;
  it is not a fix, and it should not be read as one.
- ⚠️ **Portfolio depends on PouchDB** — `pouchdb`, `pouchdb-adapter-memory`, the
  `portfolio-workflow-recording` library and `features/pouchdb-recording-model.feature` — against
  the founder's standing direction that new persistence targets TypeQLite. Recorded here and
  deliberately **out of scope**: the persistence decision belongs to Architecture Design, Workshop 5
  of the MVP iteration, not to a documentation repoint.
- The extraction negotiation in the architecture specification's §11–§12 was conducted with
  Singularity as counterparty. Repointing the name does not re-take the decision, and §5 marks it.

## References

- [ADR-001 — Workflow Engine Public Consumer Boundary](adr-001-workflow-engine-public-consumer-boundary.md) — superseded in counterparty only
- [Portfolio architecture specification](portfolio-architecture-spec.md)
- [Interactive Examples — Proposed Scope](../planning/interactive-examples-scope.md)
- [Workflow Engine and Lean-Agile MVP Foundation feature plan](../planning/features/workflow-engine-lean-agile-mvp-foundation.feature.md)

[ADR-001]: https://github.com/dave-jackson-dev/lean-agile-os/blob/dev/docs/architecture/adr-001-platform-boundaries-and-package-conventions.md
[ADR-030]: https://github.com/dave-jackson-dev/lean-agile-os/blob/dev/docs/architecture/adr-030-global-documents-are-authored-on-dev.md
