import {mutation} from "./_generated/server";
import {v} from "convex/values";
import {query} from "@/convex/_generated/server";

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

    const profileArgs = {
      userId: args.userId,
      username: args.email,
    };
    console.log(`Registering new profile ${JSON.stringify(profile)}`)
    await ctx.db.insert("profiles", profileArgs);
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