import { Given, Then } from '@cucumber/cucumber'
import { core } from '../index.js'
import { ButtonType, NavbarButton } from '../types.js'
import { home } from '../index.js'

Given('I open Hacker News', async function () {
  await core.openHackerNews.call(this as any)
})

Then('I click on the {button_type} button', async function (buttonType: ButtonType) {
  await core.clickButton.call(this as any, buttonType)
})

Then('I select the {navbar_button} stories navbar button', async function (navbarButton: NavbarButton) {
  await core.clickButton.call(this as any, navbarButton)
})

Then('I should see the {navbar_button} stories', async function (navbarButton: NavbarButton) {
  await home.CheckStoriesLoadedAPI.call(this as any, navbarButton)
})



