import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export function AuthHeader({ title }: { title: string }) {
  return (
    <div>
    <div className="p-4 border-b">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-dci-blue text-white flex items-center justify-center font-bold">
            D
          </div>
          <span className="font-semibold">Logo</span>
        </div>
      </div>
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

