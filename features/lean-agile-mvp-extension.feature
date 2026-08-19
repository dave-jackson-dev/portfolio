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
