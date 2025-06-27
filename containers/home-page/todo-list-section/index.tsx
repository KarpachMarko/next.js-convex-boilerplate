'use client'

import { useProfile } from '@/components/profile-provider'
import { useConvexQuery } from '@/hooks/useConvexQuery'
import { api } from '@/convex/_generated/api'
import { ConvexError } from 'convex/values'
import { TodoList } from '@/components/ui/todo-list'
import { useAuthedConvexMutation } from '@/hooks/useAuthedConvexMutation'

export const TodoListSection = () => {
  const { profile } = useProfile()
  const { data: tasks, isLoading, error } = useConvexQuery(api.tasks.get,
    { profileId: profile?._id })

  const setStatus = useAuthedConvexMutation(api.tasks.setStatus)

  const addTask = useAuthedConvexMutation(api.tasks.insert)
  const removeTask = useAuthedConvexMutation(api.tasks.remove)

  const canEdit = profile?.permissions.some(
    p => p.slug === 'todo-tasks:write') ?? false

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    if (error instanceof ConvexError) {
      const requiredPermission = error.data?.requiredPermission
      if (requiredPermission != null) {
        return <div>You do not have permission "{requiredPermission}"</div>
      }
    }
    return <div>Failed to load task list. Try to login</div>
  }

  return (
    <TodoList tasks={tasks}
              setStatus={setStatus}
              addTask={addTask}
              canEdit={canEdit}
              deleteTask={removeTask}
    />
  )
}