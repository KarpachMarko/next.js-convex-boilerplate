"use client"

import { Task } from "@/types/taskModel"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { useAppForm } from "@/form/form-context"
import { useCallback, useState } from "react"
import { addTask, deleteTask, setStatus } from "@/app/tasks/actions"
import { isUnauthenticatedConvexError } from "@/types/errors/unauthenticatedError"
import { isUnauthorizedPermissionConvexError } from "@/types/errors/unauthorizedPermissionError"
import { isSerializedConvexError, toConvexError } from "@/lib/error-utils"
import { FieldValidationError, isValidationError } from "@/types/errors/validationError"
import { z } from "zod"

function handleError(error: any, defaultErrorMessage: string) {
  if (isSerializedConvexError(error)) {
    handleError(toConvexError(error), defaultErrorMessage)
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
      description: <p>You do not have required
        permission: <strong>{error.data.requiredPermission}</strong></p>
    })
    return
  }
  toast(defaultErrorMessage)
}

function TodoListRow({ rowNum, task, canEdit }: {
  rowNum: number,
  task: Task,
  canEdit: boolean,
}) {
  const [changeStatusLoading, setChangeStatusLoading] = useState(false)
  const runChangeStatus = useCallback(async (id: Id<"tasks">, isCompleted: boolean) => {
    setChangeStatusLoading(true)
    const { error } = await setStatus({ id, isCompleted })
    if (error) {
      handleError(error, "Failed to change status")
    }
    setChangeStatusLoading(false)
  }, [setChangeStatusLoading])

  const [deleteLoading, setDeleteLoading] = useState(false)
  const runDeleteTask = useCallback(async (id: Id<"tasks">) => {
    setDeleteLoading(true)
    const { error } = await deleteTask({ id })
    if (error) {
      handleError(error, "Failed delete task")
    }
    setDeleteLoading(false)
  }, [setDeleteLoading])

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
                  size="sm" className="cursor-pointer text-xs flex items-center w-full"
                  onClick={() => runDeleteTask(task._id)}>
            {deleteLoading ? <Loader2Icon className={"animate-spin"}/> : <span>Delete</span>}
          </Button> : null}
      </TableCell>
    </TableRow>
  )
}

export function TodoList(props: {
  tasks: Task[],
  canEdit: boolean,
}) {

  const handleSubmit = useCallback(async (
    taskText: string,
    handleValidationError: (error: FieldValidationError) => void,
    onSuccess: () => void) => {
    const taskRequest = { text: taskText, isCompleted: false }
    const { error } = await addTask({ task: taskRequest })
    if (!error) {
      onSuccess()
      return
    }

    if (isSerializedConvexError(error)) {
      const convexError = toConvexError(error)
      if (isValidationError(convexError)) {
        convexError.data.errors.forEach(handleValidationError)
      }
      return
    }

    handleError(error, "Failed to add task")
  }, [])

  const taskRequestSchema = z.object({
    taskText: z.string().min(3, "Task text should be at least 3 characters long")
  })

  const form = useAppForm({
    defaultValues: {
      taskText: "",
    },
    validators: {
      onChange: taskRequestSchema
    },
    onSubmit: async ({
      value,
      formApi
    }) => handleSubmit(value.taskText, (err) => {
        if (err.field === "text") {
          formApi.setFieldMeta("taskText", meta => ({ ...meta, errorMap: { "onServer": err.message } }))
        }
      },
      () => formApi.setFieldValue("taskText", ""))
  })

  return <div>
    <Table>
      <TableBody>
        {props.tasks?.map(({ _id, text, isCompleted }, i) =>
          <TodoListRow key={_id}
                       rowNum={i + 1}
                       task={{ _id, text, isCompleted }}
                       canEdit={props.canEdit}/>
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
          children={(field) => <field.TextField className={"w-full"} label={"Task text"}/>}
        />
        <form.SubmitButton label={"Add task"}/>
      </form>
    </form.AppForm> : <></>}
  </div>
}