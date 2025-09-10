import type { ParameterType } from "./support/parameterType"

const buttonType = { 
  name: 'button_type', 
  options: ['login', 'register', 'submit', 'close', 'toggle', 'refresh'] as const 
}
export type ButtonType = (typeof buttonType.options)[number]

const modalType = {
  name: 'modal_type',
  options: ['login', 'register'] as const
}
export type ModalType = (typeof modalType.options)[number]

const navbarButton = {
  name: 'navbar_button',
  options: ['top', 'new', 'show', 'ask', 'job'] as const
}
export type NavbarButton = (typeof navbarButton.options)[number]

const types: ParameterType[] = [
  buttonType,
  modalType,
  navbarButton,
]

export default types
