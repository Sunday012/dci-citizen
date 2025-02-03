"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/useStore"
import { AuthHeader } from "@/app/_components/auth-header"

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (activeTab === "signup") {
      // Handle sign up
      setUser({
        email,
        name,
        isVerified: false,
      })
      router.push("/verify")
    } else {
      // Handle sign in
      setUser({
        email,
        name: email.split("@")[0], // Using email username as name for demo
        isVerified: true,
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
          <Button variant="outline" className="w-full">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
          <Button type="submit" className="w-full bg-dci-blue hover:bg-blue-700">
            {activeTab === "signin" ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </div>
    </div>
  )
}

