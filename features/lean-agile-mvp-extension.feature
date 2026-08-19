Feature: Portfolio consumes the Lean-Agile MVP workflow package
  As the Portfolio application
  I want to compose the reusable methodology with my public Workflow Engine adapter
  So that Portfolio proves the package boundary without owning methodology rules

  Scenario: A valid transition is recorded through the public Workflow Engine contract
    Given a Portfolio Lean-Agile MVP extension with an accepting public client
    When the extension records an experiment transition
    Then the public client receives the versioned MVP extension transition
