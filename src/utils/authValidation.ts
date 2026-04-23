const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ValidationErrors<T extends object> = Partial<Record<keyof T, string>>

export type LoginFormValues = {
  email: string
  password: string
}

export type SignupFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function validateLogin(values: LoginFormValues): ValidationErrors<LoginFormValues> {
  const errors: ValidationErrors<LoginFormValues> = {}

  if (!values.email?.trim()) {
    errors.email = "이메일을 입력해 주세요."
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다."
  }

  if (!values.password) {
    errors.password = "비밀번호를 입력해 주세요."
  } else if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다."
  }

  return errors
}

export function validateSignup(values: SignupFormValues): ValidationErrors<SignupFormValues> {
  const errors: ValidationErrors<SignupFormValues> = {}

  if (!values.name?.trim()) {
    errors.name = "이름을 입력해 주세요."
  } else if (values.name.trim().length < 2) {
    errors.name = "이름은 2자 이상 입력해 주세요."
  }

  if (!values.email?.trim()) {
    errors.email = "이메일을 입력해 주세요."
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다."
  }

  if (!values.password) {
    errors.password = "비밀번호를 입력해 주세요."
  } else if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다."
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "비밀번호 확인을 입력해 주세요."
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "비밀번호가 일치하지 않습니다."
  }

  return errors
}
