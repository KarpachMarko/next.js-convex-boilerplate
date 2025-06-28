import { v } from "convex/values"
import { Task } from "@/types/taskModel"
import { authedMutation, authedQuery } from "@/convex/auth"

export const get = authedQuery({
  args: {},
  handler: async (ctx) => {
    let res = await ctx.db.query("tasks").collect()
    return res as Task[]
  },
}, "todo-tasks:read")

export const insert = authedMutation({
  args: {
    task: v.object({
      text: v.string(),
      isCompleted: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    let task = args.task
    const taskId = await ctx.db.insert("tasks", task)
    return { ...task, _id: taskId }
  },
}, "todo-tasks:write")

export const remove = authedMutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
}, "todo-tasks:write")

export const setStatus = authedMutation({
  args: { id: v.id("tasks"), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isCompleted: args.isCompleted })
  },
}, "todo-tasks:write")