'use client'

import { Task, TaskRegistrationRequest } from '@/types/taskModel'
import { Id } from '@/convex/_generated/dataModel'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ConvexMutationResult } from '@/hooks/useConvexMutation'
import { ConvexError } from 'convex/values'

export function TodoList (props: {
  tasks: Task[],
  canEdit: boolean,
  addTask: ({ task }: {
    task: TaskRegistrationRequest
  }) => Promise<ConvexMutationResult<Task>>,
  setStatus: ({}: { id: Id<'tasks'>, isCompleted: boolean }) => void,
  deleteTask: ({}: {
    id: Id<'tasks'>
  }) => void,
}) {

  const [taskText, setTaskText] = useState('')
  const isValid = useMemo(isValidFunc, [taskText])

  function isValidFunc () {
    return taskText != null && taskText.length >= 3
  }

  async function addTask () {
    if (!isValid) {
      return
    }

    const taskRequest = { text: taskText, isCompleted: false }
    const { error } = await props.addTask({ task: taskRequest })

    if (error) {
      if (error instanceof ConvexError) {
        const requiredPermission = error.data?.requiredPermission
        if (requiredPermission != null) {
          alert(`You do not have required permission: ${requiredPermission}`)
          return
        }
      }
      alert('Failed to add task')
    } else {
      setTaskText('')
    }
  }

  return <div>
    <h1 className="text-xl font-bold pb-4">Tasks TODO</h1>
    <Table>
      <TableBody>
        {props.tasks?.map(({ _id, text, isCompleted }, i) =>
          <TableRow key={_id}>
            <TableCell className="font-medium">{i + 1}.</TableCell>
            <TableCell
              className={isCompleted ? 'line-through' : ''}>{text}</TableCell>
            <TableCell>
              <Checkbox
                disabled={!props.canEdit}
                checked={isCompleted}
                onCheckedChange={(checked) => {
                  const newStatus = typeof checked === 'boolean'
                    ? checked
                    : true
                  return props.setStatus({ id: _id, isCompleted: newStatus })
                }}
              />
            </TableCell>
            <TableCell>
              {props.canEdit ?
                <Button disabled={!props.canEdit} variant="destructive"
                        size="sm" className="cursor-pointer text-xs"
                        onClick={() => props.deleteTask(
                          { id: _id })}>Delete</Button> : <></>}
            </TableCell>
          </TableRow>,
        )}
      </TableBody>
    </Table>

    {props.canEdit ? <div className="flex gap-2 mt-2">
      <Input type="text" value={taskText} placeholder={'Task for today...'}
             onChange={e => setTaskText(e.currentTarget.value)}
             onKeyDown={e => {
               if (e.key === 'Enter') {
                 void addTask()
               }
             }}
      />
      <Button className="cursor-pointer" disabled={!isValid}
              onClick={addTask}>Add Task
      </Button>
    </div> : <></>}
  </div>
}