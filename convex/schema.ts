import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";


export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean()
  }),

  roles: defineTable({
    name: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),

  profiles: defineTable({
    userId: v.string(),
    username: v.string(),
    roleId: v.optional(v.id("roles")),
  }).index("by_user_id", ["userId"]),

  permissions: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  profilePermissions: defineTable({
    profileId: v.id("profiles"),
    permissionId: v.id("permissions"),
  })
    .index("by_profile_id", ["profileId"])
    .index("by_permission_id", ["permissionId"]),

  rolePermissions: defineTable({
    roleId: v.id("roles"),
    permissionId: v.id("permissions"),
  })
    .index("by_role_id", ["roleId"])
    .index("by_permission_id", ["permissionId"]),
});