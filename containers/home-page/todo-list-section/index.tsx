"use client"

import { useProfile } from "@/components/profile-provider"
import { useConvexQuery } from "@/hooks/useConvexQuery"
import { api } from "@/convex/_generated/api"
import { TodoList } from "@/components/ui/todo-list"
import { useAuthedConvexMutation } from "@/hooks/useAuthedConvexMutation"
import { Loader2Icon } from "lucide-react"
import { isUnauthorizedPermissionConvexError, } from "@/types/errors/unauthorizedPermissionError"
import { isUnauthenticatedConvexError } from "@/types/errors/unauthenticatedError"

export const TodoListSection = () => {
  const { profile } = useProfile()
  const { data: tasks, isLoading, error } = useConvexQuery(api.tasks.get,
    { profileId: profile?._id })

  const setStatus = useAuthedConvexMutation(api.tasks.setStatus)

  const addTask = useAuthedConvexMutation(api.tasks.insert)
  const removeTask = useAuthedConvexMutation(api.tasks.remove)

  const canEdit = profile?.permissions.some(
    p => p.slug === "todo-tasks:write") ?? false

  if (isLoading) {
    return <div className="flex items-center"><Loader2Icon className="animate-spin"/>Loading</div>
  }

  if (error) {
    if (isUnauthorizedPermissionConvexError(error)) {
      return <div>You do not have permission "{error.data.requiredPermission}"</div>
    }
    if (isUnauthenticatedConvexError(error)) {
      return <div>Unauthorized :(</div>
    }
    return <div>Failed to load task list. Try to login</div>
  }

  return (
    <TodoList tasks={tasks}
              setStatus={setStatus}
              addTask={addTask}
              canEdit={canEdit || true}
              deleteTask={removeTask}
    />
  )
}
