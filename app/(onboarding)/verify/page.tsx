"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { AuthHeader } from "@/app/_components/auth-header";
import { Icons } from "@/components/icons";
import { SuccessDialog } from "@/components/success-modal";
import { LoadingDialog } from "@/components/loading-modal";

export default function Verify() {
  const [status, setStatus] = useState<"idle" | "processing" | "success">(
    "idle"
  );
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { user, setUser } = useStore();

  // Redirect if no user or already verified
  useEffect(() => {
    if (!user || user.isVerified) {
      router.push("/");
    }
  }, [user, router]);

  // If no user, return null without redirect
  if (!user) {
    return null;
  }

  const handleSubmit = async () => {
    if (!file) return;

    setStatus("processing");
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");

    // Update user verification status
    setUser({ ...user, isVerified: true });

    // Redirect after success
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/");
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
  );
}
