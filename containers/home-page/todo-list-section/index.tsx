"use server"

import { api } from "@/convex/_generated/api"
import { TodoList } from "@/components/ui/todo-list"
import { CircleAlertIcon } from "lucide-react"
import { isUnauthorizedPermissionConvexError, } from "@/types/errors/unauthorizedPermissionError"
import { isUnauthenticatedConvexError } from "@/types/errors/unauthenticatedError"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { withAuth } from "@workos-inc/authkit-nextjs"
import { convex } from "@/lib/convex-server"

const unauthenticatedErrorContent = <Alert variant="destructive">
  <CircleAlertIcon/>
  <AlertTitle>Unauthenticated</AlertTitle>
  <AlertDescription>
    <span>You need to be logged in to see this content</span>
  </AlertDescription>
</Alert>

export async function TodoListSection() {
  const { user } = await withAuth()

  if (user === null) {
    return unauthenticatedErrorContent
  }

  const profile = await convex.query(api.profile.getProfileWithPermissionsByUserId, { userId: user?.id })

  if (profile === null) {
    return unauthenticatedErrorContent
  }

  try {
    const tasks = await convex.query(api.tasks.get, { profileId: profile._id })

    const canEdit = profile?.permissions.some(
      p => p.slug === "todo-tasks:write") ?? false

    return (<div>
        <h1 className="text-xl font-bold pb-4">Task list</h1>
        <TodoList initialTasks={tasks}
                  canEdit={canEdit}
        />
      </div>
    )
  } catch (error) {
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
      return unauthenticatedErrorContent
    }
    return <div>Failed to load task list. Try to login</div>
  }
}
