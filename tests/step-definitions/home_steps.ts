import { Then } from '@cucumber/cucumber'
import { home } from '../index.js'

Then('the page title should be visible', async function() {
  await home.CheckPageTitle.call(this as any)
})

Then('I should intercept the API call', async function() {
  await home.InterceptAPICall.call(this as any)
})

Then('I should see the error message', async function() {
  await home.CheckErrorMessage.call(this as any)
})

