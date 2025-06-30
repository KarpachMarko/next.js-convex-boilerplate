import { useFieldContext } from "@/form/form-context"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AnyFieldApi } from "@tanstack/react-form"

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.map(e => e?.message ?? e)}</em>
      ) : null}
    </>
  )
}

export function TextField({ label, placeholder, className }: {
  label?: string,
  placeholder?: string,
  className?: string
}) {
  const field = useFieldContext<string>()
  return (
    <label className={className}>
      {label ? <div className={"text-sm mb-0.5"}>{label}</div> : null}
      <Tooltip>
        <TooltipTrigger asChild>
          <Input type="text"
                 value={field.state.value}
                 placeholder={placeholder}
                 className={`${!field.state.meta.isValid ? "border-red-400" : ""} ${!field.state.meta.isValid ? "focus-visible:ring-red-400" : ""} focus-visible:ring-[2px]`}
                 onChange={e => field.handleChange(e.target.value)}
          />
        </TooltipTrigger>
        {field.state.meta.isValid ? null : <TooltipContent side={"bottom"}>
          <FieldInfo field={field}/>
        </TooltipContent>}
      </Tooltip>
    </label>
  )
}