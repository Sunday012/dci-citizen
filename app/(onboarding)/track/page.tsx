"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { AuthHeader } from "@/app/_components/auth-header"

export default function TrackCase() {
  const [caseId, setCaseId] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (caseId.trim()) {
      router.push(`/track/${caseId}`)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <AuthHeader title="Track your case" />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Track your case</h1>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="pl-9 pr-9"
              placeholder="Search case ID"
            />
            {caseId && (
              <button type="button" onClick={() => setCaseId("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="mt-auto">
            <Button type="submit" className="w-full mt-6" disabled={!caseId.trim()}>
              View case
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

