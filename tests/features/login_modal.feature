Feature: Login & Register Modal

  Scenario: Open and close login & register modal
    Given I open Hacker News
    Then I click on the login button
    Then I should see the login modal
    When I click on the toggle button
    Then I should see the register modal
    When I click on the close button
    Then I should not see the login modal