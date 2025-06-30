"use server"

import { convex } from "@/lib/convex-server"
import { api } from "@/convex/_generated/api"
import { withAuth } from "@workos-inc/authkit-nextjs"
import { Id } from "@/convex/_generated/dataModel"
import { Task, TaskRegistrationRequest } from "@/types/taskModel"
import { ActionResult } from "@/types/Result"
import { serializeError } from "@/lib/error-utils"

export async function addTask({ task }: { task: TaskRegistrationRequest }): Promise<ActionResult<Task>> {
  const { user } = await withAuth()
  if (user === null) {
    throw new Error("Unauthenticated")
  }
  const profile = await convex.query(api.profile.getProfileWithPermissionsByUserId, { userId: user?.id })
  if (profile === null) {
    throw new Error("Unauthenticated")
  }
  try {
    const newTask = await convex.mutation(api.tasks.insert, {
      profileId: profile._id,
      task
    })
    return { data: newTask, error: null }
  } catch (e) {
    return { data: null, error: serializeError(e) }
  }
}

export async function setStatus({ id, isCompleted }: {
  id: Id<"tasks">,
  isCompleted: boolean
}): Promise<ActionResult<void>> {
  const { user } = await withAuth()
  if (user === null) {
    throw new Error("Unauthenticated")
  }
  const profile = await convex.query(api.profile.getProfileWithPermissionsByUserId, { userId: user?.id })
  if (profile === null) {
    throw new Error("Unauthenticated")
  }
  try {
    await convex.mutation(api.tasks.setStatus, {
      profileId: profile._id,
      id,
      isCompleted
    })
    return { data: null, error: null }
  } catch (e) {
    return { data: null, error: serializeError(e) }
  }
}

export async function deleteTask({ id }: { id: Id<"tasks"> }): Promise<ActionResult<void>> {
  const { user } = await withAuth()
  if (user === null) {
    throw new Error("Unauthenticated")
  }
  const profile = await convex.query(api.profile.getProfileWithPermissionsByUserId, { userId: user?.id })
  if (profile === null) {
    throw new Error("Unauthenticated")
  }
  try {
    await convex.mutation(api.tasks.remove, {
      profileId: profile._id,
      id
    })
    return { data: null, error: null }
  } catch (e) {
    return { data: null, error: serializeError(e) }
  }
}