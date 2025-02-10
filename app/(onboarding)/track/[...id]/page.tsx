"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { userStore } from "@/store/useStore"
import { Clock, MapPin } from "lucide-react"
import { AuthHeader } from "@/app/_components/auth-header"
import { LoadingDialog } from "@/components/loading-modal"
import { toast, useToast } from "@/hooks/use-toast"
import { CaseTimeline } from "../../_components/case-timeline"
import { useReportStatus } from "@/utils/queries/get-reports"

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
  const getCase = userStore((state) => state.getCase)
  const updateCaseStatus = userStore((state) => state.updateCaseStatus)
  // const { toast } = useToast()
  const { 
    data: reportStatus, 
    isPending, 
    error 
  } = useReportStatus(params?.id as string);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch case details",
      });
      router.push("/track");
    }
  }, [error, toast, router]);

  if (isPending) {
    return (
      <div>
        <LoadingDialog title="Searching Case ID" isOpen={true} />
      </div>
    )
  }

  if (!reportStatus || !reportStatus.success) return null;

  return (
    <div className="h-screen flex flex-col">
      <AuthHeader title="Track your case" />
      <div className="p-4 flex-1">
        <h1 className="text-xl font-semibold mb-4">Report {params?.id as string}</h1>

        <CaseTimeline
          caseId={params?.id as string}
          initialStatus={reportStatus.data.status}
          statusUpdateTime={caseDetails?.statusUpdateTime}
        />
      </div>
    </div>
  )
}