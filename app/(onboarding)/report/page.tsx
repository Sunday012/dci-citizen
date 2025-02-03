"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthHeader } from "@/app/_components/auth-header"
import { DatePicker } from "../_components/date-picker"
import { TimePicker } from "../_components/time-picker"
import { Icons } from "@/components/icons"
import { LoadingDialog } from "@/components/loading-modal"
import { SuccessDialog } from "@/components/success-modal"

const crimeTypes = ["Robbery", "Carjacking", "House Break-in", "Mob Justice", "Drug Trafficking"]

interface FormData {
  crimeType: string
  date: Date | null
  time: string
  location: string
  witness: string
  description: string
  files: File[]
}

export default function ReportCrime() {
  const router = useRouter()
  const [formData, setFormData] = React.useState<FormData>({
    crimeType: "",
    date: null,
    time: "",
    location: "",
    witness: "",
    description: "",
    files: [],
  })
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [showTimePicker, setShowTimePicker] = React.useState(false)
  const [showCrimeTypes, setShowCrimeTypes] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const isFormValid =
    formData.crimeType &&
    formData.date &&
    formData.time &&
    formData.location &&
    formData.witness &&
    formData.description.length >= 10

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.files.length <= 2) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...files],
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    if (!isFormValid) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)

    // Redirect after showing success
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  return (
    <>
      <div className={cn("h-screen flex flex-col", (isSubmitting || isSuccess) && "blur-sm")}>
        <AuthHeader title="Report a crime" />
        <div className="p-4 flex-1">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Crime type</label>
              <Dialog open={showCrimeTypes} onOpenChange={setShowCrimeTypes}>
                <DialogTrigger asChild>
                  <Button variant="outline" className={`w-full rounded-[10px] h-[43px] border-[#E2E2E2] ${formData.crimeType ? "text-dci-dark" : "text-[#C6C9D3]"} bg-[#F3F4F4] justify-start font-normal`}>
                    {formData.crimeType || "Select crime type---"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="px-[26px] py-[24px] bg-white rounded-[10px]">
                <DialogTitle className="text-[#81889B]">Select crime type</DialogTitle>
                  <div className="">
                    <div className="space-y-4">
                      {crimeTypes.map((type) => (
                        <button
                          key={type}
                          className="w-full p-3 flex items-center gap-3 border border-[#E2E2E2] rounded-lg hover:bg-gray-50"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, crimeType: type }))
                            setShowCrimeTypes(false)
                          }}
                        >
                          <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                            {formData.crimeType === type && <div className="w-3 h-3 rounded-full bg-dci-blue" />}
                          </div>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <label className="text-sm text-gray-600">Crime date</label>
              <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
                <DialogTrigger asChild>
                  <Button variant="outline" className={`w-full rounded-[10px] h-[43px] border-[#E2E2E2] ${formData.date ? "text-dci-dark" : "text-[#C6C9D3]"} bg-[#F3F4F4] justify-start font-normal`}>
                    {formData.date
                      ? formData.date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Select date---"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                 <DialogTitle></DialogTitle>
                  <DatePicker
                    value={formData.date}
                    onChange={(date) => {
                      setFormData((prev) => ({ ...prev, date }))
                      setShowDatePicker(false)
                    }}
                    onClose={() => setShowDatePicker(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <label className="text-sm text-gray-600">Crime time</label>
              <Dialog open={showTimePicker} onOpenChange={setShowTimePicker}>
                <DialogTrigger asChild>
                  <Button variant="outline" className={`w-full rounded-[10px] h-[43px] border-[#E2E2E2] ${formData.time ? "text-dci-dark" : "text-[#C6C9D3]"} bg-[#F3F4F4] justify-start font-normal`}>
                    {formData.time || "Select time---"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogTitle></DialogTitle>
                  <TimePicker
                    value={formData.time}
                    onChange={(time) => {
                      setFormData((prev) => ({ ...prev, time }))
                      setShowTimePicker(false)
                    }}
                    onClose={() => setShowTimePicker(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <label className="text-sm text-gray-600">Add location</label>
              <Input
                placeholder="Select location---"
                value={formData.location}
                className="placeholder:text-[#C6C9D3]"
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Eye witness</label>
              <Input
                placeholder="Add eye witness---"
                value={formData.witness}
                className="placeholder:text-[#C6C9D3]"
                onChange={(e) => setFormData((prev) => ({ ...prev, witness: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Incident description</label>
              <Textarea
                placeholder="Write a brief description---"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px] placeholder:text-[#C6C9D3]"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Upload file(s)</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <label className="aspect-square rounded-lg border border-[#E2E2E2] bg-[#F3F4F4] flex flex-col items-center justify-center cursor-pointer">
                  <Icons.upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-400">Add here</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                </label>
                {formData.files.map((file, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg border border-[#E2E2E2] bg-[#F3F4F4] flex flex-col items-center justify-center relative"
                  >
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt="Uploaded file"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-dci-blue hover:bg-blue-700" disabled={!isFormValid} onClick={handleSubmit}>
              Submit report
            </Button>
          </div>
        </div>
      </div>

      {/* Processing Modal */}
      {isSubmitting && (
        <LoadingDialog title="Processing" isOpen={true} />
      )}

      {/* Success Modal */}
      {isSuccess && (
        <SuccessDialog title="Report submitted" isOpen={true} />
      )}
    </>
  )
}

