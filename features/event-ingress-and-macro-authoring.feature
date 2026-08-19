Feature: Event ingress and macro authoring
  As a Portfolio workflow foundation
  I want approved evidence to become a human-reviewed command recipe
  So that history remains audit evidence and never becomes executable replay data

  Scenario: An approved event is reduced through the recording ingress
    Given a Portfolio macro recording ingress
    When an allowlisted event enters the ingress
    Then the ingress retains only the redacted event evidence

  Scenario: Only a human principal can approve an immutable macro version
    Given a Portfolio macro store with recorded evidence
    When a human principal approves a macro recipe
    Then the approved macro has immutable version one

  Scenario: Macro replay dispatches fresh commands only to a disposable workspace
    Given an approved Portfolio macro and public workflow client
    When the macro is replayed into a disposable workspace
    Then the client receives fresh replay commands and no historical event

  Scenario: A Service Account cannot approve a macro
    Given a Portfolio macro store with recorded evidence
    When a Service Account attempts macro approval
    Then macro approval is rejected

  Scenario: Later macro approval creates a new immutable version
    Given a Portfolio macro store with recorded evidence
    When a human principal approves two macro versions
    Then both immutable macro versions are retained
