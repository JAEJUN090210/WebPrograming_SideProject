import { useMemo, useState } from "react"
import type { ChangeEvent, FocusEvent, FormEvent } from "react"

type ValidationErrors<T extends Record<string, string>> = Partial<Record<keyof T, string>>

type UseAuthFormArgs<T extends Record<string, string>> = {
  initialValues: T
  validate: (values: T) => ValidationErrors<T>
  onSubmit: (values: T) => Promise<void> | void
}

export default function useAuthForm<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
}: UseAuthFormArgs<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    const fieldName = name as keyof T

    setValues(prev => ({
      ...prev,
      [fieldName]: value,
    }))

    setErrors(prev => {
      if (!prev[fieldName]) {
        return prev
      }

      const next = { ...prev }
      delete next[fieldName]
      return next
    })
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = event.target
    const fieldName = name as keyof T
    const nextErrors = validate(values)

    if (nextErrors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: nextErrors[fieldName],
      }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    hasErrors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
