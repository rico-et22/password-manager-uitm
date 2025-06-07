"use client"

import Link from "next/link"
import { Form } from "app/form"
import { login } from "app/actions/login"
import { SubmitButton } from "app/submit-button"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import uitm_logo from "@/app/assets/utim_logo.png"

export default function Login() {
  const [state, formAction] = useFormState(login, null)

  return (
    <div className="relative h-screen w-screen bg-gray-50">
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <Image
          src={uitm_logo}
          alt="Password Manager Logo"
          className="max-w-40"
          priority
        />
      </div>
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Sign In</h3>
            <p className="text-sm text-gray-500">
              Use your email and password to sign in
            </p>
          </div>
          <Form action={formAction}>
            <FormWrapper state={state} />
          </Form>
        </div>
      </div>
    </div>
  )
}

function FormWrapper({ state }: { state?: any }) {
  const router = useRouter()

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }

    if (state?.success) {
      router.push("/home")
    }
  }, [state, router])

  return (
    <>
      <SubmitButton>Sign in</SubmitButton>
      <p className="text-center text-sm text-gray-600">
        {"Don't have an account? "}
        <Link href="/register" className="font-semibold text-gray-800">
          Sign up
        </Link>
        {" for free."}
      </p>
    </>
  )
}
