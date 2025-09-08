// Button Type definition
const buttonType = { 
  name: 'button_type', 
  options: ['login', 'register', 'submit', 'close'] as const 
}
export type ButtonType = (typeof buttonType.options)[number]

// Modal Type definition
const modalType = {
  name: 'ModalType',
  options: ['login', 'register'] as const
}
export type ModalType = (typeof modalType.options)[number]

// Parameter type configurations for Cucumber
export const buttonTypeParameter = {
  name: buttonType.name,
  regexp: new RegExp(`(?:${buttonType.options.join('|')})`),
  transformer: (value: string) => value as ButtonType
}

export const modalTypeParameter = {
  name: modalType.name,
  regexp: new RegExp(`(?:${modalType.options.join('|')})`),
  transformer: (value: string) => value as ModalType
}

// Export all common types
export const commonTypes = [
  buttonTypeParameter, 
  modalTypeParameter
]
