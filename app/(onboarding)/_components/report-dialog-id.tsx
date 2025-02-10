"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Copy, Download } from "lucide-react"

interface ReportDialogProps {
  reportId: string | undefined
  open: boolean
  onOpenChange?: () => void
}

export function ReportIdDialog({ reportId, open, onOpenChange }: ReportDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (reportId) {
      await navigator.clipboard.writeText(reportId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0">
        <DialogTitle></DialogTitle>
        <div className="p-6 space-y-6 ">
        <div className="bg-white flex gap-6 flex-col items-center justify-center rounded-[10px] py-8">
          <div className="space-y-2 border-b w-[90%] pb-2">
            <h2 className="text-center text-base text-gray-600">Report ID</h2>
            <div
              className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-80"
              onClick={handleCopy}
            >
              <div className="text-2xl font-semibold">{reportId}</div>
              <button className="flex items-center gap-1 text-sm text-gray-500">
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Tap to copy"}
              </button>
            </div>
          </div>

          <div className="bg-[#F7F4EB] p-4 w-[263px] rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-[#F0C22D] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              This is an important code, make sure to copy, screenshot or download PDF
            </p>
          </div>
        </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-dci-blue hover:bg-blue-800 text-white h-12 text-base"
              onClick={() => {
                // Add PDF download logic here
                console.log("Downloading PDF...")
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download PDF
            </Button>

            <Button variant="outline" className="w-full h-12 text-base font-normal" onClick={onOpenChange}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

