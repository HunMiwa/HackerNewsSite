import { CustomWorld } from '../support/world.js'
import { ModalType } from '../types.js'
import { AssertNotVisible, AssertVisible } from './core.js'

export async function CheckModalVisible(this: CustomWorld, modalType: ModalType) {
  const loginModal = await this.page.locator(`#${modalType}_modal`)
  await AssertVisible(loginModal)
}

export async function CheckModalNotVisible(this: CustomWorld,  modalType: ModalType ) {
  const loginModal = await this.page.locator(`#${modalType}_modal`)
  await AssertNotVisible(loginModal)
} 