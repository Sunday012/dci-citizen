"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  onClose: () => void
}

export function DatePicker({ value, onChange, onClose }: DatePickerProps) {
  const [currentDate, setCurrentDate] = React.useState(value || new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onChange(selectedDate)
  }

  return (
    <div>
      <div className="bg-white rounded-lg mb-10 p-4 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth}>
        <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="font-semibold">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button onClick={handleNextMonth}>
        <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className={cn("text-center text-sm", day === "Sun" || day === "Sat" ? "text-red-500" : "text-gray-600")}
        >
          {day}
        </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
        <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
        const day = index + 1
        const isSelected =
          value?.getDate() === day &&
          value?.getMonth() === currentDate.getMonth() &&
          value?.getFullYear() === currentDate.getFullYear()

        return (
          <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm",
            isSelected && "bg-dci-blue text-white",
            !isSelected && "hover:bg-gray-100",
          )}
          >
          {day}
          </button>
        )
        })}
      </div>
      </div>
      <div className="mt-4">
      <Button className="w-full bg-dci-blue hover:bg-blue-700" onClick={onClose}>
        Set date
      </Button>
      </div>
    </div>
  )
}

