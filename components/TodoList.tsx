import {Task, TaskRegistrationRequest} from "@/app/model/taskModel";
import {Id} from "@/convex/_generated/dataModel";
import {useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";

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
    return newTask != null && newTask.length >= 3;
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
    <Table>
      <TableBody>
        {props.tasks?.map(({_id, text, isCompleted}, i) =>
            <TableRow key={_id}>
              <TableCell className="font-medium">{i + 1}.</TableCell>
              <TableCell>{text}</TableCell>
              <TableCell>
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={(checked) => {
                    const newStatus = typeof checked === "boolean" ? checked : true;
                    return props.setStatus({id: _id, isCompleted: newStatus})
                  }}
                />
              </TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" className="cursor-pointer text-xs"
                        onClick={() => props.deleteTask({id: _id})}>Delete</Button></TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>

    <div className="flex gap-2 mt-2">
      <Input type="text" value={newTask} placeholder={"Task for today..."}
             onChange={e => setNewTask(e.currentTarget.value)}/>
      <Button className="cursor-pointer" disabled={!isValid}
              onClick={addTask}>Add Task
      </Button>
    </div>
  </div>;
}