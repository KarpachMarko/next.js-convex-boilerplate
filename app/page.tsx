"use client";

import Image from "next/image";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {TodoList} from "@/components/TodoList";

export default function Home() {

  const tasks = useQuery(api.tasks.get) ?? []
  const setStatus = useMutation(api.tasks.setStatus)
  const addTask = useMutation(api.tasks.insert)
  const removeTask = useMutation(api.tasks.remove)

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <TodoList tasks={tasks}
                  setStatus={setStatus}
                  addTask={addTask}
                  deleteTask={removeTask}
        />

      </main>
    </div>
  );
}
