import { Then } from '@cucumber/cucumber'
import { login } from '../index.js'
import { ModalType } from '../types.js'

Then('I should see the {modal_type} modal', async function (modalType: ModalType) {
  await login.CheckModalVisible.call(this as any, modalType)
})

Then('I should not see the {modal_type} modal', async function(modalType: ModalType) {
  await login.CheckModalNotVisible.call(this as any, modalType)
})


