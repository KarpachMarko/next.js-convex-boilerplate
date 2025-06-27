"use client";

import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {TodoList} from "@/components/ui/todo-list";
import {useProfile} from "@/components/profile-provider";

export const TodoListSection = () => {
  const {profile} = useProfile()
  const tasks = useQuery(api.tasks.get) ?? []
  const setStatus = useMutation(api.tasks.setStatus)
  const addTask = useMutation(api.tasks.insert)
  const removeTask = useMutation(api.tasks.remove)

  const canEdit = profile?.permissions
    .some(p => p.slug === "todo-tasks:write") ?? false;

  return (
    <TodoList tasks={tasks}
              setStatus={setStatus}
              addTask={addTask}
              canEdit={canEdit}
              deleteTask={removeTask}
    />
  )
}