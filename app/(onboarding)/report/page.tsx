"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
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
import { toast } from "@/hooks/use-toast"
import api from "@/utils/api"
import Cookies from 'js-cookie'
import { ReportIdDialog } from "../_components/report-dialog-id"
import { useUserStore } from "@/store/useStore"
 // Optional: for error notifications

const crimeTypes = ["Robbery", "Carjacking", "House Break-in", "Mob Justice", "Drug Trafficking"]

interface FormData {
  crimeType: string
  crime_date: Date | null
  crime_time: string
  crime_location: string
  eye_witness: string
  incident_description: string
  report_files: File[]
}

interface ReportResponse {
  data: {
    user_id: string;
    assigned_officer: string | null;
    report_id: string;
  };
  message: string;
  status_code: number;
  success: boolean;
}

export default function ReportCrime() {
  const router = useRouter()
  const [formData, setFormData] = React.useState<FormData>({
    crimeType: "",
    crime_date: null,
    crime_time: "",
    crime_location: "",
    eye_witness: "",
    incident_description: "",
    report_files: [],
  })
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const [showTimePicker, setShowTimePicker] = React.useState(false)
  const [showCrimeTypes, setShowCrimeTypes] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [data, setData] = React.useState<ReportResponse | undefined>()
  const {user, token} = useUserStore()

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    let hours24 = parseInt(hours, 10);
    
    if (hours24 === 12) {
      hours24 = modifier === 'PM' ? 12 : 0;
    } else if (modifier === 'PM') {
      hours24 = hours24 + 12;
    }
    
    return `${hours24.toString().padStart(2, '0')}:${minutes}`;
  }

  const isFormValid =
    formData.crimeType &&
    formData.crime_date &&
    formData.crime_time &&
    // formData.eye_witness &&
    formData.crime_location &&
    formData.incident_description.length >= 10

  // API integration using TanStack Query
  const { mutate: submitReport, isPending, isSuccess } = useMutation<ReportResponse, Error, FormData>({
    mutationFn: async (data: FormData) => {
      const endpoint = token 
        ? '/citizens/report/'
        : '/citizens/report/anonymous'
      
      const formDataToSend = new FormData()
      const time24 = convertTo24Hour(data.crime_time)
      
      // Append all form fields
      formDataToSend.append("crime_type", data.crimeType)
      formDataToSend.append("crime_date", data.crime_date ? data.crime_date.toISOString().split('T')[0] : "")
      formDataToSend.append("crime_time", time24)
      formDataToSend.append("crime_location", data.crime_location)
      formDataToSend.append("eye_witness", user?.user_id || "")
      formDataToSend.append("incident_description", data.incident_description)
      
      // Append files
      data.report_files.forEach((file) => {
        formDataToSend.append(`report_files`, file)
      })
  
      try {
        const response = await api.post(endpoint, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })
        return response.data
      } catch (error) {
        console.error('API Error:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
      setData(data)
      setIsOpen(true)
      toast({
        title: "Report submitted",
        description: "Your report has been submitted successfully.",
        variant: "default",
      })
    },
    onError: (error: any) => {
      console.error('Submission error:', error)
      toast({
        title: "Error submitting report",
        description: error.message || "An error occurred while submitting your report. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.report_files.length <= 2) {
      setFormData((prev) => ({
        ...prev,
        report_files: [...prev.report_files, ...files],
      }))
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.report_files.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    if (!isFormValid) return
    const token = Cookies.get('auth_token')
    console.log('Token at submission:', token)
    submitReport(formData)
  }

  // Rest of your component remains the same until the return statement

  return (
    <>
      <div className={cn("h-screen flex flex-col", (isPending || isSuccess) && "blur-sm")}>
        {/* Rest of your JSX remains the same */}
        {/* Just update the Button onClick to use the new handleSubmit */}
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
                <DialogContent className="px-[26px] py-[24px] bg-white w-[90%] rounded-[10px]">
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
                  <Button variant="outline" className={`w-full rounded-[10px] h-[43px] border-[#E2E2E2] ${formData.crime_date ? "text-dci-dark" : "text-[#C6C9D3]"} bg-[#F3F4F4] justify-start font-normal`}>
                    {formData.crime_date
                      ? formData.crime_date.toLocaleDateString("en-US", {
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
                    value={formData.crime_date}
                    onChange={(crime_date) => {
                      setFormData((prev) => ({ ...prev, crime_date }))
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
                  <Button variant="outline" className={`w-full rounded-[10px] h-[43px] border-[#E2E2E2] ${formData.crime_time ? "text-dci-dark" : "text-[#C6C9D3]"} bg-[#F3F4F4] justify-start font-normal`}>
                    {formData.crime_time || "Select time---"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogTitle></DialogTitle>
                  <TimePicker
                    value={formData.crime_time}
                    onChange={(crime_time) => {
                      setFormData((prev) => ({ ...prev, crime_time }))
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
                value={formData.crime_location}
                className="placeholder:text-[#C6C9D3]"
                onChange={(e) => setFormData((prev) => ({ ...prev, crime_location: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Incident description</label>
              <Textarea
                placeholder="Write a brief description---"
                value={formData.incident_description}
                onChange={(e) => setFormData((prev) => ({ ...prev, incident_description: e.target.value }))}
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
                {formData.report_files.map((file, index) => (
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
        <Button 
          className="w-full bg-dci-blue hover:bg-blue-700" 
          disabled={!isFormValid || isPending} 
          onClick={handleSubmit}
        >
          {isPending ? "Submitting..." : "Submit report"}
        </Button>
      </div>
      </div>
      </div>

      {/* Processing Modal */}
      {isPending && (
        <LoadingDialog title="Processing" isOpen={true} />
      )}

      {/* Success Modal */}
      {isSuccess && (
        // <SuccessDialog 
        //   title="Your report has been submitted for further review and action" 
        //   isOpen={isOpen} 
        //   onClose={handleClose} 
        // />
        <ReportIdDialog reportId={data?.data.report_id} open={isOpen} onOpenChange={handleClose} />
      )}
    </>
  )
}
