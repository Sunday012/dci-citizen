"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/authStore"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from 'axios'
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/useStore"
import { sendTokenToApi } from "@/api/sendToken"

// API Response Types
interface ApiError {
  detail: Array<{
    loc: [string, number]
    msg: string
    type: string
  }>
}

type ApiResponse = any

// const sendTokenToApi = async (token: string): Promise<ApiResponse> => {
//   const formData = new FormData();
//   formData.append("firebase_token", token);

//   const { data } = await axios.post<ApiResponse>('http://167.235.51.199:8000/api/v1/citizens/', 
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     }
//   );
//   console.log(data)
//   if (data.data.access_token) {
//     console.log("access_token", data.data.access_token)
//     Cookies.set('auth_token', data.data.access_token)
//   }
//   return data;
// }

export default function GoogleSignIn() {
  const { toast } = useToast()
  const { signInWithGoogle, error } = useAuthStore()
  const route = useRouter()
  const {setUser, setToken} = useUserStore()

  const tokenMutation = useMutation<
    ApiResponse,
    AxiosError<ApiError>,
    string
  >({
    mutationFn: sendTokenToApi,
    onSuccess: (data, token) => {
      console.log("firbase_token", token)
      // Cookies.set('auth_token', token, { secure: true })
      toast({
        title: "Sign In Successful",
        description: "Your account has been verified.",
        variant: "default",
      })
      console.log("user_token", data.data.access_token)
      setToken(data.data.access_token)
      setUser(data.data.user)
      if (data.data.user.kyc_verification == false) {
        route.push("/verify")
      } else {
        route.push("/")
      }
    },
    onError: (error) => {
      console.error('API Error:', error)
      
      const errorMessage = error.response?.data?.detail?.[0]?.msg ?? 
        'Failed to verify your account. Please try again.'
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  })

  const handleSignIn = async () => {
    try {
      const newUser = await signInWithGoogle()
      if (newUser) {
        const token = await newUser.getIdToken()
        
        tokenMutation.mutate(token)

        toast({
          title: "Google Sign In Successful",
          description: `Welcome, ${newUser.displayName || newUser.email}!`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error during sign in:", error)
      toast({
        title: "Sign In Failed",
        description: "An error occurred during sign in. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleSignIn} 
      className="w-full"
      disabled={tokenMutation.isPending}
    >
      {tokenMutation.isPending ? (
        "Signing in..."
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  )
}
