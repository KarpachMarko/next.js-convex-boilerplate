"use client"

import { Task, TaskRegistrationRequest } from "@/types/taskModel"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ConvexMutationResult } from "@/hooks/useConvexMutation"
import { Loader2Icon } from "lucide-react"
import { isUnauthorizedPermissionConvexError } from "@/types/errors/unauthorizedPermissionError"
import { toast } from "sonner"
import { isUnauthenticatedConvexError } from "@/types/errors/unauthenticatedError"
import { isValidationError } from "@/types/errors/validationError"
import { useAppForm } from "@/form/form-context"
import { useCallback, useState } from "react"

function TodoListRow({ rowNum, task, canEdit, setStatus, deleteTask }: {
  rowNum: number,
  task: Task,
  canEdit: boolean,
  setStatus: ({}: { id: Id<"tasks">, isCompleted: boolean }) => Promise<ConvexMutationResult<void>>,
  deleteTask: ({}: {
    id: Id<"tasks">
  }) => Promise<ConvexMutationResult<void>>
}) {
  const [changeStatusLoading, setChangeStatusLoading] = useState(false)
  const runChangeStatus = useCallback(async (id: Id<"tasks">, isCompleted: boolean) => {
    setChangeStatusLoading(true)
    const { error } = await setStatus({ id, isCompleted })
    setChangeStatusLoading(false)
    if (error) {
      const defaultErrorMessage = "Failed change status"
      if (isUnauthenticatedConvexError(error)) {
        toast(defaultErrorMessage, {
          description: "Unauthenticated"
        })
        return
      }
      if (isUnauthorizedPermissionConvexError(error)) {
        toast(defaultErrorMessage, {
          description: <p>You do not have required
            permission: <strong>{error.data.requiredPermission}</strong></p>
        })
        return
      }
      toast(defaultErrorMessage)
    }
  }, [setStatus, setChangeStatusLoading])

  const [deleteLoading, setDeleteLoading] = useState(false)
  const runDeleteTask = useCallback(async (id: Id<"tasks">) => {
    setDeleteLoading(true)
    const { error } = await deleteTask({ id })
    setDeleteLoading(false)
    if (error) {
      const defaultErrorMessage = "Failed delete task"
      if (isUnauthenticatedConvexError(error)) {
        toast(defaultErrorMessage, {
          description: "Unauthenticated"
        })
        return
      }
      if (isUnauthorizedPermissionConvexError(error)) {
        toast(defaultErrorMessage, {
          description: <p>You do not have required
            permission: <strong>{error.data.requiredPermission}</strong></p>
        })
        return
      }
      toast(defaultErrorMessage)
    }
  }, [deleteTask, setDeleteLoading])

  return (
    <TableRow>
      <TableCell className="font-medium">{rowNum}.</TableCell>
      <TableCell
        className={task.isCompleted ? "line-through" : ""}>{task.text}</TableCell>
      <TableCell>
        <Checkbox
          loading={changeStatusLoading}
          disabled={!canEdit}
          checked={task.isCompleted}
          onCheckedChange={(checked) => {
            const newStatus = checked === "indeterminate" ? true : checked
            void runChangeStatus(task._id, newStatus)
          }}
        />
      </TableCell>
      <TableCell>
        {canEdit ?
          <Button disabled={!canEdit} variant="destructive"
                  size="sm" className="cursor-pointer text-xs flex items-center"
                  onClick={() => runDeleteTask(task._id)}>
            {deleteLoading ? <Loader2Icon className={"animate-spin"}/> : null}
            Delete
          </Button> : null}
      </TableCell>
    </TableRow>
  )
}

export function TodoList(props: {
  tasks: Task[],
  canEdit: boolean,
  addTask: ({ task }: {
    task: TaskRegistrationRequest
  }) => Promise<ConvexMutationResult<Task>>,
  setStatus: ({}: { id: Id<"tasks">, isCompleted: boolean }) => Promise<ConvexMutationResult<void>>,
  deleteTask: ({}: {
    id: Id<"tasks">
  }) => Promise<ConvexMutationResult<void>>,
}) {

  const form = useAppForm({
    defaultValues: {
      taskText: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const taskRequest = { text: value.taskText, isCompleted: false }
      const { error } = await props.addTask({ task: taskRequest })

      if (error) {
        const defaultErrorMessage = "Failed to add task"
        if (isValidationError(error)) {
          error.data.errors.forEach(err => {
            if (err.field === "text") {
              formApi.setFieldMeta("taskText", meta => ({ ...meta, errorMap: { "onServer": err.message } }))
            }
          })
          return
        }
        if (isUnauthenticatedConvexError(error)) {
          toast(defaultErrorMessage, {
            description: "Unauthenticated"
          })
          return
        }
        if (isUnauthorizedPermissionConvexError(error)) {
          toast(defaultErrorMessage, {
            description: <p>You do not have required permission: <strong>{error.data.requiredPermission}</strong></p>
          })
          return
        }
        toast(defaultErrorMessage)
      } else {
        formApi.setFieldValue("taskText", "")
      }
    }
  })

  return <div>
    <h1 className="text-xl font-bold pb-4">Tasks TODO</h1>
    <Table>
      <TableBody>
        {props.tasks?.map(({ _id, text, isCompleted }, i) =>
          <TodoListRow key={_id}
                       rowNum={i + 1}
                       task={{ _id, text, isCompleted }}
                       canEdit={props.canEdit}
                       setStatus={props.setStatus}
                       deleteTask={props.deleteTask}/>
        )}
      </TableBody>
    </Table>

    {props.canEdit ? <form.AppForm>
      <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }} className="flex gap-2 mt-2 items-end">
        <form.AppField
          name="taskText"
          validators={{
            onChange: ({ value }) =>
              !value ? "Task text id required"
                : value.length < 3
                  ? "Task text should be at leat 3 characters long"
                  : undefined,
            onBlurAsyncDebounceMs: 500,
          }}
          children={(field) => <field.TextField className={"w-full"} label={"Task text"}/>}
        />
        <form.SubmitButton label={"Add task"}/>
      </form>
    </form.AppForm> : <></>}
  </div>
}