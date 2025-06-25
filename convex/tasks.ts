import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  }
})

export const setStatus = mutation({
  args: {id: v.id("tasks"), isCompleted: v.boolean()},
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {isCompleted: args.isCompleted});
  }
})