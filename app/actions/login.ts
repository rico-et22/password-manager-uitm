// app/actions/login.ts
"use server"

import { z } from "zod"
import { signIn } from "app/auth"

// Zod schema
const loginSchema = z.object({
  email: z.string().email({ message: "Niepoprawny email" }),
  password: z.string().min(1, { message: "Hasło jest wymagane" }),
})

export async function login(prevState: any, formData: FormData | null) {
  if (!formData) return

  const email = formData.get("email")
  const password = formData.get("password")

  // Validation
  const result = loginSchema.safeParse({ email, password })

  if (!result.success) {
    const errorMessage = result.error.errors[0].message
    return { error: errorMessage }
  }

  try {
    await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    })

    return { success: true }
  } catch (err) {
    return { error: "Nieprawidłowy email lub hasło" }
  }
}
