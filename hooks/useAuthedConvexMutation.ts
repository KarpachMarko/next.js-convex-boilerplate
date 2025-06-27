import { useConvexMutation } from "@/hooks/useConvexMutation"
import { useCallback } from "react"
import { useProfile } from "@/components/profile-provider"
import { FunctionReference, OptionalRestArgs } from "convex/server"

export function useAuthedConvexMutation<
  Mutation extends FunctionReference<"mutation">,
  Args extends OptionalRestArgs<Mutation>
>(mutation: Mutation) {
  const { profile } = useProfile()
  const convexMutation = useConvexMutation<Mutation, Args>(mutation)
  return useCallback((args: any) => convexMutation({ profileId: profile?._id, ...args }), [mutation, profile])
}