import { Given, Then } from '@cucumber/cucumber'
import { core } from '../index.js'
import { ButtonType } from '../types.js'

Given('I open Hacker News', async function () {
  await core.openHackerNews.call(this as any)
})

Then('I click on the {string} button', async function (buttonType: ButtonType) {
  await core.clickButton.call(this as any, buttonType)
})


