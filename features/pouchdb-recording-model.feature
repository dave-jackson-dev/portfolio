Feature: PouchDB macro recording model
  As a Portfolio workflow foundation
  I want redacted, idempotent event recordings
  So that macro evidence can be recovered without retaining sensitive payloads

  Scenario: Duplicate allowlisted delivery produces one logical recording
    Given an empty Portfolio PouchDB recording store
    When an allowlisted workflow event is delivered twice
    Then the recording contains one redacted event

  Scenario: Unapproved events are rejected before persistence
    Given an empty Portfolio PouchDB recording store
    When an unapproved event is delivered
    Then the recording event is rejected and no recording is created

  Scenario: A recording snapshot restores with integrity verification
    Given an empty Portfolio PouchDB recording store
    When an allowlisted workflow event is recorded and snapshotted
    Then the snapshot restores the same logical recording

  Scenario: One-week retention removes expired recordings only
    Given an empty Portfolio PouchDB recording store
    When an expired and a current allowlisted event are recorded
    Then retention removes only the expired recording event
