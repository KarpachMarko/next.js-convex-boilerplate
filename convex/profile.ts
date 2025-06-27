import {mutation} from "./_generated/server";
import {v} from "convex/values";
import {query} from "@/convex/_generated/server";
import {Permission, ProfileWithPermissions} from "@/types/profileModel";

export const createProfileIfMissing = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`Check if profile with userId ${args.userId} exists`)
    const profile = await ctx.db.query("profiles")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .first();

    if (profile) {
      console.log("Profile already exists in DB")
      return;
    }

    const role = await ctx.db.query("roles")
      .withIndex("by_slug", q => q.eq("slug", "member"))
      .first();

    if (role == null) {
      console.error(`Could not find default role by slug \"member\"`)
    }

    const profileArgs = {
      userId: args.userId,
      username: args.email,
      roleId: role?._id,
    };
    console.log(`Registering new profile ${JSON.stringify(profile)}`)
    await ctx.db.insert("profiles", profileArgs);
  }
});

export const getProfileWithPermissions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.query("profiles")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .first();

    if (!profile) {
      return null;
    }

    const manuallyAssignedPermissions = await ctx.db.query("profilePermissions")
      .withIndex("by_profile_id", q => q.eq("profileId", profile._id))
      .collect();

    const rolePermissions = profile.roleId
      ? await ctx.db.query("rolePermissions")
        .withIndex("by_role_id", q => q.eq("roleId", profile.roleId!))
        .collect()
      : [];

    const allPermissionIds = [...new Set([
      ...manuallyAssignedPermissions.map(p => p.permissionId),
      ...rolePermissions.map(p => p.permissionId),
    ])];

    const permissions = await Promise.all(
      allPermissionIds.map(permissionId => ctx.db.get(permissionId))
    );

    return {
      ...profile,
      permissions: permissions.filter(Boolean) as Permission[],
    } as ProfileWithPermissions;
  }
});


export default query({
  handler: async (ctx) => {
    console.log("Write and test your query function here!");
    const profile =  await ctx.db.query("profiles").first();
    if (!profile) {
      return
    }
    const permissions = await ctx.db.query("permissions").collect();
    permissions.map(p => ({profileId: profile._id, permissionId: p._id}))
  },
})