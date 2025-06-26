"use client";

import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {TodoList} from "@/components/TodoList";

export const TodoListSection = () => {
  const tasks = useQuery(api.tasks.get) ?? []
  const setStatus = useMutation(api.tasks.setStatus)
  const addTask = useMutation(api.tasks.insert)
  const removeTask = useMutation(api.tasks.remove)

  return (
    <TodoList tasks={tasks}
              setStatus={setStatus}
              addTask={addTask}
              deleteTask={removeTask}
    />
  )
}