import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Llena la siguiente información para crear tu cuenta
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nombre Completo</FieldLabel>
          <Input id="name" type="text" placeholder="Juan Sánchez" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Correo</FieldLabel>
          <Input id="email" type="email" placeholder="m@ejemplo.com" required />
          <FieldDescription>
            Solo usaremos tu correo para contactarte, no lo compartiremos con nadie más
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <Input id="password" type="password" required />
          <FieldDescription>
            Debe de ser al menos 8 caracteres
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmar Contraseña</FieldLabel>
          <Input id="confirm-password" type="password" required />
          <FieldDescription>Por favor, confirma tu contraseña</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Crear Cuenta</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Ya tienes cuenta?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Inicia Sesión
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
