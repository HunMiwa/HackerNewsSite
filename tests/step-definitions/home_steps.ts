import { Then } from '@cucumber/cucumber'
import { home } from '../index.js'

Then('the page title should be visible', async function() {
  await home.CheckPageTitle.call(this as any)
})


