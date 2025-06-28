import { useFormContext } from "@/form/form-context"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"

export function SubmitButton({ label }: { label?: string }) {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={state => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) =>
        <Button type="submit" className="cursor-pointer" disabled={!canSubmit}>
          {isSubmitting ? <><Loader2Icon className="animate-spin"/>Loading</>
            : <>{label}</>}
        </Button>
      }
    />
  )
}