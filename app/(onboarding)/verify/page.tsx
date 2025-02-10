"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { userStore } from "@/store/useStore"
import { AuthHeader } from "@/app/_components/auth-header"
import { Icons } from "@/components/icons"
import { SuccessDialog } from "@/components/success-modal"
import { LoadingDialog } from "@/components/loading-modal"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios, { AxiosError } from 'axios'
import { useAuthStore } from "@/store/authStore"
import Cookies from "js-cookie"
import api from "@/utils/api"
import { toast } from "@/hooks/use-toast"

// Types
interface ApiError {
  detail: Array<{
    loc: [string, number]
    msg: string
    type: string
  }>
}

interface CitizenResponse {
  citizen_id: string;
  // ... other fields
}

interface KycResponse {
  status: string;
  // ... other fields
}

export default function Verify() {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle")
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const { firebase_user, setUser } = useAuthStore()
  const {user} = userStore()
  const token = Cookies.get('auth_token')

  // Query to get citizen_id
  // const citizenQuery = useQuery<CitizenResponse, AxiosError<ApiError>>({
  //   queryKey: ['citizen'],
  //   queryFn: async () => {
  //     const token = await user?.getIdToken();
  //     const { data } = await axios.post<CitizenResponse>(
  //       '/api/v1/citizens/',
  //       { firebaseToken: token },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );
  //     return data;
  //   },
  //   enabled: !!user && !user.emailVerified,
  // });

  // KYC Mutation
  const kycMutation = useMutation<KycResponse, AxiosError<ApiError>, FormData>({
    mutationFn: async (formData) => {
      const { data } = await api.post<KycResponse>(
        '/citizens/kyc/', formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return data;
    },
    onSuccess: () => {
      setStatus("success");
      setUser({ ...firebase_user!, emailVerified: true });
      setTimeout(() => router.push("/"), 1000);
    },
    onError: (error) => {
      setStatus("idle");
      // Handle error appropriately - maybe show a toast
      toast({
        title: "KYC Verification Failed",
        description: error.response?.data?.detail?.[0]?.msg || "An error occurred during KYC verification.",
        variant: "destructive",
      })
      console.error('KYC Error:', error.response?.data);
    }
  });

  // Redirect if no user or already verified
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  // If no user, return null without redirect
  if (!token) {
    return null;
  }

  const handleSubmit = async () => {
    if (!file || !user?.user_id) return;

    setStatus("processing");
    
    const formData = new FormData();
    formData.append('citizen_id', user?.user_id);
    formData.append('kyc_file', file);

    kycMutation.mutate(formData);
  };

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
              disabled={!file || status === "processing" || kycMutation.isPending}
              onClick={handleSubmit}
            >
              {status === "processing" || kycMutation.isPending 
                ? "Processing..." 
                : "Submit"}
            </Button>
          </div>
        )}
      </div>
      {(status === "processing" || kycMutation.isPending) && (
        <LoadingDialog title="Processing" isOpen={true} />
      )}
    </div>
  );
}