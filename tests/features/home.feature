Feature: Home page

  Scenario: Open Hacker News and see title
    Given I open Hacker News
    Then the page title should be visible

  Scenario: Stories fail to load
    Given I open Hacker News
    Then the page title should be visible
    Then I should intercept the API call
    Then I click on the refresh button
    Then I should wait for network to be idle

  Scenario: Stories load successfully at each navbar button
    Given I open Hacker News
    Then the page title should be visible
    Then I select the top stories navbar button
    Then I should see the top stories
    Then I select the new stories navbar button
    Then I should see the new stories
    Then I select the ask stories navbar button
    Then I should see the ask stories
    Then I select the show stories navbar button
    Then I should see the show stories
    Then I select the job stories navbar button
    Then I should see the job stories