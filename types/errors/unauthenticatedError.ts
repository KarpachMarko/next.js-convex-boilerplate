import { ConvexError } from "convex/values"

export type UnauthenticatedErrorData = {
  code: "UNAUTHENTICATED"
  message?: string;
}

const DEFAULT_MESSAGE = "Access denied: unauthenticated"

export class UnauthenticatedConvexError extends ConvexError<UnauthenticatedErrorData> {
  constructor(data: Omit<UnauthenticatedErrorData, "code"> = {}) {
    super({ code: "UNAUTHENTICATED", message: DEFAULT_MESSAGE, ...data })
  }
}

export function isUnauthenticatedConvexError(
  error: unknown,
): error is ConvexError<UnauthenticatedErrorData> {
  return (
    error instanceof ConvexError &&
    (error.data as UnauthenticatedErrorData)?.code === "UNAUTHENTICATED"
  )
}
