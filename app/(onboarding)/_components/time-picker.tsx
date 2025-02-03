"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  onClose: () => void
}

export function TimePicker({ value, onChange, onClose }: TimePickerProps) {
  const [hours, setHours] = React.useState(value ? Number.parseInt(value.split(":")[0]) : 12)
  const [minutes, setMinutes] = React.useState(value ? Number.parseInt(value.split(":")[1]) : 0)
  const [period, setPeriod] = React.useState<"AM" | "PM">(value?.includes("PM") ? "PM" : "AM")

  const handleTimeSelect = () => {
    const formattedHours = hours.toString().padStart(2, "0")
    const formattedMinutes = minutes.toString().padStart(2, "0")
    onChange(`${formattedHours}:${formattedMinutes} ${period}`)
    onClose()
  }

  return (
    <div>
    <div className="bg-white rounded-lg p-4 w-full max-w-sm">
      <div className="flex justify-center items-center gap-2 text-3xl mb-4">
        <div className="flex flex-col items-center">
          <button onClick={() => setHours((prev) => (prev % 12) + 1)} className="text-gray-400 hover:text-gray-600">
            {(((hours - 1 + 11) % 12) + 1).toString().padStart(2, "0")}
          </button>
          <div className="font-bold">{hours.toString().padStart(2, "0")}</div>
          <button onClick={() => setHours((prev) => (prev % 12) + 1)} className="text-gray-400 hover:text-gray-600">
            {((hours + 1) % 12 || 12).toString().padStart(2, "0")}
          </button>
        </div>

        <div className="font-bold">:</div>

        <div className="flex flex-col items-center">
          <button onClick={() => setMinutes((prev) => (prev + 59) % 60)} className="text-gray-400 hover:text-gray-600">
            {((minutes + 59) % 60).toString().padStart(2, "0")}
          </button>
          <div className="font-bold">{minutes.toString().padStart(2, "0")}</div>
          <button onClick={() => setMinutes((prev) => (prev + 1) % 60)} className="text-gray-400 hover:text-gray-600">
            {((minutes + 1) % 60).toString().padStart(2, "0")}
          </button>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => setPeriod("AM")}
            className={cn("px-2 py-1 rounded", period === "AM" ? "bg-dci-blue text-white" : "text-gray-600")}
          >
            AM
          </button>
          <button
            onClick={() => setPeriod("PM")}
            className={cn("px-2 py-1 rounded", period === "PM" ? "bg-dci-blue text-white" : "text-gray-600")}
          >
            PM
          </button>
        </div>
      </div>

    </div>
      <Button className="w-full mt-6 bg-dci-blue hover:bg-blue-700" onClick={handleTimeSelect}>
        Set time
      </Button>
    </div>
  )
}

