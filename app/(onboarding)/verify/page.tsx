'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthHeader } from "@/app/_components/auth-header"
import { Icons } from "@/components/icons"
import { SuccessDialog } from "@/components/success-modal"
import { LoadingDialog } from "@/components/loading-modal"
import { useAuthStore } from "@/store/authStore"
import Cookies from "js-cookie"
import { toast } from "@/hooks/use-toast"
import { submitKycVerification } from "@/api/submitKycVerification"
import { useUserStore } from "@/store/useStore"

export default function Verify() {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle")
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const { firebase_user, setUser } = useAuthStore()
  const { user } = useUserStore()
  const token = Cookies.get('auth_token')

  useEffect(() => {
    if (!token) {
      router.push("/")
    }
  }, [token, router])

  if (!token) {
    return null
  }

  const handleSubmit = async () => {
    console.log(user?.user_id)
    setStatus("processing")
    console.log("Clicked")
    if (!file || !user?.user_id) (
      console.log("no user or file")
    )

    const formData = new FormData()
    formData.append('citizen_id', user?.user_id || '')
    if (file) {
      formData.append('kyc_file', file)
    }

    const result = await submitKycVerification(formData)

    if (result.success) {
      setStatus("success")
      setTimeout(() => router.push("/"), 1000)
    } else {
      setStatus("idle")
      toast({
        title: "KYC Verification Failed",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <AuthHeader title="KYC verification" />
      <div className="p-4 flex-1">
        <h1 className="text-2xl font-bold mb-4">KYC verification</h1>
        <p className="text-muted-foreground mb-4">
          Upload a valid government ID
        </p>

        {status === "success" ? (
          <SuccessDialog title="ID submitted" isOpen={true} />
        ) : (
          <div className="space-y-4">
            <div
              className="border-2 h-[161px] border-[#E2E2E2] bg-[#F3F4F4] rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              {file ? (
                <div className="space-y-2">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Click to change file
                  </p>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center justify-center">
                  <Icons.upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-base font-semibold text-[#81889B]">
                    Add document
                  </p>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!file || status === "processing"}
              onClick={handleSubmit}
            >
              {status === "processing" ? "Processing..." : "Submit"}
            </Button>
          </div>
        )}
      </div>
      {status === "processing" && (
        <LoadingDialog title="Processing" isOpen={true} />
      )}
    </div>
  )
}