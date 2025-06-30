import { OptionalRestArgsOrSkip, useQuery } from "convex/react"
import { FunctionReference } from "convex/server"
import { Result } from "@/types/Result"

type ConvexQueryResult<T> = Result<T> & {
  isLoading: boolean;
};

export function useConvexQuery<
  Query extends FunctionReference<"query">,
  Args extends OptionalRestArgsOrSkip<Query>
>(
  query: Query,
  ...args: Args
): ConvexQueryResult<Query["_returnType"]> {
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