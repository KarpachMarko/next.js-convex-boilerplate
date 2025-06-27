import { useMutation } from 'convex/react'
import { FunctionReference, OptionalRestArgs } from 'convex/server'
import { useCallback } from 'react'

export type ConvexMutationResult<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export type ConvexMutationReturn<T> = (...args: any[]) => Promise<ConvexMutationResult<T>>;

export function useConvexMutation<
  Mutation extends FunctionReference<'mutation'>,
  Args extends OptionalRestArgs<Mutation>
> (
  mutation: Mutation,
): ConvexMutationReturn<Mutation['_returnType']> {
  const convexMutate = useMutation(mutation)

  return useCallback(async (...args: Args) => {
    try {
      const result = await convexMutate(...args)
      return {
        data: result,
        error: null,
        isLoading: false,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Mutation failed'),
        isLoading: false,
      }
    }
  }, [convexMutate])
}