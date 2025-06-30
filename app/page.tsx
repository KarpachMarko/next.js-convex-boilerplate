import { TodoListSection } from "@/containers/home-page/todo-list-section"
import DefaultLayout from "@/components/default-content-layout"

export default async function Home() {
  return (
    <DefaultLayout>
      <TodoListSection/>
    </DefaultLayout>
  )
}
