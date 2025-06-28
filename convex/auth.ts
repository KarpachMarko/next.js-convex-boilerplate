import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { v, Validator } from "convex/values"
import { ProfileWithPermissions } from "@/types/profileModel"
import { api } from "@/convex/_generated/api"
import { UnauthorizedPermissionConvexError, } from "@/types/errors/unauthorizedPermissionError"
import { UnauthenticatedConvexError } from "@/types/errors/unauthenticatedError"

type AuthenticatedQueryCtx = QueryCtx & { profile: ProfileWithPermissions };
type AuthenticatedMutationCtx = MutationCtx & {
  profile: ProfileWithPermissions
};

export const authedQuery = <
  ArgsValidator extends Record<string, Validator<any, any, any>>,
  Output
>(queryDef: {
  args: ArgsValidator;
  handler: (
    ctx: AuthenticatedQueryCtx,
    args: {
      [Property in keyof ArgsValidator]: ArgsValidator[Property]["type"];
    },
  ) => Promise<Output>;
}, withPermission?: string) => {
  return query({
    args: {
      profileId: v.optional(v.id("profiles")),
      ...queryDef.args,
    },
    handler: async (ctx: QueryCtx, allArgs) => {
      const { profileId, ...args } = allArgs

      if (profileId == null) {
        throw new UnauthenticatedConvexError()
      }

      let profile = await ctx.runQuery(
        api.profile.getProfileWithPermissionsById, { id: profileId })

      if (!profile) {
        throw new UnauthenticatedConvexError()
      }

      if (withPermission != null &&
        !profile?.permissions?.some(p => p.slug === withPermission)) {
        throw new UnauthorizedPermissionConvexError({
          profileId: profileId,
          requiredPermission: withPermission,
          profilePermissions: profile.permissions.map(p => p.slug),
        })
      }

      // Create authenticated context
      const authedCtx: AuthenticatedQueryCtx = {
        ...ctx,
        profile,
      }

      return queryDef.handler(authedCtx, args as any)
    },
  })
}

// Properly typed authenticated mutation wrapper
export const authedMutation = <
  ArgsValidator extends Record<string, Validator<any, any, any>>,
  Output
>(mutationDef: {
  args: ArgsValidator;
  handler: (
    ctx: AuthenticatedMutationCtx,
    args: {
      [Property in keyof ArgsValidator]: ArgsValidator[Property]["type"];
    },
  ) => Promise<Output>;
}, withPermission?: string) => {
  return mutation({
    args: {
      profileId: v.optional(v.id("profiles")),
      ...mutationDef.args,
    },
    handler: async (ctx: MutationCtx, allArgs) => {
      const { profileId, ...args } = allArgs

      if (profileId == null) {
        throw new UnauthenticatedConvexError()
      }

      let profile = await ctx.runQuery(
        api.profile.getProfileWithPermissionsById, { id: profileId })

      if (!profile) {
        throw new UnauthenticatedConvexError()
      }

      if (withPermission != null &&
        !profile?.permissions?.some(p => p.slug === withPermission)) {
        throw new UnauthorizedPermissionConvexError({
          profileId: profileId,
          requiredPermission: withPermission,
          profilePermissions: profile.permissions.map(p => p.slug),
        })
      }

      // Create authenticated context
      const authedCtx: AuthenticatedMutationCtx = {
        ...ctx,
        profile,
      }

      return mutationDef.handler(authedCtx, args as any)
    },
  })
}