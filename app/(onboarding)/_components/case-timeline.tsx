"use client"

import { useEffect, useState } from "react"

interface TimelineStep {
  title: string
  subtitle?: string
  date?: string
  status: "completed" | "pending"
}

interface CaseTimelineProps {
  caseId: string
  initialStatus: string
  statusUpdateTime?: number
}

export function CaseTimeline({ caseId, initialStatus, statusUpdateTime }: CaseTimelineProps) {
  // Convert initial status to step index
  const getInitialStep = () => {
    switch (initialStatus) {
      case "in progress":
        return 2
      case "resolved":
        return 3
      case "closed":
        return 4
      default:
        return 1
    }
  }

  const [currentStep, setCurrentStep] = useState(getInitialStep())
  const [steps, setSteps] = useState<TimelineStep[]>([
    {
      title: "Report received",
      date: new Date(statusUpdateTime || Date.now()).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      status: "completed",
    },
    {
      title: "Under review",
      subtitle: "Your report is being checked for validity",
      status: "pending",
    },
    {
      title: "Case in progress",
      subtitle: "Pending...",
      status: "pending",
    },
    {
      title: "Case resolved",
      subtitle: "Pending...",
      status: "pending",
    },
  ])

  useEffect(() => {
    // Initialize steps based on current status
    setSteps((currentSteps) =>
      currentSteps.map((step, idx) => ({
        ...step,
        status: idx < currentStep ? "completed" : "pending",
        date:
          idx < currentStep
            ? new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : undefined,
      })),
    )

    // Progress to next step every 2 minutes
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        if (next <= 4) {
          // Don't go beyond the last step
          setSteps((currentSteps) =>
            currentSteps.map((step, idx) => ({
              ...step,
              status: idx < next ? "completed" : "pending",
              // Update date for newly completed step
              date:
                idx === prev
                  ? new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : step.date,
            })),
          )
          return next
        }
        clearInterval(interval)
        return prev
      })
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [currentStep])

  return (
    <div className="relative rounded-[10px] bg-[#F3F4F4] p-6 space-y-6 before:absolute before:left-[11px] before:top-0 before:h-full before:w-[2px] before:bg-[#E5E7EB]">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        return (
          <div key={index} className="relative bg-white flex items-center gap-6 p-5 rounded-[10px] ">
            <div className="absolute -left-4">
              <div className={`h-3 w-3 rounded-full ${isCompleted ? "bg-dci-blue" : "bg-gray-300"}`} />
            </div>
            <div className="flex-1 space-y-1 mr-4">
              <h3 className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-500"}`}>{step.title}</h3>
              {(step.subtitle || step.date) && <p className="text-gray-500 text-sm">{step.date || step.subtitle}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

