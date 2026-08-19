Feature: Lean-Agile MVP workflow extension
  As a Portfolio delivery workflow
  I want explicit hypothesis-to-outcome gates
  So that the Workflow Engine records evidence rather than inferred process

  Scenario: A hypothesis progresses through evidence to an outcome
    Given a Portfolio Lean-Agile MVP workflow with a testable hypothesis
    When an authorized principal starts the experiment
    And the experiment records immutable evidence
    And the evidence is reviewed into an outcome
    Then the workflow state is outcome

  Scenario: Only a human principal can make a pivot-or-persevere decision
    Given a Portfolio Lean-Agile MVP workflow ready for an outcome decision
    When a Service Account records a persevere decision
    Then the MVP transition is rejected

  Scenario: A pivot requires a revised testable hypothesis
    Given a Portfolio Lean-Agile MVP workflow ready for an outcome decision
    When an authorized principal returns a pivot without a revised hypothesis
    Then the MVP transition is rejected because a revised hypothesis is required

  Scenario: A valid transition is recorded through the public Workflow Engine contract
    Given a Portfolio Lean-Agile MVP extension with an accepting public client
    When the extension records an experiment transition
    Then the public client receives the versioned MVP extension transition

  Scenario: A representative initiative perseveres with a decision projection
    Given a Portfolio Lean-Agile MVP workflow ready for an outcome decision
    When an authorized principal records a persevere decision
    Then the MVP projection shows a terminal persevere decision

  Scenario: Invalid evidence references are rejected before an outcome
    Given a Portfolio Lean-Agile MVP workflow with a testable hypothesis
    When the experiment records a non-immutable evidence reference
    Then the MVP transition is rejected because immutable evidence is required

  Scenario: A pivot returns to a revised hypothesis with a decision projection
    Given a Portfolio Lean-Agile MVP workflow ready for an outcome decision
    When an authorized principal records a pivot and revised hypothesis
    Then the MVP projection shows the revised hypothesis and pivot decision
