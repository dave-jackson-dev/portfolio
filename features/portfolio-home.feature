Feature: Portfolio home page
  As a visitor
  I want to see the portfolio landing page
  So that I can confirm the consumer is healthy

  Scenario: The app loads the portfolio shell
    Given the portfolio application is running
    Then the page title should contain "portfolio-web"
