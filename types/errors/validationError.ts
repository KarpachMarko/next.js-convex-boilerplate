import { ConvexError } from "convex/values"

export type FieldValidationError = {
  field: string
  message: string
}

export type ValidationErrorData = {
  code: "VALIDATION_ERROR"
  message?: string
  errors: FieldValidationError[]
}

const DEFAULT_MESSAGE = "Input validation failed"

export class ValidationConvexError extends ConvexError<ValidationErrorData> {
  constructor(data: Omit<ValidationErrorData, "code">) {
    super({ code: "VALIDATION_ERROR", message: DEFAULT_MESSAGE, ...data })
  }
}

export function isValidationError(
  error: unknown,
): error is ConvexError<ValidationErrorData> {
  return (
    error instanceof ConvexError &&
    (error.data as ValidationErrorData)?.code === "VALIDATION_ERROR"
  )
}
