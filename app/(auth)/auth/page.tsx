"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/store/useStore"
import { AuthHeader } from "@/app/_components/auth-header"
import GoogleSignIn from "../_components/google-signin"

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [full_name, setName] = useState("")
  const router = useRouter()
  const setUser = useUserStore((state) => state.setUser)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (activeTab === "signup") {
      // Handle sign up
      setUser({
        email,
        full_name,
      })
      router.push("/verify")
    } else {
      // Handle sign in
      setUser({
        email,
        full_name: email.split("@")[0], // Using email username as name for demo
      })
      router.push("/")
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <AuthHeader title="Authentication" />
      <div className="flex gap-4 p-4 border-b">
        <button
          className={`pb-2 px-1 font-semibold text-[20px] ${
            activeTab === "signin" ? "text-dci-blue border-b-2 border-dci-blue" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("signin")}
        >
          Sign in
        </button>
        <button
          className={`pb-2 px-1 font-semibold text-[20px] ${
            activeTab === "signup" ? "text-dci-blue border-b-2 border-dci-blue" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          Sign up
        </button>
      </div>
      <div className="p-4 flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* {activeTab === "signup" && (
            <div>
              <label className="text-sm text-muted-foreground">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="mt-1"
                required
              />
            </div>
          )} */}
          <div>
            <label className="text-sm text-muted-foreground">Email address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="mt-1"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          <GoogleSignIn />
          <Button type="submit" className="w-full bg-dci-blue hover:bg-blue-700">
            {activeTab === "signin" ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </div>
    </div>
  )
}

