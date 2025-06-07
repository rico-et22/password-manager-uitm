"use client"

import Link from "next/link"
import { SubmitButton } from "app/submit-button"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { register } from "app/actions/register"
import Image from "next/image"
import uitm_logo from "@/app/assets/utim_logo.png"

export default function RegisterPage() {
  const [state, formAction] = useFormState(register, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }

    if (state?.success) {
      toast.success("Konto utworzone pomyślnie!")
      router.push("/login")
    }
  }, [state, router])

  return (
    <div className="relative h-screen w-screen bg-gray-50">
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <Image
          src={uitm_logo}
          alt="Password Manager Lobo"
          className="max-w-40"
          priority
        />
      </div>
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Sign Up</h3>
            <p className="text-sm text-gray-500">
              Create an account with your email and password
            </p>
          </div>

          <form
            action={formAction}
            className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-600 uppercase"
              >
                First Name
              </label>
              <input
                name="firstName"
                placeholder="John"
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-600 uppercase"
              >
                Last Name
              </label>
              <input
                name="lastName"
                placeholder="Doe"
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-600 uppercase"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="user@utim.com"
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-600 uppercase"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="**********"
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-600 uppercase"
              >
                Repeat Password
              </label>
              <input
                type="password"
                name="passwordRepeat"
                placeholder="**********"
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>

            <SubmitButton>Sign Up</SubmitButton>

            <p className="text-center text-sm text-gray-600">
              {"Already have an account? "}
              <Link href="/login" className="font-semibold text-gray-800">
                Sign in
              </Link>
              {" instead."}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
