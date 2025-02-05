"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/store/useStore"
import { Clock, MapPin } from "lucide-react"
import { AuthHeader } from "@/app/_components/auth-header"
import { LoadingDialog } from "@/components/loading-modal"
import { useToast } from "@/hooks/use-toast"

interface CaseDetails {
  id: string
  summary: string
  date: string
  time: string
  location: string
  status: "in progress" | "resolved" | "closed"
  statusUpdateTime?: number
}

export default function CaseDetails() {
  const [isLoading, setIsLoading] = useState(true)
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null)
  const params = useParams()
  const router = useRouter()
  const getCase = useStore((state) => state.getCase)
  const updateCaseStatus = useStore((state) => state.updateCaseStatus)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCase = async () => {
      if (!params?.id) return

      setIsLoading(true)
      const caseId = params.id as string
      const result = await getCase(caseId)

      if (!result) {
        toast({
          variant: "destructive",
          title: "Case Not Found",
          description: `No case found with ID: ${caseId}`,
        })
        router.push("/track")
        return
      }

      setCaseDetails(result)
      setIsLoading(false)

      // Set timer to update status to resolved after 1 minute if in progress
      if (result.status === "in progress") {
        const timeElapsed = Date.now() - (result.statusUpdateTime || 0)
        const remainingTime = Math.max(0, 60000 - timeElapsed)

        if (remainingTime > 0) {
          setTimeout(() => {
            updateCaseStatus(caseId, "resolved")
            setCaseDetails((prev) => (prev ? { ...prev, status: "resolved" } : null))
          }, remainingTime)
        } else {
          // If more than a minute has passed, update immediately
          updateCaseStatus(caseId, "resolved")
          setCaseDetails((prev) => (prev ? { ...prev, status: "resolved" } : null))
        }
      }
    }

    fetchCase()
  }, [params?.id, getCase, router, updateCaseStatus, toast])

  if (isLoading) {
    return (
      <div>
        <LoadingDialog title="Searching Case ID" isOpen={true} />
      </div>
    )
  }

  if (!caseDetails) return null

  return (
    <div className="h-screen flex flex-col">
      <AuthHeader title="Track your case" />
      <div className="p-4 flex-1">
        <h1 className="text-xl font-semibold mb-4">Case {caseDetails.id}</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-base font-medium mb-2">Case summary</h2>
            <p className="text-[#81889B]">{caseDetails.summary}</p>
          </div>

          <div className="space-y-4 divide-y">
            <div className="flex items-center p-2 gap-2">
              <div className="w-5 h-5 mt-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-muted-foreground">
                  <path
                    fill="currentColor"
                    d="M19,4H18V2H16V4H8V2H6V4H5A2,2 0 0,0 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M19,8H5V6H19V8Z"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">Date</div>
                <div>{caseDetails.date}</div>
              </div>
            </div>

            <div className="flex items-center p-2 gap-2">
              <Clock className="w-5 h-5 mt-1 text-muted-foreground" />
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">Time</div>
                <div>{caseDetails.time}</div>
              </div>
            </div>

            <div className="flex items-center p-2 gap-2">
              <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">Location</div>
                <div>{caseDetails.location}</div>
              </div>
            </div>

            <div className="flex items-center p-2 gap-2">
              <div className="w-5 h-5 mt-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-muted-foreground">
                  <path
                    fill="currentColor"
                    d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      caseDetails.status === "in progress"
                        ? "bg-yellow-400"
                        : caseDetails.status === "resolved"
                          ? "bg-green-400"
                          : "bg-gray-400"
                    }`}
                  />
                  <span className="capitalize">{caseDetails.status.replace("-", " ")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}