"use client"

import { useProfile } from "@/components/profile-provider"
import { useConvexQuery } from "@/hooks/useConvexQuery"
import { api } from "@/convex/_generated/api"
import { TodoList } from "@/components/ui/todo-list"
import { useAuthedConvexMutation } from "@/hooks/useAuthedConvexMutation"
import { CircleAlertIcon, Loader2Icon } from "lucide-react"
import { isUnauthorizedPermissionConvexError, } from "@/types/errors/unauthorizedPermissionError"
import { isUnauthenticatedConvexError } from "@/types/errors/unauthenticatedError"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function getErrorContent(error: Error) {
  if (error) {
    if (isUnauthorizedPermissionConvexError(error)) {
      return <Alert variant="destructive">
        <CircleAlertIcon/>
        <AlertTitle>Unauthorized</AlertTitle>
        <AlertDescription>
          <span>You do not have permission <strong>"{error.data.requiredPermission}"</strong></span>
        </AlertDescription>
      </Alert>
    }
    if (isUnauthenticatedConvexError(error)) {
      return <Alert variant="destructive">
        <CircleAlertIcon/>
        <AlertTitle>Unauthenticated</AlertTitle>
        <AlertDescription>
          <span>You need to be logged in to see this content</span>
        </AlertDescription>
      </Alert>
    }
    return <div>Failed to load task list. Try to login</div>
  }
}

export const TodoListSection = () => {
  const { profile, isLoading: profileLoading } = useProfile()
  const {
    data: tasks,
    isLoading,
    error
  } = useConvexQuery(api.tasks.get, profileLoading ? "skip" : { profileId: profile?._id })

  const setStatus = useAuthedConvexMutation(api.tasks.setStatus)

  const addTask = useAuthedConvexMutation(api.tasks.insert)
  const removeTask = useAuthedConvexMutation(api.tasks.remove)

  const canEdit = profile?.permissions.some(
    p => p.slug === "todo-tasks:write") ?? false

  const loadingContent = <div className="flex items-center justify-center gap-2"><Loader2Icon className="animate-spin"/>Loading
  </div>
  return (<div>
      <h1 className="text-xl font-bold pb-4">Tasks TODO</h1>
      {isLoading ? loadingContent
        : error
          ? getErrorContent(error)
          : <TodoList tasks={tasks}
                      setStatus={setStatus}
                      addTask={addTask}
                      canEdit={canEdit}
                      deleteTask={removeTask}
          />}
    </div>
  )
}
