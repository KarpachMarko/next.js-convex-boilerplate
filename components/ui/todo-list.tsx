"use client"

import { Task, TaskRegistrationRequest } from "@/types/taskModel"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ConvexMutationResult } from "@/hooks/useConvexMutation"
import { AnyFieldApi, useForm } from "@tanstack/react-form"
import { Loader2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { isUnauthorizedPermissionConvexError } from "@/types/errors/unauthorizedPermissionError"
import { toast } from "sonner"
import { isUnauthenticatedConvexError } from "@/types/errors/unauthenticatedError"

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
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

  const form = useForm({
    defaultValues: {
      taskText: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const taskRequest = { text: value.taskText, isCompleted: false }
      const { error } = await props.addTask({ task: taskRequest })

      if (error) {
        const defaultErrorMessage = "Failed to add task"
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
        formApi.state.values.taskText = ""
      }
    }
  })

  return <div>
    <h1 className="text-xl font-bold pb-4">Tasks TODO</h1>
    <Table>
      <TableBody>
        {props.tasks?.map(({ _id, text, isCompleted }, i) =>
          <TableRow key={_id}>
            <TableCell className="font-medium">{i + 1}.</TableCell>
            <TableCell
              className={isCompleted ? "line-through" : ""}>{text}</TableCell>
            <TableCell>
              <Checkbox
                disabled={!props.canEdit}
                checked={isCompleted}
                onCheckedChange={async (checked) => {
                  const newStatus = checked === "indeterminate" ? true : checked
                  const { error } = await props.setStatus({ id: _id, isCompleted: newStatus })
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
                }}
              />
            </TableCell>
            <TableCell>
              {props.canEdit ?
                <Button disabled={!props.canEdit} variant="destructive"
                        size="sm" className="cursor-pointer text-xs"
                        onClick={async () => {
                          const { error } = await props.deleteTask({ id: _id })
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
                        }}>Delete</Button> : <></>}
            </TableCell>
          </TableRow>,
        )}
      </TableBody>
    </Table>

    {props.canEdit ? <form onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      void form.handleSubmit()
    }} className="flex gap-2 mt-2">
      <form.Field
        name="taskText"
        validators={{
          onChange: ({ value }) =>
            !value ? "Task text id required"
              : value.length < 3
                ? "Task text should be at leat 3 characters long"
                : undefined,
          onBlurAsyncDebounceMs: 500,
        }}
        children={field => <div className={"w-full flex flex-col"}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input type="text"
                     value={field.state.value}
                     placeholder={"Task for today..."}
                     className={!field.state.meta.isValid ? "border-red-400" : ""}
                     onChange={e => field.handleChange(e.target.value)}
              />
            </TooltipTrigger>
            {field.state.meta.isValid ? <></> : <TooltipContent>
              <FieldInfo field={field}/>
            </TooltipContent>}
          </Tooltip>
        </div>}
      />
      <form.Subscribe
        selector={state => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) =>
          <Button type="submit" className="cursor-pointer" disabled={!canSubmit}>
            {isSubmitting ? <><Loader2Icon className="animate-spin"/>Please wait</>
              : <>Add Task</>}
          </Button>
        }
      />
    </form> : <></>}
  </div>
}