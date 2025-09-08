import { CustomWorld } from '../support/world.js'
import { AssertNotVisible, AssertVisible } from './core.js'

export async function CheckLoginModal(this: CustomWorld) {
  const loginModal = await this.page.locator('#login_modal')
  await AssertVisible(loginModal)
}

export async function CheckRegisterModal(this: CustomWorld) {
  const registerModal = await this.page.locator('#register_modal')
  await AssertVisible(registerModal)
}

export async function CheckLoginModalNotVisible(this: CustomWorld) {
  const loginModal = await this.page.locator('#login_modal')
  await AssertNotVisible(loginModal)
}

export async function CheckRegisterModalNotVisible(this: CustomWorld) {
  const registerModal = await this.page.locator('#register_modal')
  await AssertNotVisible(registerModal)
}   