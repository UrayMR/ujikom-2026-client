import type { FormError } from '@nuxt/ui'

interface BackendFieldError {
  field: string
  message: string
}

interface ApiErrorResponse {
  errors?: BackendFieldError[]
}

interface ApiError {
  response?: {
    _data?: ApiErrorResponse
  }
}

export const useFormErrors = () => {
  function parse(error: unknown): FormError[] {
    const apiError = error as ApiError

    const errors = apiError.response?._data?.errors

    if (!errors?.length) {
      return []
    }

    // If the first letter on message isn't capitalized, we should capitalize it to make it look better in the UI.
    errors.forEach((error) => {
      const firstLetter = error.message.charAt(0)
      if (firstLetter.toLowerCase() === firstLetter) {
        error.message = firstLetter.toUpperCase() + error.message.slice(1)
      }
    })

    return errors.map(({ field, message }) => ({
      name: field,
      message
    }))
  }

  function apply(
    form: {
      setErrors: (errors: FormError[]) => void
    },
    error: unknown
  ) {
    const errors = parse(error)

    if (!errors.length) {
      return false
    }

    form.setErrors(errors)

    return true
  }

  return {
    parse,
    apply
  }
}
