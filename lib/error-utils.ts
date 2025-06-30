import { ConvexError, Value } from "convex/values"

export type SerializedError = {
  type: "ConvexError" | "Error" | "Unknown",
  message: string,
  data?: any,
  name?: string,
  stack?: string
}

export type SerializedConvexError = {
  type: "ConvexError",
  message: string,
  data: Value,
  stack?: string
}

export function serializeError(error: unknown): SerializedError {
  if (error instanceof ConvexError) {
    return {
      type: "ConvexError",
      message: error.message,
      data: error.data,
      stack: error.stack,
    }
  }

  if (error instanceof Error) {
    return {
      type: "Error",
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }

  return {
    type: "Unknown",
    message: String(error),
  }
}

export function isSerializedConvexError(error: any): error is SerializedConvexError {
  return error?.type === "ConvexError" && error?.data != null
}

export function toConvexError(error: SerializedConvexError): ConvexError<Value> {
  return new ConvexError(error?.data)
}