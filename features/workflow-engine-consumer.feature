Feature: Portfolio Workflow Engine consumer
  As the Portfolio application
  I want to call the public Workflow Engine contract through an injected client
  So that no private Singularity source path becomes a dependency

  Scenario: Start a Lean-Agile MVP workflow through the v1 public contract
    Given an injected public Workflow Engine client
    When Portfolio starts a Lean-Agile MVP workflow
    Then the public client receives the versioned workflow-init request
