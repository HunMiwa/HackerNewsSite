Feature: Home page

  Scenario: Open Hacker News and see title
    Given I open Hacker News
    Then the page title should be visible

  Scenario: Stories fail to load
    Given I open Hacker News
    Then the page title should be visible
    Then I click on the refresh button
    Then I should intercept the API call
    Then I should see the error message