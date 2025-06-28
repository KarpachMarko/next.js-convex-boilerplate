import { OptionalRestArgsOrSkip, useQuery } from "convex/react"
import { FunctionReference } from "convex/server"

type ConvexErrorResult<T> = {
  data: null;
  error: Error;
  isLoading: boolean;
};

type ConvexSuccessResult<T> = {
  data: T;
  error: null;
  isLoading: boolean;
};

export function useConvexQuery<
  Query extends FunctionReference<"query">,
  Args extends OptionalRestArgsOrSkip<Query>
>(
  query: Query,
  ...args: Args
): ConvexSuccessResult<Query["_returnType"]> | ConvexErrorResult<Query["_returnType"]> {
  try {
    const result = useQuery(query, ...args)

    if (result === undefined) {
      return {
        data: null,
        error: null,
        isLoading: true,
      }
    }

    return {
      data: result,
      error: null,
      isLoading: false,
    }
  } catch (e) {
    if (e instanceof Error) {
      return { data: null, error: e, isLoading: false }
    } else {
      return { data: null, error: new Error("Error during convex query"), isLoading: false }
    }
  }
}