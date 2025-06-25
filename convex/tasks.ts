import {mutation, query,} from "@/convex/_generated/server";
import {v} from "convex/values";
import {Task} from "@/app/model/taskModel";

const TasksTable = "tasks";

export const get = query({
  args: {},
  handler: async (ctx) => {
    let res = await ctx.db.query(TasksTable).collect();
    return res as Task[];
  }
})

export const insert = mutation({
  args: {
    task: v.object({
      text: v.string(),
      isCompleted: v.boolean()
    })
  },
  handler: async (ctx, args) => {
    let task = args.task;
    const taskId = await ctx.db.insert(TasksTable, task)
    return {...task, _id: taskId}
  }
})

export const remove = mutation({
  args: {
    id: v.id(TasksTable)
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  }
})

export const setStatus = mutation({
  args: {id: v.id(TasksTable), isCompleted: v.boolean()},
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {isCompleted: args.isCompleted});
  }
})