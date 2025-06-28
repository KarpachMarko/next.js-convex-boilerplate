import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { TextField } from "@/form/text-field"
import { SubmitButton } from "@/form/submit-button"

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext,
})
