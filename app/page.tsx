import { TodoListSection } from "@/containers/home-page/todo-list-section"
import DefaultLayout from "@/components/default-content-layout"
import { Suspense } from "react"
import { Loader2Icon } from "lucide-react"

export default async function Home() {
  return (
    <DefaultLayout>
      <Suspense fallback={<div className={"flex items-center"}>
        <span className={"font-bold"}>Tasklist is loading</span>
        <Loader2Icon className={"animate-spin"}/>
      </div>}>
        <TodoListSection/>
      </Suspense>
    </DefaultLayout>
  )
}
