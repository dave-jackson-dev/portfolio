# Phase 02 — PouchDB Recording Model Summary

**Status:** In progress

## First increment

The recorder persists one append-only PouchDB document per approved event identity. The assembled
`MacroRecording` projection groups those immutable records by workflow and correlation ID.
Duplicate delivery returns the original retained event without creating a second logical record.

Before any PouchDB write, the recorder rejects unapproved event types and reduces approved payloads
to the Phase 00 allowlist. Credentials, tokens, free-form request data, and arbitrary payload
fields are not retained. Snapshots carry a SHA-256 integrity digest and restore only after it
verifies.

## Next unchecked item

Add conflict and durable-storage recovery evidence.
