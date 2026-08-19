Feature: Workflow Engine public contract
  As a Portfolio consumer
  I want a safe, versioned workflow boundary
  So that evidence and macros cannot expose private content or cross-user activity

  Scenario: A Service Account records a delegated macro approval
    Given the delegated macro-approval contract fixture
    When the workflow contract fixtures are verified
    Then the event has a trusted source, Service Account actor, and initiating principal

  Scenario: A macro can only replay into a disposable workspace
    Given the approved workflow macro contract fixture
    When the workflow contract fixtures are verified
    Then the macro is human-approved and targets a disposable workspace

  Scenario: A Portfolio consumer contains no private Singularity imports
    When the workflow contract fixtures are verified
    Then no private Singularity import or proprietary-content reference is present
