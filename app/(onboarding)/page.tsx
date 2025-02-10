"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, UserCircle } from "lucide-react";
import { useUserStore } from "@/store/useStore";
import { Icons } from "@/components/icons";
import Image from "next/image";

export default function Home() {
  const { user, signOut } = useUserStore();
  const router = useRouter();

  // Removed automatic redirect check

  return (
    <div
      className="h-screen pb-5 flex flex-col bg-cover bg-top relative"
      style={{
        backgroundImage: "url('/images/dci-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "top -100px center", // Moved slightly up
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay gradient that covers the entire background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000000] pointer-events-none" />

      {/* Header */}
      <div className="relative p-4 flex justify-between items-center bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Image src="/icons/dci-logo.svg" alt="DCI Logo" width={30} height={30} />
          <span className="font-semibold text-white">DCI</span>
        </div>
        <button
          onClick={() => {
            if (!user) {
              router.push("/auth");
            } else {
              router.push("/auth");
            }
          }}
          className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center font-bold"
        >
          {user ? (
            user.full_name ? (
              user.full_name.charAt(0).toUpperCase()
            ) : (
              <Icons.user className="h-6 w-6" />
            )
          ) : (
            <Icons.user className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-end items-center p-4">
        <div className="space-y-4 text-white text-center mb-8">
          <h1 className="text-5xl font-semibold">Keep Kenya Crime Free</h1>
          <p className="text-lg font-medium">Report all crimes around you as they happen</p>
        </div>
        <div className="space-y-3 w-full">
          <Button
            className="w-full bg-dci-blue hover:bg-blue-700 rounded-[40px] h-[56px]"
            onClick={() => router.push("/report")}
          >
            <Icons.speaker className="mr-2 size-[18px]" />
            Report a crime
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white rounded-[40px] h-[56px]"
            onClick={() => router.push("/track")}
          >
            <Icons.eye className="mr-2 size-[20px]" />
            Track your case
          </Button>
        </div>
      </div>
    </div>
  );
}
