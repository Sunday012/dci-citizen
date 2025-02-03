"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function AuthTabs() {
  const pathname = usePathname()

  return (
    <div className="flex gap-4 p-4 border-b">
      <Link
        href="/signin"
        className={`pb-2 px-1 ${pathname === "/signin" ? "text-dci-blue border-b-2 border-dci-blue" : "text-muted-foreground"}`}
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className={`pb-2 px-1 ${pathname === "/signup" ? "text-dci-blue border-b-2 border-dci-blue" : "text-muted-foreground"}`}
      >
        Sign up
      </Link>
    </div>
  )
}

