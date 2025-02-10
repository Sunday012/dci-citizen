import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import { Icons } from "@/components/icons"

export function AuthHeader({ title }: { title: string }) {
  return (
    <div>
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image src="/icons/dci-logo-blue.svg" alt="DCI Logo" width={30} height={30} />
          <span className="font-semibold text-black">DCI</span>
        </div>
      </div>
      {title === "Report a crime" && (
        <div className="flex items-center gap-2">
          <Icons.call />
        </div>
      )}
    </div>
    <div className="p-4">
    <div className="p-2 w-8 h-8 flex items-center justify-center bg-dci-grey rounded-full">
    <Link href="/" className="text-muted-foreground ">
          <ChevronLeft className="h-6 w-6" />
        </Link>
    </div>
    </div>
    </div>
  )
}

