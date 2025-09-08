import { Then } from '@cucumber/cucumber'
import { login } from '../index.js'

Then('I should see the login modal', async function () {
  await login.CheckLoginModal.call(this as any)
})

Then('I should see the register modal', async function() {
  await login.CheckRegisterModal.call(this as any)
})

Then('I should not see the login modal', async function() {
  await login.CheckLoginModalNotVisible.call(this as any)
})

Then('I should not see the register modal', async function() {
  await login.CheckRegisterModalNotVisible.call(this as any)
})


