import {Task, TaskRegistrationRequest} from "@/app/model/taskModel";
import {Id} from "@/convex/_generated/dataModel";
import {useMemo, useState} from "react";

export function TodoList(props: {
  tasks: Task[],
  addTask: ({task}: { task: TaskRegistrationRequest }) => Promise<Task>,
  setStatus: ({}: { id: Id<"tasks">, isCompleted: boolean }) => void,
  deleteTask: ({}: {
    id: Id<"tasks">
  }) => void,
}) {

  const [newTask, setNewTask] = useState("")
  const isValid = useMemo(isValidFunc, [newTask]);

  function isValidFunc() {
    return newTask != null && newTask.length > 3;
  }

  async function addTask() {
    if (!isValid) {
      return
    }

    const taskRequest = {text: newTask, isCompleted: false};
    let resTask = await props.addTask({task: taskRequest});
    console.log("New task added", resTask);

    setNewTask("");
    return resTask;
  }

  return <div>
    <h2>TodoList</h2>
    <ol
      className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
      {props.tasks?.map(({_id, text, isCompleted}) =>
        <li key={_id} className="mb-2 tracking-[-.01em]">
          <span className="inline-flex flex-row gap-4 items-center">
            <span className="grow-1">{text}</span>
            <input className="cursor-pointer" type="checkbox" checked={isCompleted}
                   onChange={async e => {
                     const newStatus = e.currentTarget.checked;
                     props.setStatus({id: _id, isCompleted: newStatus});
                   }}/>
            <span className="bg-red-400 rounded-full px-2 cursor-pointer"
                  onClick={() => props.deleteTask({id: _id})}>X</span>
          </span>
        </li>
      )}
    </ol>
    <input className="bg-white text-black w-full rounded" type="text" value={newTask}
           onChange={e => setNewTask(e.currentTarget.value)}/>
    <button disabled={!isValid}
            className={`w-full ${isValid ? "bg-pink-700" : "bg-gray-800"} ${isValid ? "text-white" : "text-gray-600"} my-1.5 rounded`}
            onClick={addTask}>Add Task
    </button>
  </div>;
}