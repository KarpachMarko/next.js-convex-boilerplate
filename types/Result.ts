import { SerializedError } from "@/lib/error-utils"

export type Result<T> = SuccessResult<T> | FailedResult

export type SuccessResult<T> = {
  data: T;
  error: null;
}

export type FailedResult = {
  data: null;
  error: Error;
}

export type ActionResult<T> = Omit<Result<T>, "error"> & {
  error: SerializedError | null;
}
