// app/actions/register.ts
"use server"

import { z } from "zod"
import { createUser, getUser } from "app/db"

const registerSchema = z
    .object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
        passwordRepeat: z.string(),
        firstName: z.string().min(1, { message: "First name is required" }),
        lastName: z.string().min(1, { message: "Last name is required" }),
    })
    .refine((data) => data.password === data.passwordRepeat, {
        message: "Passwords must match",
        path: ["passwordRepeat"],
    })

export async function register(prevState: any, formData: FormData | null) {
  if (!formData) return

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    passwordRepeat: formData.get("passwordRepeat"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  }

  const result = registerSchema.safeParse(data)

  if (!result.success) {
    const error = result.error.errors[0].message
    return { error }
  }

  const existing = await getUser(result.data.email)

  if (existing.length > 0) {
    return { error: "User already exist!" }
  }

  await createUser(
    result.data.email,
    result.data.password,
    result.data.firstName,
    result.data.lastName
  )

  return { success: true }
}
