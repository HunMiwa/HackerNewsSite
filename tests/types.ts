import type { ParameterType } from "./support/parameterType"

const buttonType = { 
  name: 'button_type', 
  options: ['login', 'register', 'submit', 'close', 'toggle'] as const 
}
export type ButtonType = (typeof buttonType.options)[number]

const modalType = {
  name: 'modal_type',
  options: ['login', 'register'] as const
}
export type ModalType = (typeof modalType.options)[number]

const types: ParameterType[] = [
  buttonType,
  modalType,
]

export default types
